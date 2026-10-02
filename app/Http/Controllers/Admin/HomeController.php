<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Appointment;
use App\Models\Complaint;
use App\Models\Message;
use App\Models\PageVisit;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use SoDe\Extend\Response;

class HomeController extends BasicController
{
    public $reactView = 'Admin/Home';
    public $reactRootView = 'admin';

    public function setReactViewProperties(Request $request)
    {
        $period = $request->query('period', '30d');
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');

        return [
            'initialAnalytics' => $this->getAnalyticsData($period, $startDate, $endDate)
        ];
    }

    /**
     * API endpoint to dynamically retrieve analytics based on range
     */
    public function analytics(Request $request)
    {
        $response = new Response();
        try {
            $period = $request->input('period', '30d');
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');

            $data = $this->getAnalyticsData($period, $startDate, $endDate);
            $response->status = 200;
            $response->message = 'Operación correcta';
            $response->data = $data;
        } catch (\Throwable $th) {
            $response->status = 400;
            $response->message = $th->getMessage();
        }

        return response($response->toArray(), $response->status);
    }

    public function getAnalyticsData(?string $period = '30d', ?string $startDate = null, ?string $endDate = null)
    {
        $now = Carbon::now();
        $start = null;
        $end = Carbon::now()->endOfDay();

        switch ($period) {
            case 'today':
                $start = Carbon::today()->startOfDay();
                $end = Carbon::now();
                $prevStart = (clone $start)->subDay();
                $prevEnd = (clone $now)->subDay();
                $groupBy = 'hour';
                break;
            case '7d':
                $start = Carbon::now()->subDays(6)->startOfDay();
                $prevStart = (clone $start)->subDays(7);
                $prevEnd = (clone $start)->subSecond();
                $groupBy = 'day';
                break;
            case 'month':
                $start = Carbon::now()->startOfMonth();
                $prevStart = (clone $start)->subMonth();
                $prevEnd = (clone $start)->subSecond();
                $groupBy = 'day';
                break;
            case 'year':
                $start = Carbon::now()->startOfYear();
                $prevStart = (clone $start)->subYear();
                $prevEnd = (clone $start)->subSecond();
                $groupBy = 'month';
                break;
            case 'custom':
                if ($startDate && $endDate) {
                    $start = Carbon::parse($startDate)->startOfDay();
                    $end = Carbon::parse($endDate)->endOfDay();
                    $diffDays = $start->diffInDays($end);
                    $prevStart = (clone $start)->subDays($diffDays + 1);
                    $prevEnd = (clone $start)->subSecond();
                    $groupBy = $diffDays > 60 ? 'month' : ($diffDays > 1 ? 'day' : 'hour');
                } else {
                    $start = Carbon::now()->subDays(29)->startOfDay();
                    $prevStart = (clone $start)->subDays(30);
                    $prevEnd = (clone $start)->subSecond();
                    $groupBy = 'day';
                }
                break;
            case '30d':
            default:
                $start = Carbon::now()->subDays(29)->startOfDay();
                $prevStart = (clone $start)->subDays(30);
                $prevEnd = (clone $start)->subSecond();
                $groupBy = 'day';
                $period = '30d';
                break;
        }

        // Current period metrics
        $visitsQuery = PageVisit::whereBetween('visited_at', [$start, $end]);
        $totalVisits = (clone $visitsQuery)->count();
        $uniqueVisitors = (clone $visitsQuery)->distinct('session_id')->count('session_id');

        $appointmentsCount = Appointment::whereBetween('created_at', [$start, $end])->count();
        $pendingAppointments = Appointment::where('seen', false)->count();

        $messagesCount = Message::whereBetween('created_at', [$start, $end])->count();
        $unreadMessages = Message::where('seen', false)->count();

        $complaintsCount = Complaint::whereBetween('created_at', [$start, $end])->count();

        // Previous period metrics for comparison (+X% / -X%)
        $prevVisits = PageVisit::whereBetween('visited_at', [$prevStart, $prevEnd])->count();
        $prevUniques = PageVisit::whereBetween('visited_at', [$prevStart, $prevEnd])->distinct('session_id')->count('session_id');
        $prevAppointments = Appointment::whereBetween('created_at', [$prevStart, $prevEnd])->count();
        $prevMessages = Message::whereBetween('created_at', [$prevStart, $prevEnd])->count();

        $calcGrowth = function ($current, $previous) {
            if ($previous == 0) {
                return $current > 0 ? 100 : 0;
            }
            return round((($current - $previous) / $previous) * 100, 1);
        };

        $visitsGrowth = $calcGrowth($totalVisits, $prevVisits);
        $uniquesGrowth = $calcGrowth($uniqueVisitors, $prevUniques);
        $appointmentsGrowth = $calcGrowth($appointmentsCount, $prevAppointments);
        $messagesGrowth = $calcGrowth($messagesCount, $prevMessages);

        // Conversion rate
        $conversionRate = $uniqueVisitors > 0
            ? round((($appointmentsCount + $messagesCount) / $uniqueVisitors) * 100, 2)
            : 0;

        // Timeline generation based on $groupBy
        $timeline = [];
        if ($groupBy === 'hour') {
            $maxHour = $start->isToday() ? (int) $now->format('H') : 23;
            for ($h = 0; $h <= $maxHour; $h++) {
                $hStr = str_pad($h, 2, '0', STR_PAD_LEFT);
                $timeline[$hStr] = [
                    'label' => $hStr . ':00',
                    'visits' => 0,
                    'uniques' => 0,
                ];
            }
            $hourlyVisits = PageVisit::whereBetween('visited_at', [$start, $end])
                ->select(DB::raw('DATE_FORMAT(visited_at, "%H") as hour'), DB::raw('COUNT(*) as total'), DB::raw('COUNT(DISTINCT session_id) as uniques'))
                ->groupBy('hour')
                ->get();
            foreach ($hourlyVisits as $row) {
                if (isset($timeline[$row->hour])) {
                    $timeline[$row->hour]['visits'] = (int) $row->total;
                    $timeline[$row->hour]['uniques'] = (int) $row->uniques;
                }
            }
        } elseif ($groupBy === 'month') {
            $curr = (clone $start)->startOfMonth();
            while ($curr <= $end) {
                $mKey = $curr->format('Y-m');
                $monthNames = [
                    '01' => 'Ene', '02' => 'Feb', '03' => 'Mar', '04' => 'Abr',
                    '05' => 'May', '06' => 'Jun', '07' => 'Jul', '08' => 'Ago',
                    '09' => 'Set', '10' => 'Oct', '11' => 'Nov', '12' => 'Dic'
                ];
                $timeline[$mKey] = [
                    'label' => ($monthNames[$curr->format('m')] ?? '') . ' ' . $curr->format('Y'),
                    'visits' => 0,
                    'uniques' => 0,
                ];
                $curr->addMonth();
            }
            $monthlyVisits = PageVisit::whereBetween('visited_at', [$start, $end])
                ->select(DB::raw('DATE_FORMAT(visited_at, "%Y-%m") as m'), DB::raw('COUNT(*) as total'), DB::raw('COUNT(DISTINCT session_id) as uniques'))
                ->groupBy('m')
                ->get();
            foreach ($monthlyVisits as $row) {
                if (isset($timeline[$row->m])) {
                    $timeline[$row->m]['visits'] = (int) $row->total;
                    $timeline[$row->m]['uniques'] = (int) $row->uniques;
                }
            }
        } else {
            // Day by day
            $curr = clone $start;
            while ($curr <= $end) {
                $dKey = $curr->format('Y-m-d');
                $timeline[$dKey] = [
                    'label' => $curr->format('d/m'),
                    'visits' => 0,
                    'uniques' => 0,
                ];
                $curr->addDay();
            }
            $dailyVisits = PageVisit::whereBetween('visited_at', [$start, $end])
                ->select(DB::raw('DATE(visited_at) as day'), DB::raw('COUNT(*) as total'), DB::raw('COUNT(DISTINCT session_id) as uniques'))
                ->groupBy('day')
                ->get();
            foreach ($dailyVisits as $row) {
                if (isset($timeline[$row->day])) {
                    $timeline[$row->day]['visits'] = (int) $row->total;
                    $timeline[$row->day]['uniques'] = (int) $row->uniques;
                }
            }
        }

        // Devices Breakdown
        $devicesRaw = PageVisit::whereBetween('visited_at', [$start, $end])
            ->select('device', DB::raw('COUNT(*) as total'))
            ->groupBy('device')
            ->get();
        $devices = [
            'mobile' => 0,
            'desktop' => 0,
            'tablet' => 0,
        ];
        foreach ($devicesRaw as $dev) {
            $k = strtolower($dev->device);
            if (isset($devices[$k])) {
                $devices[$k] = (int) $dev->total;
            }
        }

        // Browsers Breakdown
        $browsers = PageVisit::whereBetween('visited_at', [$start, $end])
            ->select('browser', DB::raw('COUNT(*) as total'))
            ->groupBy('browser')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        // Top Pages
        $topPagesRaw = PageVisit::whereBetween('visited_at', [$start, $end])
            ->select('path', DB::raw('COUNT(*) as total'))
            ->groupBy('path')
            ->orderByDesc('total')
            ->limit(8)
            ->get();

        $pageTitles = [
            '/' => 'Inicio (Home)',
            '/offices' => 'Nuestras Sedes e Instalaciones',
            '/services' => 'Nuestros Servicios',
            '/servicios' => 'Nuestros Servicios',
            '/about' => 'Quiénes Somos (Fisioterapia)',
            '/nosotros' => 'Quiénes Somos',
            '/contact' => 'Contacto y Citas',
            '/contacto' => 'Contacto y Citas',
            '/blog' => 'Blog & Artículos',
            '/faqs' => 'Preguntas Frecuentes',
            '/libro-de-reclamaciones' => 'Libro de Reclamaciones',
            '/reclamaciones' => 'Libro de Reclamaciones',
            '/policies/privacy_policy' => 'Política de Privacidad',
            '/policies/terms_conditions' => 'Términos y Condiciones',
            '/policies/cookies_policy' => 'Política de Cookies',
        ];

        $topPages = [];
        foreach ($topPagesRaw as $p) {
            $topPages[] = [
                'path' => $p->path,
                'title' => $pageTitles[$p->path] ?? $p->path,
                'visits' => (int) $p->total,
                'percentage' => $totalVisits > 0 ? round(($p->total / $totalVisits) * 100, 1) : 0,
            ];
        }

        // Recent appointments
        $recentAppointments = Appointment::orderByDesc('created_at')->limit(5)->get();

        // Recent messages
        $recentMessages = Message::orderByDesc('created_at')->limit(5)->get();

        return [
            'period' => $period,
            'startDate' => $start->format('Y-m-d'),
            'endDate' => $end->format('Y-m-d'),
            'kpis' => [
                'totalVisits' => $totalVisits,
                'visitsGrowth' => $visitsGrowth,
                'uniqueVisitors' => $uniqueVisitors,
                'uniquesGrowth' => $uniquesGrowth,
                'appointmentsCount' => $appointmentsCount,
                'appointmentsGrowth' => $appointmentsGrowth,
                'pendingAppointments' => $pendingAppointments,
                'messagesCount' => $messagesCount,
                'messagesGrowth' => $messagesGrowth,
                'unreadMessages' => $unreadMessages,
                'complaintsCount' => $complaintsCount,
                'conversionRate' => $conversionRate,
            ],
            'timeline' => array_values($timeline),
            'devices' => $devices,
            'browsers' => $browsers,
            'topPages' => $topPages,
            'recentAppointments' => $recentAppointments,
            'recentMessages' => $recentMessages,
        ];
    }
}
