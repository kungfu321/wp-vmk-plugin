<?php

namespace WPVMKPLUGIN\Classes;

class AdminAjaxHandler
{
  public function registerEndpoints()
  {
    add_action('wp_ajax_WPVMKPLUGIN_admin_ajax', 'ajax_handler');
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
