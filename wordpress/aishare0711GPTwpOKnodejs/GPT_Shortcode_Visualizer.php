<?php
/*
Plugin Name: Shortcode Visualizer and Dynamic Loader
Plugin URI: https://example.com
Description: A plugin that allows users to visualize and dynamically load their GPT generated shortcodes.
Version: 1.0
Author: Your Name
Author URI: https://example.com
License: GPL2
*/

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

function log_debug_info($message) {
    if (WP_DEBUG === true) {
        error_log($message); // 将自定义的调试信息写入日志
    }
}

// 注册激活钩子，创建数据库表来存储PHP代码
register_activation_hook(__FILE__, 'shortcode_visualizer_install');
function shortcode_visualizer_install() {
    global $wpdb;

    $table_name = $wpdb->prefix . 'shortcode_visualizer';
    
    // 检查表是否已经存在
    if ($wpdb->get_var("SHOW TABLES LIKE '$table_name'") != $table_name) {
        $charset_collate = $wpdb->get_charset_collate();

        $sql = "CREATE TABLE $table_name (
            id mediumint(9) NOT NULL AUTO_INCREMENT,
            shortcode_name varchar(255) NOT NULL,
            shortcode_content text NOT NULL,
            PRIMARY KEY  (id)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);

        if ($wpdb->last_error) {
            log_debug_info('数据库安装错误: ' . $wpdb->last_error);
        }
    }
}

// 动态加载和注册短代码
function register_dynamic_shortcodes() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'shortcode_visualizer';
    
    // Retrieve shortcodes from the database
    $shortcodes = $wpdb->get_results("SELECT shortcode_name, shortcode_content FROM $table_name");
    
    // Register each shortcode
    foreach ($shortcodes as $shortcode) {
        $shortcode_name = esc_attr($shortcode->shortcode_name);
        $shortcode_content = stripslashes($shortcode->shortcode_content);
        
        // Create a dynamic function using anonymous function
        add_shortcode($shortcode_name, function() use ($shortcode_content) {
            ob_start();
            eval('?>' . $shortcode_content);
            return ob_get_clean();
        });
    }
}
add_action('init', 'register_dynamic_shortcodes');

// 创建管理页面菜单
add_action('admin_menu', 'shortcode_visualizer_menu');
function shortcode_visualizer_menu() {
    add_menu_page(
        'Shortcode Visualizer',
        'Shortcodes',
        'manage_options',
        'shortcode-visualizer',
        'shortcode_visualizer_page',
        'dashicons-editor-code',
        20
    );
}

