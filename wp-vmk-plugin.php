<?php

/**
 * Plugin Name: WP VMK Plugin
 * Plugin URI: https://vomanhkien.com/wp-vmk-plugin
 * Description: WP VMK Plugin
 * Author: Vo Manh Kien
 * Author URI: https://vomanhkien.com
 * Version: 1.0.0
 * Text Domain:   wp-vmk-plugin
 * Domain Path:   /languages
 */
define('WPVMKPLUGIN_URL', plugin_dir_url(__FILE__));
define('WPVMKPLUGIN_DIR', plugin_dir_path(__FILE__));

define('WPVMKPLUGIN_VERSION', '1.0.0');

// This will automatically update, when you run dev or production
define('WPVMKPLUGIN_DEVELOPMENT', 'yes');

class WPVMKPLUGIN
{
    public function boot()
    {
        $this->loadClasses();
        $this->registerShortCodes();
        $this->ActivatePlugin();
        $this->renderMenu();
        $this->disableUpdateNag();
        // START renderFrontendPage
        $this->renderFrontendPage();
        // END renderFrontendPage
    }

    public function loadClasses()
    {
        require WPVMKPLUGIN_DIR . 'includes/autoload.php';

        if (is_admin()) {
            // Top Level Ajax Handlers for Admin
            $ajaxHandler = new \WPVMKPLUGIN\Classes\AdminAjaxHandler();
            $ajaxHandler->registerEndpoints();
        }

        // START FrontendAjaxHandler
        // Top Level Ajax Handlers
        $ajaxHandler = new \WPVMKPLUGIN\Classes\FrontendAjaxHandler();
        $ajaxHandler->registerEndpoints();
        // END FrontendAjaxHandler
    }

    public function textDomain()
    {
        load_plugin_textdomain('WPVMKPLUGIN', false, WPVMKPLUGIN_DIR . 'languages');
    }

    public function renderMenu()
    {
        add_action('admin_menu', function () {
            if (!current_user_can('manage_options')) {
                return;
            }
            global $submenu;
            add_menu_page(
                'WPVMKPLUGIN',
                'WP VMK Plugin',
                'manage_options',
                'wp-vmk-plugin.php',
                array($this, 'renderAdminPage'),
                'dashicons-editor-code',
                25
            );
            $submenu['wp-vmk-plugin.php']['dashboard'] = array(
                'Dashboard',
                'manage_options',
                'admin.php?page=wp-vmk-plugin.php#/',
            );
            $submenu['wp-vmk-plugin.php']['contact'] = array(
                'Contact',
                'manage_options',
                'admin.php?page=wp-vmk-plugin.php#/contact',
            );
        });
    }

    public function renderAdminPage()
    {
        $loadAssets = new \WPVMKPLUGIN\Classes\LoadAssets();
        $loadAssets->admin();

        $WPVMKPLUGIN = apply_filters('WPVMKPLUGIN/admin_app_vars', array(
            'assets_url' => WPVMKPLUGIN_URL . 'assets/',
            'ajaxurl' => admin_url('admin-ajax.php')
        ));

        wp_localize_script('WPVMKPLUGIN-script-boot', 'WPVMKPAdmin', $WPVMKPLUGIN);

        echo '<div class="WPVMKPLUGIN-admin-page" id="WPVMKPLUGIN_app">
            <router-view></router-view>
        </div>';
    }

    // START frontend
    public function renderFrontendPage()
    {
        $loadAssets = new \WPVMKPLUGIN\Classes\LoadAssets();
        $loadAssets->frontend();

        wp_localize_script('WPVMKPLUGIN-script-boot-frontend', 'WPVMKPFrontend', array(
            'isTrue' => true,
            'isFalse' => false,
        ));
    }
    // END frontend

    public function registerShortCodes()
    {
        // your shortcode here
        // add_shortcode('wpvmkplugin', 'shortcode_wpvmkplugin');
        // function shortcode_wpvmkplugin($atts)
        // {
        //     $random = md5(uniqid(rand(), true));

        //     return "<div
        //             class='WPVMKPLUGIN_frontend_app'
        //             id='WPVMKPFrontend{$random}'
        //         ></div>";
        // }
    }

    // disable update nag on admin dashboard
    public function disableUpdateNag()
    {
        add_action('admin_init', function () {
            $disablePages = [
                'wp-vmk-plugin.php',
            ];

            if (isset($_GET['page']) && in_array($_GET['page'], $disablePages)) {
                remove_all_actions('admin_notices');
            }
        }, 20);
    }

    public function ActivatePlugin()
    {
        //activation deactivation hook
        register_activation_hook(__FILE__, function ($newWorkWide) {
            require_once(WPVMKPLUGIN_DIR . 'includes/Classes/Activator.php');
            $activator = new \WPVMKPLUGIN\Classes\Activator();
            $activator->migrateDatabases($newWorkWide);
        });
    }
}

(new WPVMKPLUGIN())->boot();
