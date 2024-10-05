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


// 将消息添加到wp_footer钩子



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
            'terms'    => 'point', // 只显示分类为 'point' 的产品
          //  'terms'    => 'combo', // 只显示分类为 'minor' 的产品

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

// 检查产品是否属于特定类别
$categories = $product->get_category_ids();
$minor_category_id = get_term_by('slug', 'minor', 'product_cat')->term_id;
if (in_array($minor_category_id, $categories)) {
    // 为购物车项数据增加自定义数据，标记为属于 'minor' 类别
  //  $cart_item_data['is_minor_category'] = true;
  $cart_item_data['minor'] = true;
}

    

 // 调试信息：输出修改后的购物车项数据
 //echo '<pre>';
 //echo 'add_cart_item_custom_data: ' . print_r($categories, true) . '<br>';
 //echo '</pre>';
 

    // 返回修改后的购物车项数据
    return $cart_item_data;
}
////////////////////////////////////////////////////////////////////////////////////////////////////////

//确保自定义数据在购物车会话中持久化，否则购物车会丢失用户定义的数据！！！！！！！！
add_filter('woocommerce_get_cart_item_from_session', 'syb_get_custom_data_from_session', 20, 2);
function syb_get_custom_data_from_session($cart_item, $values) {
    if (isset($values['minor'])) {
         // 将会话数据中的 minor 字段复制到当前购物车项数据中
         $cart_item['minor'] = $values['minor'];

// 调试信息：输出修改后的购物车项数据
//echo '<pre>';
//echo 'add持久化: ' . print_r($values, true) . '<br>';
//echo '</pre>';


    }
    return $cart_item;
}

///////////////////////////////////////////////////////////////////////////////////////////
add_filter('woocommerce_get_item_data', 'syb_display_grouped_product_in_cart', 10, 2);
function syb_display_grouped_product_in_cart($item_data, $cart_item) {
    if (isset($cart_item['minor']) && $cart_item['minor']) {
      
        $item_data[] = array(
            'name' => '<span class="custom-name">' . __('  Each product needs 1 POINT to buy!', 'woocommerce') . '</span>',
            'value' => '<span class="custom-value">' . __('27777777777777cThis is a minor_child_of_grouped_product child.', 'woocommerce') . '</span>'
        );

        
    // 添加自定义图像
    // 媒体库图像的附件 ID
    $attachment_id = 238; // 替换为你实际的附件 ID$custom_image_url = 'https://worthbuy.com.au/wp-content/uploads/2024/07/图片3.png';
    $custom_image_url = wp_get_attachment_url($attachment_id);

    // 调试信息：输出修改后的购物车项数据
//echo '<pre>';
//echo 'add持久化: ' . print_r($custom_image_url , true) . '<br>';
//echo '</pre>';
    /*
    $item_data[] = array(
        'name' => '<span class="custom-name">' . __('Custom Image', 'woocommerce') . '</span>',
        'value' => '<span class="custom-value"><img src="' . esc_url($custom_image_url) . '" alt="Custom Image" style="max-width: 100px; height: auto;" /></span>'
    );*/

    if ($custom_image_url) {
         // 将图像 URL 添加到购物车项数据属性中
      //  wc()->cart->cart_contents[$cart_item['key']]['image_url'] = $custom_image_url;

        // 生成HTML代码，包含<a>和<img>标签
       // $img_html = '<a href="' . esc_url($custom_image_url) . '" target="_blank"><img src="' . esc_url($custom_image_url) . '" alt="Custom Image" style="max-width: 100px; height: auto;" /></a>';
           // 生成包含<a>标签的HTML代码
           $link_html = '<a href="' . esc_url($custom_image_url) . '" target="_blank">' . __('View Image', 'woocommerce') . '</a>';
    /*     
      $item_data[] = array(
            'name' => '<span class="custom-name">' . __('Custom Image', 'woocommerce') . '</span>',
           // 'value' => $link_html // 直接插入生成的HTML代码
           'value' => '<span class="syb_hidden-custom-data ' . $custom_image_url . '" style="display:none !important;">View image</span>'
        );*/
        $item_data[] = array(
            'key'     => '', // 空键，避免在购物车中显示
          //  'value'   => '<span class="syb_hidden-custom-data" style="display:none !important;">' . $custom_image_url . '</span>',
            'display' => '' // 使用空显示，确保前端渲染时不显示该数据
        );


    }

    return $item_data;
 }
}
////////////////////////////////////////////////////////////////