// 显示管理页面内容
function shortcode_visualizer_page() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'shortcode_visualizer';

    $shortcode_id = 0;
    $shortcode_name = '';
    $shortcode_content = '';

    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        if (isset($_POST['new_shortcode_name']) && isset($_POST['new_shortcode_content'])) {
            // 处理新增短代码表单提交
            $shortcode_name = sanitize_text_field($_POST['new_shortcode_name']);
            $shortcode_content = wp_kses_post($_POST['new_shortcode_content']);

            $result = $wpdb->insert(
                $table_name,
                array(
                    'shortcode_name' => $shortcode_name,
                    'shortcode_content' => $shortcode_content
                )
            );
            if ($result) {
                echo '<div class="updated"><p>Shortcode saved successfully!</p></div>';
                do_action('shortcode_visualizer_updated'); // 触发更新短代码的动作
            } else {
                echo '<div class="error"><p>Failed to save shortcode!</p></div>';
            }
        } elseif (isset($_POST['shortcode_name']) && isset($_POST['shortcode_content']) && isset($_POST['shortcode_id'])) {
            // 处理编辑短代码表单提交
            $shortcode_id = intval($_POST['shortcode_id']);
            $shortcode_name = sanitize_text_field($_POST['shortcode_name']);
            $shortcode_content = wp_kses_post($_POST['shortcode_content']);

            $wpdb->update(
                $table_name,
                array(
                    'shortcode_name' => $shortcode_name,
                    'shortcode_content' => $shortcode_content
                ),
                array('id' => $shortcode_id)
            );
            echo '<div class="updated"><p>Shortcode updated successfully!</p></div>';
            do_action('shortcode_visualizer_updated'); // 触发更新短代码的动作
        }
    } elseif ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['edit'])) {
        // 获取要编辑的短代码
        $shortcode_id = intval($_GET['edit']);
        $shortcode = $wpdb->get_row($wpdb->prepare("SELECT * FROM $table_name WHERE id = %d", $shortcode_id));
        if ($shortcode) {
            $shortcode_name = $shortcode->shortcode_name;
            $shortcode_content = $shortcode->shortcode_content;
        }
    } elseif ($_SERVER['REQUEST_METHOD'] == 'GET' && isset($_GET['delete'])) {
        // 删除短代码
        $shortcode_id = intval($_GET['delete']);
        $wpdb->delete($table_name, array('id' => $shortcode_id));
        echo '<div class="updated"><p>Shortcode deleted successfully!</p></div>';
        do_action('shortcode_visualizer_updated'); // 触发更新短代码的动作
    }

    $shortcodes = $wpdb->get_results("SELECT * FROM $table_name");

    ?>
    <div class="wrap">
        <h1>Shortcode Visualizer</h1>
        <form method="POST">
            <input type="hidden" name="shortcode_id" value="<?php echo esc_attr($shortcode_id); ?>" />
            <table class="form-table">
                <tr valign="top">
                    <th scope="row">Shortcode Name</th>
                    <td><input type="text" name="shortcode_name" value="<?php echo esc_attr($shortcode_name); ?>" required /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Shortcode Content</th>
                    <td><textarea name="shortcode_content" rows="10" cols="50" required><?php echo esc_textarea($shortcode_content); ?></textarea></td>
                </tr>
            </table>
            <?php submit_button($shortcode_id ? 'Update Shortcode' : 'Save Shortcode'); ?>
        </form>
        <h2>Saved Shortcodes</h2>
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Shortcode Name</th>
                    <th scope="col">Shortcode Content</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($shortcodes as $shortcode) : ?>
                    <tr>
                        <td><?php echo esc_html($shortcode->id); ?></td>
                        <td><?php echo esc_html($shortcode->shortcode_name); ?></td>
                        <td><?php echo esc_html($shortcode->shortcode_content); ?></td>
                        <td>
                            <a href="?page=shortcode-visualizer&edit=<?php echo esc_attr($shortcode->id); ?>" class="button">Edit</a>
                            <a href="?page=shortcode-visualizer&delete=<?php echo esc_attr($shortcode->id); ?>" class="button" onclick="return confirm('Are you sure you want to delete this shortcode?');">Delete</a>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
        <h2>Add New Shortcode</h2>
        <form method="POST">
            <table class="form-table">
                <tr valign="top">
                    <th scope="row">Shortcode Name</th>
                    <td><input type="text" name="new_shortcode_name" required /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Shortcode Content</th>
                    <td><textarea name="new_shortcode_content" rows="10" cols="50" required></textarea></td>
                </tr>
            </table>
            <?php submit_button('Add Shortcode'); ?>
        </form>
    </div>
    <?php
}

// 注册短代码表单功能
function shortcode_visualizer_create_post_request_form() {
    // 开始输出缓冲
    ob_start();
    ?>
    <div id="shortcode-visualizer-result-container" style="max-height: 300px; overflow-y: auto; margin-top: 20px;">
        <!-- Data will be displayed here -->
    </div>
    <form id="shortcode-visualizer-post-request-form">
        <label for="shortcode-visualizer-textarea">Enter data:</label>
        <textarea id="shortcode-visualizer-textarea" name="syb_input" rows="4" cols="50" required></textarea>
        <button type="submit">Submit</button>
    </form>
    <script>
    document.getElementById('shortcode-visualizer-post-request-form').addEventListener('submit', async function(event) {
        event.preventDefault();
        const textValue = document.getElementById('shortcode-visualizer-textarea').value;
        const resultContainer = document.getElementById('shortcode-visualizer-result-container');

        // 尝试发送请求并处理响应
        try {
            const res = await fetch('https://worthbuy.com.au/chat/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: textValue }),
            });

            const data = await res.json();
            // 清空容器并显示新数据
            resultContainer.innerHTML = '';
            // 处理并显示数据
            if (Array.isArray(data)) {
                data.forEach(item => {
                    const p = document.createElement('p');
                    p.textContent = item;
                    resultContainer.appendChild(p);
                });
            } else {
                for (const key in data) {
                    if (data.hasOwnProperty(key)) {
                        const p = document.createElement('p');
                        p.textContent = `${key}: ${data[key]}`;
                        resultContainer.appendChild(p);
                    }
                }
            }
        } catch (error) {
            // 错误处理
            console.log('Error:', error);
            resultContainer.innerHTML = '<p style="color: red;">An error occurred while fetching data.</p>';
        }
    });
    </script>
    <?php
    // 返回缓冲区内容并结束缓冲
    return ob_get_clean();
}

add_shortcode('shortcode_visualizer_post_request_form', 'shortcode_visualizer_create_post_request_form');

?>
