<?php
/*
Plugin Name: syb_plugin
Plugin URI: https://example.com
Description: A simple plugin to display a message in the footer.
Version: 1.0
Author: Your Name
Author URI: https://example.com
License: GPL2
*/

// 防止直接访问文件
if (!defined('ABSPATH')) {
    exit;
}

// 在页脚显示一条消息
function syb_plugin_footer_message() {
    echo '<p style="text-align: center;">This is 20240628 my syb_plugin! It works!</p>';
}

// 将消息添加到wp_footer钩子

add_action('wp_footer', 'syb_plugin_footer_message');

//////////////////////////////////////////////////////////////////////////////////////////////////////


// 检测当前页面状态并在页脚显示提示信息
function syb_plugin_display_page_status() {
$statuses = [];

// WordPress conditions
if (is_home()) $statuses[] = 'Home Page';
if (is_front_page()) $statuses[] = 'Front Page';
if (is_single()) $statuses[] = 'Single Post';
if (is_page()) $statuses[] = 'Page';
if (is_category()) $statuses[] = 'Category Archive';
if (is_tag()) $statuses[] = 'Tag Archive';
if (is_author()) $statuses[] = 'Author Archive';
if (is_date()) $statuses[] = 'Date Archive';


if (is_date()) $statuses[] = 'Date Archive';
if (is_archive()) $statuses[] = 'Archive';
if (is_search()) $statuses[] = 'Search Results';
if (is_404()) $statuses[] = '404 Not Found';

// WooCommerce conditions
if (is_shop()) $statuses[] = 'Shop Page';
if (is_product_category()) $statuses[] = 'Product Category';
if (is_product_tag()) $statuses[] = 'Product Tag';
if (is_cart()) $statuses[] = 'Cart Page';
if (is_checkout()) $statuses[] = 'Checkout Page';
if (is_account_page()) $statuses[] = 'Account Page';
if (is_wc_endpoint_url('order-received')) $statuses[] = 'Order Received';

// Display statuses
if (!empty($statuses)) {
    echo '<p style="text-align: center;">Page Status: ' . implode(', ', $statuses) . '</p>';
} else {
    echo '<p style="text-align: center;">Page Status: Unknown</p>';
}
}
add_action('wp_footer', 'syb_plugin_display_page_status');

//////////////////////////////////////////////////////////////////////////////////////////////////////

    // 添加 Shortcode
    function syb_display_product() {
     global  $product;
    // 产品 ID
    $product_id = 123;

    // 获取产品对象
    $product = wc_get_product( $product_id );

    if ( ! $product ) {
        return '产品不存在。';
    }

    // 启用输出缓冲
    ob_start();

    // 使用 WooCommerce 模板显示产品
    wc_get_template_part( 'single-product');

    // 获取输出内容
    $output = ob_get_clean();

    echo '<div style="background-color: #ff0; padding: 10px; text-align: center;">WORTHBUY NOTICE:</div>';

    return $output;
}
add_shortcode( 'syb_product', 'syb_display_product' );
//////////////////////////////////////////////////////////////////////////////////////////////////////

// 添加Shortcode功能
function syb_display_product_info_shortcode($atts) {
    // 提取Shortcode属性
    $atts = shortcode_atts(
        array(
            'id' => '', // 产品ID
        ),
        $atts,
        'syb_product_info'
    );

    // 检查产品ID是否提供
    if (!$atts['id']) {
        return '请提供产品ID。';
    }

    // 获取产品对象
    $product = wc_get_product($atts['id']);

    // 检查产品对象是否存在
    if (!$product) {
        return '找不到指定的产品。';
    }

    // 获取产品信息
   $image = wp_get_attachment_image_src(get_post_thumbnail_id($product->get_id()), 'single-post-thumbnail');
    $name = $product->get_name();
    $price = $product->get_price_html();
    $description = $product->get_short_description();

    // 构建输出HTML
    $output = '<div class="syb-product-info">';
    if ($image) {
        $output .= '<div class="syb-product-image"><img src="' . esc_url($image[0]) . '" alt="' . esc_attr($name) . '"></div>';
    }
    $output .= '<div class="syb-product-name">' . esc_html($name) . '</div>';
    $output .= '<div class="syb-product-price">' . $price . '</div>';
    $output .= '<div class="syb-product-description">' . wpautop($description) . '</div>';
    $output .= '</div>';

    return $output;
}

// 注册Shortcode
add_shortcode('syb_product_info', 'syb_display_product_info_shortcode');

//////////////////////////////////////////////////////////////////////////////////////////////////////
// 定义过滤商店页面产品查询的函数

function syb_filter_shop_products($query) {
    // 确保这个函数只在前端主查询并且是商店页面时执行
    if (!is_admin() && $query->is_main_query() && is_shop()) {
        // 获取当前查询的 tax_query 参数
        $tax_query = (array) $query->get('tax_query');

        // 添加自定义 tax_query 条件，只显示分类为 'minor' 的产品
        $tax_query[] = array(
            'taxonomy' => 'product_cat',
            'field'    => 'slug',
            'terms'    => 'combo', // 只显示分类为 'minor' 的产品
          //  'terms'    => 'minor', // 只显示分类为 'minor' 的产品
        );

        // 设置修改后的 tax_query 参数
        $query->set('tax_query', $tax_query);
    }
}
add_action('pre_get_posts', 'syb_filter_shop_products');


////////////////////////////////////////////////////////////////////////////////////////
// 在添加产品到购物车时设置自定义数据
// 在添加产品到购物车时设置自定义数据
add_filter('woocommerce_add_cart_item_data', 'add_cart_item_custom_data', 10, 2);
function add_cart_item_custom_data($cart_item_data, $product_id) {
    // 获取产品对象
    $product = wc_get_product($product_id);

// 调试信息：购物车项数据
echo '<pre>';
//echo 'add_cart_item_custom_data: ' . print_r($product, true) . '<br>';
echo '</pre>';

   

// 检查产品是否属于特定类别
$categories = $product->get_category_ids();
$minor_category_id = get_term_by('slug', 'minor', 'product_cat')->term_id;
if (in_array($minor_category_id, $categories)) {
    // 为购物车项数据增加自定义数据，标记为属于 'minor' 类别
  //  $cart_item_data['is_minor_category'] = true;
  $cart_item_data['minor'] = true;
}

    

 // 调试信息：输出修改后的购物车项数据
 echo '<pre>';
 echo 'add_cart_item_custom_data: ' . print_r($categories, true) . '<br>';
 echo '</pre>';
 

    // 返回修改后的购物车项数据
    return $cart_item_data;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////