///////////////////////////////////////////////////////////////////

// 为已登录用户注册 Ajax 操作
add_action('wp_ajax_syb_get_custom_cart_data', 'syb_get_custom_cart_data_callback');
// 为未登录用户注册 Ajax 操作
add_action('wp_ajax_nopriv_syb_get_custom_cart_data', 'syb_get_custom_cart_data_callback');

function syb_get_custom_cart_data_callback() {
    
     // 获取购物车内容
     $cart_contents = WC()->cart->get_cart();
     $custom_data = array();
 
     // 添加固定的参数
     $custom_data['fixed_param11'] = 'Fixed Value 1';
    // $custom_data['fixed_param2'] = 'Fixed Value 2';
    // $custom_data['fixed_param3'] = 'Fixed Value 3';
 
     // 初始化一个数组来存储所有产品信息
     $all_products_info = array();
 
     // 遍历购物车内容，根据每个产品调用 syb_get_products_info_by_product_id
     foreach ($cart_contents as $cart_item_key => $cart_item) {
         $product_id = $cart_item['product_id'];
         $product_info = syb_get_products_info_by_product_id($product_id);
         $all_products_info = array_merge($all_products_info, $product_info);
     }
 
     // 将所有产品信息合并到固定参数数组中
     $custom_data['products_info'] = $all_products_info;
    // 返回自定义数据的 JSON 响应
    wp_send_json_success($custom_data);
}
/////////////////////////////////////////////////////////////////////
// 添加JS脚本
function syb_hover_image_over_cartitem_script() {
     if (is_cart()) 
     {
         wp_enqueue_script('syb_plugin_js_function', plugin_dir_url(__FILE__) . 'syb_plugin_js_function.js', array('jquery'), '1.0', true);
     
         wp_localize_script('syb_plugin_js_function', 'customAjax', array( // 将 Ajax URL 和其他参数传递到前端 JavaScript 文件
            'ajax_url' => admin_url('admin-ajax.php'),
            'custom_message' => 'Hello from PHP!'
        ));


        // 加载 CSS 文件
        wp_enqueue_style(
            'syb_plugin_styles', 
            plugin_dir_url(__FILE__) . 'syb_plugin_styles.css'
        );
     } 
     // 调试信息：输出修改后的购物车项数据
 //echo '<pre>';
 //echo '加载JS。CSS！！！！！！！！！！！！！！！！！！！';
 //echo '</pre>';
 }
 add_action('wp_enqueue_scripts', 'syb_hover_image_over_cartitem_script');
 //////////////////////////////////////////////////////////////////////////
 function syb_get_products_info_by_product_id($product_id) {
    // 获取指定产品 ID 的产品
    $product = wc_get_product($product_id);

    if (!$product) {
        return array(); // 如果找不到产品，则返回空数组
    }

    // 获取该产品的名称
    $name_substring = $product->get_name();

    // 获取所有产品
    $args = array(
        'limit' => -1, // 获取所有产品
    );
    $products = wc_get_products($args);

    $products_info = array();

    foreach ($products as $product) {
        $product_name = $product->get_name();

        // 检查产品名称是否包含指定的子字符串
       // if (stripos($product_name, $name_substring) !== false) {
         // 检查产品名称是否包含指定的子字符串，并且不与子字符串完全相同
         if (stripos($product_name, $name_substring) !== false && strcasecmp($product_name, $name_substring) !== 0) {
        
            $product_image_id = $product->get_image_id();
            $product_image_url = wp_get_attachment_url($product_image_id);

            // 存储产品信息到数组
            $products_info[] = array(
                'name' => $product_name,
                'cover_image_url' => $product_image_url,
            );
        }
    }

    return $products_info;
}
/////////////////////////////////////////////////////////////////////////////////

