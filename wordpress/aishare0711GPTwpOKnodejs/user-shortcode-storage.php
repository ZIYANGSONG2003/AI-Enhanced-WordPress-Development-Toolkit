<?php
/*
Plugin Name: User Shortcode Storage
Plugin URI: https://example.com
Description: Allows users to add their own shortcodes and store them into the database.
Version: 1.0
Author: Your Name
Author URI: https://example.com
License: GPL2
*/

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

// Function to install the database table for storing shortcodes
function user_shortcode_storage_install() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'user_shortcodes';

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
    }
}
register_activation_hook(__FILE__, 'user_shortcode_storage_install');

// Function to create a form for users to submit their shortcodes
function user_shortcode_submission_form() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'user_shortcodes';

    // Handle form submission
    if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['shortcode_name']) && isset($_POST['shortcode_content'])) {
        $shortcode_name = sanitize_text_field($_POST['shortcode_name']);
        $shortcode_content = wp_kses_post($_POST['shortcode_content']);

        // Insert the new shortcode into the database
        $wpdb->insert(
            $table_name,
            array(
                'shortcode_name' => $shortcode_name,
                'shortcode_content' => $shortcode_content
            )
        );

        echo '<div class="updated"><p>Shortcode saved successfully!</p></div>';
    }

    // Display the form for shortcode submission
    ob_start();
    ?>
    <div class="wrap">
        <h1>Add Your Own Shortcode</h1>
        <form method="POST">
            <table class="form-table">
                <tr valign="top">
                    <th scope="row">Shortcode Name</th>
                    <td><input type="text" name="shortcode_name" required /></td>
                </tr>
                <tr valign="top">
                    <th scope="row">Shortcode Content</th>
                    <td><textarea name="shortcode_content" rows="10" cols="50" required></textarea></td>
                </tr>
            </table>
            <?php submit_button('Save Shortcode'); ?>
        </form>
    </div>
    <?php
    return ob_get_clean();
}

// Register a shortcode that outputs the shortcode submission form
add_shortcode('user_shortcode_submission_form', 'user_shortcode_submission_form');

// Register the dynamic shortcodes stored in the database
function register_user_shortcodes() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'user_shortcodes';

    // Retrieve shortcodes from the database
    $shortcodes = $wpdb->get_results("SELECT shortcode_name, shortcode_content FROM $table_name");

    foreach ($shortcodes as $shortcode) {
        $shortcode_name = esc_attr($shortcode->shortcode_name);
        $shortcode_content = stripslashes($shortcode->shortcode_content);

        // Register the dynamic shortcode
        add_shortcode($shortcode_name, function() use ($shortcode_content) {
            ob_start();
            eval('?>' . $shortcode_content); // Evaluate the stored PHP content
            return ob_get_clean();
        });
    }
}
add_action('init', 'register_user_shortcodes');
