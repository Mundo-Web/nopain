<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class PolicyController extends BasicController
{
    public $reactView = 'Policies';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        return [
            'policy' => request()->route('policy')
        ];
    }
}