// 在用户个人资料和用户编辑页面中显示自定义字段
add_action('show_user_profile', 'syb_show_extra_profile_fields');
add_action('edit_user_profile', 'syb_show_extra_profile_fields');

function syb_show_extra_profile_fields($user) {
echo 'user';

    ?>
    <h3>附加信息</h3>

    <table class="form-table">
        <tr>
            <th><label for="extra_info">附加信息</label></th>
            <td>
                <input type="text" name="extra_info" id="extra_info" value="<?php echo esc_attr(get_the_author_meta('extra_info', $user->ID)); ?>" class="regular-text" /><br />
                <span class="description">请填写用户的附加信息。</span>
            </td>
        </tr>
    </table>
    <?php
}

// 保存用户个人资料和用户编辑页面中的自定义字段
add_action('personal_options_update', 'syb_save_extra_profile_fields');
add_action('edit_user_profile_update', 'syb_save_extra_profile_fields');

function syb_save_extra_profile_fields($user_id) {
    if (!current_user_can('edit_user', $user_id)) {
        return false;
    }

    update_user_meta($user_id, 'extra_info', sanitize_text_field($_POST['extra_info']));
}
////////////////////////////////////////////////////////////////////////////////////////////
// 注册自定义短代码 [syb_blog]
function syb_blog_list_shortcode() {
    ob_start();  // 开启输出缓冲
    ?>
    <div id="syb-blog-list">
        <h2>Worthbuy notice:</h2>
        <div style="max-height: 300px; overflow-y: auto;"> <!-- 设置滚动条，当列表超过300px时滚动显示 -->
            <ul>
            <?php
            $args = array(  // 设置查询参数
                'post_type' => 'post',  // 文章类型为 post
                'posts_per_page' => 10,  // 每页显示 10 篇文章
            );
            $query = new WP_Query($args);  // 创建新的 WP_Query 对象
            if ($query->have_posts()) {  // 如果有文章
                while ($query->have_posts()) {  // 循环文章
                    $query->the_post();  // 设置全局 $post 对象
                    ?>
                    <li class="syb-post">
                        <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>  <!-- 文章标题链接 -->
                        <ul>
                            <?php
                            $comments = get_comments(array(  // 获取文章的评论
                                'post_id' => get_the_ID(),  // 当前文章 ID
                                'status' => 'approve'  // 只获取已批准的评论
                            ));
                            foreach ($comments as $comment) {  // 循环每条评论
                                ?>
                                <li>
                                    <a href="<?php echo get_comment_link($comment); ?>">
                                        <?php echo get_comment_author($comment); ?>: <?php echo wp_trim_words($comment->comment_content, 10); ?>  <!-- 评论作者和内容链接 -->
                                    </a>
                                </li>
                                <?php
                            }
                            ?>
                            <li>
                                <a href="<?php the_permalink(); ?>#respond">Leave a Comment</a>  <!-- 提交评论链接 -->
                            </li>
                        </ul>
                    </li>
                    <?php
                }
            } else {
                echo '<li>No posts found</li>';  // 没有找到文章时显示的消息
            }
            wp_reset_postdata();  // 重置全局 $post 对象
            ?>
            </ul>
        </div>
    </div>
    <?php
    return ob_get_clean();  // 获取并返回输出缓冲的内容
}
add_shortcode('syb_blog_list', 'syb_blog_list_shortcode');  // 注册短代码

///////////////////// 在用户注册时添加自定义元数据 'worthbuy_point'，初始值为 5
function syb_add_custom_user_meta($user_id) {
    // 检查用户是否已经有 'worthbuy_point' 元数据
    if (!get_user_meta($user_id, 'worthbuy_point', true)) {
        // 添加 'worthbuy_point' 元数据，初始值为 5
        add_user_meta($user_id, 'worthbuy_point', 5);
    }
}
// 在 'user_register' 钩子上添加函数，以便在用户注册时调用
add_action('user_register', 'syb_add_custom_user_meta');

