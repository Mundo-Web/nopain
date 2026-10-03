<?php

namespace App\Http\Controllers;

use App\Models\LandingHome;
use App\Models\Lang;
use App\Models\Service;
use App\Models\Specialty;
use Illuminate\Http\Request;

class ServiceController extends BasicController
{
    public $model = Service::class;
    public $reactView = 'ServiciosPage';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        $langId = app('current_lang_id');
        $defaultLangId = Lang::where('is_default', true)->value('id');

        $landing = LandingHome::where('correlative', 'like', 'page_services%')->where('lang_id', $langId)->get();
        if ($landing->isEmpty() && $defaultLangId) {
            $landing = LandingHome::where('correlative', 'like', 'page_services%')->where('lang_id', $defaultLangId)->get();
        }

        $services = Service::where('status', true)->where('visible', true)->where('lang_id', $langId)->orderBy('updated_at', 'DESC')->get();
        if ($services->isEmpty() && $defaultLangId) {
            $services = Service::where('status', true)->where('visible', true)->where('lang_id', $defaultLangId)->orderBy('updated_at', 'DESC')->get();
        }

        $specialities = Specialty::where('visible', true)
            ->where('status', true)
            ->where('lang_id', $langId)
            ->get();
        if ($specialities->isEmpty() && $defaultLangId) {
            $specialities = Specialty::where('visible', true)
                ->where('status', true)
                ->where('lang_id', $defaultLangId)
                ->get();
        }

        $slug = $request->route('slug') ?? $request->query('slug');

        return [
            'landing' => $landing,
            'services' => $services,
            'specialities' => $specialities,
            'currentSlug' => $slug,
        ];
    }
}
