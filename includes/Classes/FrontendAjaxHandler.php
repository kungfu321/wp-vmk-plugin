<?php

namespace WPVMKPLUGIN\Classes;

class FrontendAjaxHandler
{
  public function registerEndpoints()
  {
    add_action('wp_ajax_WPVMKPLUGIN', 'ajax_handler');
    add_action('wp_ajax_nopriv_WPVMKPLUGIN', 'ajax_handler'); // Allow non-logged in users
  }

  public function handleEndPoint()
  {
    $route = sanitize_text_field($_REQUEST['route']);

    $validRoutes = array(
      'get_data' => 'getData',
    );

    if (isset($validRoutes[$route])) {
      return $this->{$validRoutes[$route]}();
    }
  }

  protected function getData()
  {
    // write your sql queries here or another class, then send by a success response
    // wp_send_json_success($data);
  }
}