// 显示用户的 'worthbuy_point' 元数据
function syb_display_user_points() {
    // 获取当前用户的 ID
    $user_id = get_current_user_id();
    // 获取用户的 'worthbuy_point' 元数据
    $points = get_user_meta($user_id, 'worthbuy_point', true);
    // 如果元数据存在，显示它
    if ($points !== '') {
        echo '<p>Your Worthbuy Points: ' . esc_html($points) . '</p>';
    } else {
        echo '<p>No Worthbuy points data available.</p>';
    }
}
// 在 WooCommerce 账户详细信息表单中显示自定义数据
add_action('woocommerce_edit_account_form', 'syb_display_user_points');
///////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////
// 注册短代码功能
// 显示新生成的任务产品表格
function syb_display_task_products($task_products) {
    ob_start(); // 开启输出缓冲
    ?>
    <div class="woocommerce columns-4">
        <ul class="products">
            <?php if ($task_products->have_posts()): // 检查是否有产品 ?>
                <?php while ($task_products->have_posts()): $task_products->the_post(); // 遍历产品 ?>
                    <?php wc_get_template_part('content', 'product'); // 调用 WooCommerce 产品显示模板 ?>
                <?php endwhile; wp_reset_postdata(); // 重置全局 $post 对象 ?>
            <?php else: ?>
                <li class="product">
                    <p>No tasks generated.</p>
                </li>
            <?php endif; ?>
        </ul>
    </div>
    <?php
    return ob_get_clean(); // 获取并返回输出缓冲的内容
}


// 在新订单创建后处理产品
function syb_create_task_products_on_order($order_id) {
    $order = wc_get_order($order_id); // 获取订单对象
    $product_count = array(); // 初始化产品计数数组
    $task_products = array(); // 初始化任务产品数组

    // 检查订单是否已有自定义属性 tasked
    if ($order->get_meta('tasked') !== 'yes') {
        foreach ($order->get_items() as $item) { // 遍历订单中的所有产品
            $product_id = $item->get_product_id(); // 获取产品ID
            $product = wc_get_product($product_id); // 获取产品对象

            // 检查产品类别是否为 'point'
            if (has_term('point', 'product_cat', $product_id)) {
                $product_name = $product->get_name(); // 获取产品名称
                if (!isset($product_count[$product_name])) {
                    $product_count[$product_name] = 0; // 初始化计数
                }
                $product_count[$product_name]++; // 增加计数

                // 如果同一产品订单数量大于3，生成新的产品并添加自定义属性
                if ($product_count[$product_name] > 3) {
                    if (!isset($task_products[$product_name])) {
                        $task_products[$product_name] = 1; // 标记任务产品

                        // 创建新的 'task' 产品
                        $new_product = new WC_Product_Simple();
                        $new_product->set_name($product_name . ' Task'); // 设置新产品名称
                        $new_product->set_regular_price('0'); // 或者设定实际价格
                        $new_product->set_category_ids(array(get_term_by('slug', 'task', 'product_cat')->term_id)); // 设置产品类别为 'task'
                        $new_product->save(); // 保存新产品

                        // 添加自定义属性到订单
                        $order->update_meta_data('tasked', 'yes'); // 更新订单元数据
                        $order->save(); // 保存订单
                    }
                }
            }
        }
    }
}

// 注册钩子，当新订单创建时调用
add_action('woocommerce_thankyou', 'syb_create_task_products_on_order');

