<?php

namespace WPVMKPLUGIN\Classes;

use WPVMKPLUGIN\Classes\Vite;

class LoadAssets
{
    public function admin()
    {
        Vite::enqueueScript('WPVMKPLUGIN-script-boot', 'admin/admin.js', array('jquery'), WPVMKPLUGIN_VERSION, true);
    }
    public function frontend()
    {
        Vite::enqueueScript('WPVMKPLUGIN-script-boot-frontend', 'frontend/frontend.js', array('jquery'), WPVMKPLUGIN_VERSION, true);
    }
}
