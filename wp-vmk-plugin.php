<?php

/**
 * Plugin Name: WP VMK Plugin
 * Plugin URI: https://vomanhkien.com/
 * Description: WP VMK Plugin
 * Author: Vo Manh Kien
 * Author URI: https://vomanhkien.com/
 * Version: 1.0.0
 */
define('WPVMKP_URL', plugin_dir_url(__FILE__));
define('WPVMKP_DIR', plugin_dir_path(__FILE__));

define('WPVMKP_VERSION', '1.0.0');

// This will automatically update, when you run dev or production
define('WPVMKP_DEVELOPMENT', 'yes');

class WPVMKPlugin
{
    public function boot()
    {
        $this->loadClasses();
        $this->registerShortCodes();
        $this->ActivatePlugin();
        $this->renderMenu();
        $this->disableUpdateNag();
        $this->renderFrontendPage();
    }

    public function loadClasses()
    {
        require WPVMKP_DIR . 'includes/autoload.php';
    }

    public function renderMenu()
    {
        add_action('admin_menu', function () {
            if (!current_user_can('manage_options')) {
                return;
            }
            global $submenu;
            add_menu_page(
                'WPVMKPlugin',
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
        $loadAssets = new \WPVMKPlugin\Classes\LoadAssets();
        $loadAssets->admin();

        $WPVMKP = apply_filters('WPVMKP/admin_app_vars', array(
            'assets_url' => WPVMKP_URL . 'assets/',
            'ajaxurl' => admin_url('admin-ajax.php')
        ));

        wp_localize_script('WPVMKP-script-boot', 'WPVMKPAdmin', $WPVMKP);

        echo '<div class="WPVMKP-admin-page" id="WPVMKP_app">
            <router-view></router-view>
        </div>';
    }

    public function renderFrontendPage()
    {
        $loadAssets = new \WPVMKPlugin\Classes\LoadAssets();
        $loadAssets->frontend();

        wp_localize_script('WPVMKP-script-boot-frontend', 'WPVMKPFrontend', array(
            'isTrue' => true,
            'isFalse' => false,
        ));
    }

    public function registerShortCodes()
    {
        // your shortcode here
        add_shortcode('wpvmkp', 'shortcode_wpvmkp');
        function shortcode_wpvmkp($atts)
        {
            $random = md5(uniqid(rand(), true));

            return "<div
                    class='WPVMKP_frontend_app'
                    id='WPVMKPFrontend{$random}'
                ></div>";
        }
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
            require_once(WPVMKP_DIR . 'includes/Classes/Activator.php');
            $activator = new \WPVMKPlugin\Classes\Activator();
            $activator->migrateDatabases($newWorkWide);
        });
    }
}

(new WPVMKPlugin())->boot();