// 注册短代码功能
function syb_create_task_product_shortcode() {
    // 假设这个函数会显示任务产品的信息
    global $wpdb;
    $task_products = array(); // 假设从数据库中获取相关信息
// 获取所有类别为 'task' 且库存数量不为 0 的产品
$args = array(
    'post_type' => 'product',
    'posts_per_page' => -1,
    'tax_query' => array(
        array(
            'taxonomy' => 'product_cat',
            'field'    => 'slug',
            'terms'    => 'task',
        ),
    ),
    'meta_query' => array(
        array(
            'key'     => '_stock',
            'value'   => '0',
            'compare' => '>',
            'type'    => 'NUMERIC'
        )
    )
);

$task_products = new WP_Query($args);



    // 显示任务产品表格
    return syb_display_task_products($task_products);
}
add_shortcode('syb_create_task_product', 'syb_create_task_product_shortcode'); // 注册短代码
////////////////////////////////////////////////////////////////////////////////////////////
// 生成积分赠送表单的短代码
function syb_point_transfer_form() {
    ob_start(); // 开启输出缓冲
    ?>
    <form id="syb-point-transfer-form" method="post">
        <label for="recipient_email">Recipient Email:</label>
        <input type="email" id="recipient_email" name="recipient_email" required>
        <label for="points">Points to Transfer:</label>
        <input type="number" id="points" name="points" min="1" required>
        <input type="submit" name="submit" value="Transfer Points">
    </form>
    <?php
    // 处理表单提交
    if (isset($_POST['submit'])) {
        $current_user = wp_get_current_user();
        $recipient_email = sanitize_email($_POST['recipient_email']);
        $points = intval($_POST['points']);
        
        // 检查接收者是否为注册用户
        if ($recipient_user = get_user_by('email', $recipient_email)) {
            $recipient_id = $recipient_user->ID;
            $current_user_points = get_user_meta($current_user->ID, 'points', true);
            $recipient_user_points = get_user_meta($recipient_id, 'points', true);

            // 检查当前用户是否有足够的积分
            if ($current_user_points >= $points) {
                // 更新当前用户和接收者的积分
                update_user_meta($current_user->ID, 'points', $current_user_points - $points);
                update_user_meta($recipient_id, 'points', $recipient_user_points + $points);

                // 发送验证邮件给接收者
                $verification_link = add_query_arg(array(
                    'action' => 'verify_point_transfer',
                    'sender' => $current_user->ID,
                    'recipient' => $recipient_id,
                    'points' => $points,
                    'nonce' => wp_create_nonce('verify_point_transfer')
                ), home_url());

                wp_mail($recipient_email, 'Point Transfer Verification', 'Click the following link to verify the point transfer: ' . $verification_link);

                echo '<p>Transfer request sent. Please check your email to verify the transfer.</p>';
            } else {
                echo '<p>Insufficient points to complete the transfer.</p>';
            }
        } else {
            echo '<p>The email address is not registered on this site. Please enter a registered user email.</p>';
        }
    }

    return ob_get_clean(); // 获取并返回输出缓冲的内容
}
add_shortcode('syb_point_transfer', 'syb_point_transfer_form');

// 处理积分转移验证
function syb_verify_point_transfer() {
    if (isset($_GET['action']) && $_GET['action'] === 'verify_point_transfer') {
        $sender_id = intval($_GET['sender']);
        $recipient_id = intval($_GET['recipient']);
        $points = intval($_GET['points']);
        $nonce = $_GET['nonce'];

        if (wp_verify_nonce($nonce, 'verify_point_transfer')) {
            $sender_points = get_user_meta($sender_id, 'points', true);
            $recipient_points = get_user_meta($recipient_id, 'points', true);

            // 再次检查并更新数据库
            if ($sender_points >= $points) {
                update_user_meta($sender_id, 'points', $sender_points - $points);
                update_user_meta($recipient_id, 'points', $recipient_points + $points);

                echo '<p>Point transfer verified and completed.</p>';
            } else {
                echo '<p>Insufficient points to complete the transfer.</p>';
            }
        } else {
            echo '<p>Verification failed. Invalid request.</p>';
        }
    }
}
add_action('init', 'syb_verify_point_transfer');

