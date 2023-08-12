<?php

namespace WPVMKPLUGIN\Classes;

use WPVMKPLUGIN\Classes\Vite;

class LoadAssets
{
    // START admin
    public function admin()
    {
        Vite::enqueueScript('WPVMKPLUGIN-script-boot', 'admin/admin.js', array('jquery'), WPVMKPLUGIN_VERSION, true);
    }
    // END admin

    // START frontend
    public function frontend()
    {
        Vite::enqueueScript('WPVMKPLUGIN-script-boot-frontend', 'frontend/frontend.js', array('jquery'), WPVMKPLUGIN_VERSION, true);
    }
    // END frontend
}
