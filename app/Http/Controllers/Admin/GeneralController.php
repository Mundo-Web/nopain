<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Http\Controllers\Controller;
use App\Models\General;
use App\Models\Lang;
use Illuminate\Http\Request;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Routing\ResponseFactory;
use SoDe\Extend\Response;

class GeneralController extends BasicController
{
    public $model = General::class;
    public $reactView = 'Admin/Generals';
    public function setReactViewProperties(Request $request)
    {
        $langId = app('current_lang_id');
        $generals = General::where('lang_id', $langId)->get();

        // Si no hay datos para el idioma actual, copiar del idioma por defecto
        if ($generals->isEmpty()) {
            $defaultLangId = Lang::where('is_default', true)->value('id');
            $defaultGenerals = General::where('lang_id', $defaultLangId)->get();

            foreach ($defaultGenerals as $general) {
                General::firstOrCreate([
                    'correlative' => $general->correlative,
                    'lang_id' => $langId
                ], [
                    'name' => $general->name,
                    'description' => $general->description
                ]);
            }

            $generals = General::where('lang_id', $langId)->get();
        }

        return [
            'generals' => $generals
        ];
    }
    /* public function setReactViewProperties(Request $request)
    {
        $langId = app('current_lang_id');
        $generals = General::where('lang_id', $langId)->get();
        return [
            'generals' => $generals
        ];
    }*/

    public function save(Request $request): HttpResponse|ResponseFactory
    {
        // dump($request->all());
        $response = Response::simpleTryCatch(function () use ($request) {
            $body = $request->all();
            foreach ($body as $record) {
                General::updateOrCreate([
                    'lang_id' => app('current_lang_id'),
                    'correlative' => $record['correlative']
                ], [
                    'name' => $record['name'],
                    'description' => $record['description']
                ]);
            }
        });
        return response($response->toArray(), $response->status);
    }
    public function generateSitemap(Request $request): HttpResponse|ResponseFactory
    {
        $response = Response::simpleTryCatch(function () {
            $baseUrl = 'https://nopain.com.pe';
            $today = date('Y-m-d');

            $xml = '<?xml version="1.0" encoding="UTF-8"?>' . PHP_EOL;
            $xml .= '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"' . PHP_EOL;
            $xml .= '        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' . PHP_EOL;
            $xml .= '        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">' . PHP_EOL;

            // Páginas principales del Header
            $staticRoutes = [
                ['path' => '/', 'changefreq' => 'daily', 'priority' => '1.0'],
                ['path' => '/services', 'changefreq' => 'weekly', 'priority' => '0.9'],
                ['path' => '/about', 'changefreq' => 'monthly', 'priority' => '0.8'],
                ['path' => '/offices', 'changefreq' => 'monthly', 'priority' => '0.8'],
                ['path' => '/contact', 'changefreq' => 'monthly', 'priority' => '0.8'],
                ['path' => '/blog', 'changefreq' => 'weekly', 'priority' => '0.8'],
                ['path' => '/libro-de-reclamaciones', 'changefreq' => 'yearly', 'priority' => '0.4'],
            ];

            foreach ($staticRoutes as $route) {
                $xml .= "    <url>\n";
                $xml .= "        <loc>{$baseUrl}{$route['path']}</loc>\n";
                $xml .= "        <lastmod>{$today}</lastmod>\n";
                $xml .= "        <changefreq>{$route['changefreq']}</changefreq>\n";
                $xml .= "        <priority>{$route['priority']}</priority>\n";
                $xml .= "    </url>\n";
            }

            // Servicios activos con slug
            $services = \App\Models\Service::where('status', true)
                ->where('visible', true)
                ->whereNotNull('slug')
                ->where('slug', '!=', '')
                ->get(['title', 'slug', 'updated_at']);

            foreach ($services as $service) {
                $lastmod = $service->updated_at ? $service->updated_at->format('Y-m-d') : $today;
                $xml .= "    <url>\n";
                $xml .= "        <loc>{$baseUrl}/services/{$service->slug}</loc>\n";
                $xml .= "        <lastmod>{$lastmod}</lastmod>\n";
                $xml .= "        <changefreq>weekly</changefreq>\n";
                $xml .= "        <priority>0.8</priority>\n";
                $xml .= "    </url>\n";
            }

            // Artículos de blog activos con slug
            $posts = \App\Models\Post::where('status', true)
                ->whereNotNull('slug')
                ->where('slug', '!=', '')
                ->get(['name', 'slug', 'updated_at']);

            foreach ($posts as $post) {
                $lastmod = $post->updated_at ? $post->updated_at->format('Y-m-d') : $today;
                $xml .= "    <url>\n";
                $xml .= "        <loc>{$baseUrl}/blog/{$post->slug}</loc>\n";
                $xml .= "        <lastmod>{$lastmod}</lastmod>\n";
                $xml .= "        <changefreq>monthly</changefreq>\n";
                $xml .= "        <priority>0.7</priority>\n";
                $xml .= "    </url>\n";
            }

            $xml .= '</urlset>' . PHP_EOL;

            file_put_contents(public_path('sitemap.xml'), $xml);

            return [
                'total_urls' => count($staticRoutes) + $services->count() + $posts->count(),
                'services_count' => $services->count(),
                'posts_count' => $posts->count(),
                'generated_at' => now()->format('Y-m-d H:i:s'),
                'sitemap_url' => "{$baseUrl}/sitemap.xml"
            ];
        });

        $response->message = 'Sitemap XML generado exitosamente';
        return response($response->toArray(), $response->status);
    }
}
