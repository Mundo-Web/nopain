<?php

namespace App\Http\Middleware;

use App\Models\PageVisit;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TrackPageVisits
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Only track successful GET requests for public web pages
        if ($request->isMethod('GET') && $response->getStatusCode() === 200) {
            $path = $request->path();

            // Filter out system, admin, API, and static asset routes
            $isIgnored = $request->is(
                'admin*',
                'api*',
                'lte*',
                'assets*',
                'build*',
                'vendor*',
                '_ignition*',
                'sanctum*',
                'manifest*',
                '*.js',
                '*.css',
                '*.png',
                '*.jpg',
                '*.svg',
                '*.ico'
            );

            if (!$isIgnored) {
                try {
                    $userAgent = $request->userAgent() ?? '';
                    $ip = $request->ip();

                    // Detect device
                    $device = 'desktop';
                    if (preg_match('/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i', $userAgent)) {
                        $device = 'tablet';
                    } elseif (preg_match('/(mobile|android|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop)/i', $userAgent)) {
                        $device = 'mobile';
                    }

                    // Detect Browser
                    $browser = 'Otro';
                    if (preg_match('/Edg/i', $userAgent)) {
                        $browser = 'Edge';
                    } elseif (preg_match('/Chrome/i', $userAgent)) {
                        $browser = 'Chrome';
                    } elseif (preg_match('/Safari/i', $userAgent) && !preg_match('/Chrome/i', $userAgent)) {
                        $browser = 'Safari';
                    } elseif (preg_match('/Firefox/i', $userAgent)) {
                        $browser = 'Firefox';
                    } elseif (preg_match('/Opera|OPR/i', $userAgent)) {
                        $browser = 'Opera';
                    }

                    // Detect OS
                    $os = 'Otro';
                    if (preg_match('/windows|win32/i', $userAgent)) {
                        $os = 'Windows';
                    } elseif (preg_match('/android/i', $userAgent)) {
                        $os = 'Android';
                    } elseif (preg_match('/iphone|ipad|ipod/i', $userAgent)) {
                        $os = 'iOS';
                    } elseif (preg_match('/macintosh|mac os x/i', $userAgent)) {
                        $os = 'macOS';
                    } elseif (preg_match('/linux/i', $userAgent)) {
                        $os = 'Linux';
                    }

                    $sessionId = hash('sha256', ($ip ?? '0.0.0.0') . '_' . substr($userAgent, 0, 50) . '_' . date('Y-m-d'));

                    PageVisit::create([
                        'ip_address' => $ip,
                        'session_id' => $sessionId,
                        'url' => substr($request->fullUrl(), 0, 500),
                        'path' => '/' . ltrim($path, '/'),
                        'method' => $request->method(),
                        'device' => $device,
                        'browser' => $browser,
                        'os' => $os,
                        'referer' => $request->header('referer'),
                        'country' => 'Perú',
                        'city' => 'Lima',
                        'visited_at' => now(),
                    ]);
                } catch (\Throwable $th) {
                    // Silently ignore to avoid disrupting user experience
                }
            }
        }

        return $response;
    }
}
