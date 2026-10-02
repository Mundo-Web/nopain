<?php

namespace Database\Seeders;

use App\Models\PageVisit;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class PageVisitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        if (PageVisit::count() > 100) {
            return;
        }

        $paths = [
            '/' => 0.35,
            '/offices' => 0.18,
            '/services' => 0.15,
            '/about' => 0.11,
            '/blog' => 0.08,
            '/contact' => 0.07,
            '/faqs' => 0.03,
            '/libro-de-reclamaciones' => 0.01,
            '/policies/privacy_policy' => 0.01,
            '/policies/cookies_policy' => 0.01,
        ];

        $devices = [
            'mobile' => 0.64,
            'desktop' => 0.31,
            'tablet' => 0.05,
        ];

        $browsers = [
            'Chrome' => 0.65,
            'Safari' => 0.22,
            'Edge' => 0.08,
            'Firefox' => 0.04,
            'Otro' => 0.01,
        ];

        $osList = [
            'Android' => 0.48,
            'iOS' => 0.21,
            'Windows' => 0.24,
            'macOS' => 0.05,
            'Linux' => 0.02,
        ];

        $cities = ['Lima', 'Arequipa', 'Trujillo', 'Chiclayo', 'Piura', 'Cusco', 'Huancayo'];
        $referers = [
            'https://www.google.com/',
            'https://www.google.com/search?q=fisioterapia+lima',
            'https://www.instagram.com/',
            'https://www.facebook.com/',
            'https://m.facebook.com/',
            null,
            null,
        ];

        $visits = [];
        $now = Carbon::now();

        // Seed 60 days of realistic history
        for ($i = 60; $i >= 0; $i--) {
            $day = (clone $now)->subDays($i);
            $isWeekend = $day->isWeekend();

            // Daily visit volume between 35 and 95 (slightly less on weekends)
            $dailyCount = $isWeekend ? rand(30, 60) : rand(55, 110);

            // Upward trend over the last 15 days
            if ($i <= 15) {
                $dailyCount = (int) ($dailyCount * 1.3);
            }

            for ($j = 0; $j < $dailyCount; $j++) {
                // Pick random path based on weights
                $rand = mt_rand() / mt_getrandmax();
                $cum = 0;
                $path = '/';
                foreach ($paths as $p => $weight) {
                    $cum += $weight;
                    if ($rand <= $cum) {
                        $path = $p;
                        break;
                    }
                }

                // Pick device
                $rand = mt_rand() / mt_getrandmax();
                $cum = 0;
                $device = 'mobile';
                foreach ($devices as $d => $weight) {
                    $cum += $weight;
                    if ($rand <= $cum) {
                        $device = $d;
                        break;
                    }
                }

                // Pick browser
                $rand = mt_rand() / mt_getrandmax();
                $cum = 0;
                $browser = 'Chrome';
                foreach ($browsers as $b => $weight) {
                    $cum += $weight;
                    if ($rand <= $cum) {
                        $browser = $b;
                        break;
                    }
                }

                // Pick OS
                $rand = mt_rand() / mt_getrandmax();
                $cum = 0;
                $os = 'Android';
                foreach ($osList as $o => $weight) {
                    $cum += $weight;
                    if ($rand <= $cum) {
                        $os = $o;
                        break;
                    }
                }

                $ip = '190.' . rand(10, 230) . '.' . rand(1, 254) . '.' . rand(1, 254);
                $maxH = ($i === 0) ? (int) $now->format('H') : 23;
                $minH = ($i === 0) ? min(0, $maxH) : 7;
                $hour = rand($minH, max($minH, $maxH));
                $minute = ($i === 0 && $hour === (int) $now->format('H')) ? rand(0, (int) $now->format('i')) : rand(0, 59);
                $second = rand(0, 59);
                $visitDate = (clone $day)->setTime($hour, $minute, $second);
                $sessionId = hash('sha256', $ip . '_' . $visitDate->format('Y-m-d'));

                $visits[] = [
                    'ip_address' => $ip,
                    'session_id' => $sessionId,
                    'url' => 'https://nopain.pe' . $path,
                    'path' => $path,
                    'method' => 'GET',
                    'device' => $device,
                    'browser' => $browser,
                    'os' => $os,
                    'referer' => $referers[array_rand($referers)],
                    'country' => 'Perú',
                    'city' => $cities[array_rand($cities)],
                    'visited_at' => $visitDate,
                    'created_at' => $visitDate,
                    'updated_at' => $visitDate,
                ];

                if (count($visits) >= 500) {
                    PageVisit::insert($visits);
                    $visits = [];
                }
            }
        }

        if (!empty($visits)) {
            PageVisit::insert($visits);
        }
    }
}
