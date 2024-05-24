<?php
/*
Plugin Name: Custom Template Generator
Description: A plugin to generate custom WordPress templates using AI.
Version: 1.0
Author: Your Name
*/

// 注册自定义 REST API 端点
add_action('rest_api_init', function () {
    register_rest_route('custom/v1', '/create_page', array(
        'methods' => 'POST',
        'callback' => 'create_page_callback',
        'permission_callback' => '__return_true',
    ));
});

// 自定义回调函数
function create_page_callback(WP_REST_Request $request) {
    $params = $request->get_json_params();
    $title = sanitize_text_field($params['title']);
    $content = wp_kses_post($params['content']);
    
    $page_id = wp_insert_post(array(
        'post_title'    => $title,
        'post_content'  => $content,
        'post_status'   => 'publish',
        'post_type'     => 'page',
    ));

    if (is_wp_error($page_id)) {
        return new WP_Error('create_failed', 'Failed to create page', array('status' => 500));
    }

    return rest_ensure_response(array('page_id' => $page_id));
}

// 在管理后台添加菜单项
add_action('admin_menu', 'custom_template_generator_menu');

function custom_template_generator_menu() {
    add_menu_page('Custom Template Generator', 'Template Generator', 'manage_options', 'custom-template-generator', 'custom_template_generator_page');
}

function custom_template_generator_page() {
    echo '<div id="custom-template-generator">';
    include(plugin_dir_path(__FILE__) . 'frontend/index.html');
    echo '</div>';
    // 加载必要的 WordPress 编辑器依赖
    wp_enqueue_script('wp-blocks');
    wp_enqueue_script('wp-element');
    wp_enqueue_script('wp-editor');
    wp_enqueue_script('custom-template-generator-script', plugin_dir_url(__FILE__) . 'frontend/script.js', array('wp-blocks', 'wp-element', 'wp-editor'), '1.0', true);
    wp_enqueue_style('custom-template-generator-style', plugin_dir_url(__FILE__) . 'frontend/style.css');
}

// 插件激活时创建页面
register_activation_hook(__FILE__, 'create_custom_template_page');

function create_custom_template_page() {
    // 检查页面是否已经存在
    $page_title = 'Custom Template';
    $page_content = '[custom_template_generator]'; // 你可以添加任何你想要的短代码或内容
    $page = get_page_by_title($page_title);

    // 如果页面不存在，则创建页面
    if (!$page) {
        $page_id = wp_insert_post(array(
            'post_title'    => $page_title,
            'post_content'  => $page_content,
            'post_status'   => 'publish',
            'post_type'     => 'page',
        ));

        if ($page_id) {
            // 页面创建成功，可以执行其他操作
        }
    }
}

// 注册一个短代码来展示生成器
function custom_template_generator_shortcode() {
    ob_start();
    include(plugin_dir_path(__FILE__) . 'frontend/index.html');
    return ob_get_clean();
}
add_shortcode('custom_template_generator', 'custom_template_generator_shortcode');
?>
