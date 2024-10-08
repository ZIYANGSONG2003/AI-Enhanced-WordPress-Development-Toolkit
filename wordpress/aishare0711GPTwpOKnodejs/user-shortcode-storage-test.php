<?php
/*
 * Plugin Test for User Shortcode Storage Plugin
 * This test script checks whether the plugin's functionalities work as expected:
 * - Database creation for storing shortcodes
 * - Shortcode form submission and database insertion
 * - Dynamic shortcode registration and execution
 */

// Include the WordPress test functions
require_once 'path-to-wp-tests-functions.php';

class Test_User_Shortcode_Storage_Plugin extends WP_UnitTestCase {

    // Set up the test environment
    public function setUp() {
        parent::setUp();
        // Simulate the plugin activation, creating the database table
        user_shortcode_storage_install();
    }

    // Test if the database table was created successfully
    public function test_database_table_created() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'user_shortcodes';

        // Check if the table exists
        $this->assertEquals($table_name, $wpdb->get_var("SHOW TABLES LIKE '$table_name'"));
    }

    // Test shortcode submission and insertion into the database
    public function test_shortcode_submission() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'user_shortcodes';

        // Simulate form submission
        $_POST['shortcode_name'] = 'test_shortcode';
        $_POST['shortcode_content'] = '<p>Test Shortcode Content</p>';

        // Capture the form processing
        user_shortcode_submission_form();

        // Check if the shortcode was inserted into the database
        $shortcode = $wpdb->get_row("SELECT * FROM $table_name WHERE shortcode_name = 'test_shortcode'");
        $this->assertEquals('<p>Test Shortcode Content</p>', $shortcode->shortcode_content);
    }

    // Test dynamic shortcode registration
    public function test_dynamic_shortcode_registration() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'user_shortcodes';

        // Insert a shortcode into the database
        $wpdb->insert(
            $table_name,
            array(
                'shortcode_name' => 'dynamic_shortcode',
                'shortcode_content' => '<p>Dynamic Content</p>'
            )
        );

        // Trigger the registration of dynamic shortcodes
        register_user_shortcodes();

        // Simulate rendering the shortcode in a post
        $output = do_shortcode('[dynamic_shortcode]');

        // Verify if the shortcode content is rendered properly
        $this->assertEquals('<p>Dynamic Content</p>', $output);
    }

    // Test security aspects (sanitize input and escape output)
    public function test_input_sanitization_and_escaping() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'user_shortcodes';

        // Simulate a potentially dangerous input with script tags
        $_POST['shortcode_name'] = 'malicious_shortcode';
        $_POST['shortcode_content'] = '<script>alert("XSS Attack")</script>';

        // Capture the form processing
        user_shortcode_submission_form();

        // Retrieve the saved shortcode from the database
        $shortcode = $wpdb->get_row("SELECT shortcode_content FROM $table_name WHERE shortcode_name = 'malicious_shortcode'");

        // Ensure the script tags are properly sanitized
        $sanitized_content = wp_kses_post($shortcode->shortcode_content);
        $this->assertEquals('alert("XSS Attack")', $sanitized_content);
    }

    // Test if the shortcode form displays properly
    public function test_shortcode_form_display() {
        // Capture the output of the form display
        ob_start();
        echo do_shortcode('[user_shortcode_submission_form]');
        $form_output = ob_get_clean();

        // Check if the form contains required fields
        $this->assertStringContainsString('<input type="text" name="shortcode_name"', $form_output);
        $this->assertStringContainsString('<textarea name="shortcode_content"', $form_output);
        $this->assertStringContainsString('Save Shortcode', $form_output);
    }

    // Clean up after each test
    public function tearDown() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'user_shortcodes';

        // Delete the table after each test to reset the environment
        $wpdb->query("DROP TABLE IF EXISTS $table_name");
        parent::tearDown();
    }
}

?>