function syb_chat_form_shortcode() {
    ob_start();
    ?>
    <div style="display: flex; flex-direction: column; align-items: flex-start;">
        <!-- 显示短代码执行效果 -->
        <div>
            <form id="syb-chat-form">
                <label for="syb-message">Enter your message:</label>
                <textarea id="syb-message" name="syb-message" rows="4" cols="50"></textarea>
                <button type="button" id="syb-submit">Send</button>
            </form>
            <div id="syb-chat-response"></div>
        </div>

        <!-- 显示短代码完整内容 -->
        <div style="margin-top: 20px;">
            <h3>Shortcode Content:</h3>
            <pre>
                <?php echo htmlspecialchars('
function syb_chat_form_shortcode() {
    ob_start();
    ?>
    <form id="syb-chat-form">
        <label for="syb-message">Enter your message:</label>
        <textarea id="syb-message" name="syb-message" rows="4" cols="50"></textarea>
        <button type="button" id="syb-submit">Send</button>
    </form>
    <div id="syb-chat-response"></div>

    <script type="text/javascript">
        document.getElementById(\'syb-submit\').addEventListener(\'click\', function() {
            var message = document.getElementById(\'syb-message\').value;
            console.log("Button clicked");
            console.log("Message: ", message);

            fetch(\'https://worthbuy.com.au/chat/\', {
                method: \'POST\',
                headers: {
                    \'Content-Type\': \'application/json\'
                },
                body: JSON.stringify({ message: message })
            })
            .then(response => response.json())
            .then(data => {
                console.log("Response received:", data);
                document.getElementById(\'syb-chat-response\').innerHTML = \'<p>Response: \' + data.result + \'</p>\';
            })
            .catch(error => {
                console.error(\'Error:\', error);
            });
        });
    </script>
    <?php
    return ob_get_clean();
}
add_shortcode(\'syb_chat_form\', \'syb_chat_form_shortcode\');
                '); ?>
            </pre>
        </div>
    </div>

    <script type="text/javascript">
        document.getElementById('syb-submit').addEventListener('click', function() {
            var message = document.getElementById('syb-message').value;
            console.log("Button clicked");
            console.log("Message: ", message);

            fetch('https://worthbuy.com.au/chat/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            })
            .then(response => response.json())
            .then(data => {
                console.log("Response received:", data);
                document.getElementById('syb-chat-response').innerHTML = '<p>Response: ' + data.result + '</p>';
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    </script>
    <?php
    return ob_get_clean();
}
add_shortcode('syb_chat_form', 'syb_chat_form_shortcode');

function dynamic_login_form() {
    ob_start();

    // 检查是否有登录错误信息
    $error_message = '';
    if (isset($_GET['login']) && $_GET['login'] == 'failed') {
        $error_message = '<div class="login-error">登录失败，请重试。</div>';
    }

    ?>
    <style>
        .login-form-wrapper {
            max-width: 400px;
            margin: 0 auto;
            padding: 20px;
            background: #222;
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.2);
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.5s ease;
            color: #fff;
            border-radius: 10px;
        }
        .login-form-wrapper.visible {
            opacity: 1;
            transform: translateY(0);
        }
        .login-error {
            color: red;
            margin-bottom: 15px;
        }
        .login-form-wrapper label {
            color: #aaa;
        }
        .login-form-wrapper input[type="text"],
        .login-form-wrapper input[type="password"] {
            background: #333;
            color: #fff;
            border: 1px solid #444;
            padding: 10px;
            width: 100%;
            margin-bottom: 10px;
            border-radius: 5px;
        }
        .login-form-wrapper input[type="submit"] {
            background: #0073aa;
            color: #fff;
            border: none;
            padding: 10px 15px;
            cursor: pointer;
            width: 100%;
            border-radius: 5px;
            transition: background 0.3s ease;
        }
        .login-form-wrapper input[type="submit"]:hover {
            background: #005177;
        }
    </style>
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            document.querySelector('.login-form-wrapper').classList.add('visible');
        });
    </script>
    <div class="login-form-wrapper">
        <?php echo $error_message; ?>
        <form action="<?php echo wp_login_url(); ?>" method="post">
            <p>
                <label for="user_login">用户名</label>
                <input type="text" name="log" id="user_login" class="input" value="" size="20" />
            </p>
            <p>
                <label for="user_pass">密码</label>
                <input type="password" name="pwd" id="user_pass" class="input" value="" size="20" />
            </p>
            <p>
                <input type="submit" value="登录" />
            </p>
        </form>
    </div>
    <?php

    return ob_get_clean();
}

add_shortcode('dynamic_login_syb', 'dynamic_login_form');
