<?php

namespace WPVMKPlugin\Classes;

use WPVMKPlugin\Classes\Vite;

class LoadAssets
{
    public function admin()
    {
        Vite::enqueueScript('WPVMKP-script-boot', 'admin/admin.js', array('jquery'), WPVMKP_VERSION, true);
    }
    public function frontend()
    {
        Vite::enqueueScript('WPVMKP-script-boot-frontend', 'frontend/frontend.js', array('jquery'), WPVMKP_VERSION, true);
    }
}
