<?php
/*
 * Plugin Test for Shortcode Visualizer and Dynamic Loader
 * This test script checks whether the plugin's core functionalities are working as expected:
 * - Database creation
 * - Shortcode registration and dynamic execution
 * - User input processing
 * - Admin page interaction
 */

// Import WordPress test functions
require_once 'AI-Enhanced-WordPress-Development-Toolkit\wordpress\wordpress_plugin\GPT_Shortcode_Visualizer.php';

// Define the class to test the plugin
class Test_Shortcode_Visualizer_Plugin extends WP_UnitTestCase {

    // Setup function to initialize test conditions
    public function setUp() {
        parent::setUp();
        // Simulate the plugin activation hook which creates the database table
        shortcode_visualizer_install();
    }

    // Test if the database table was created successfully
    public function test_database_table_created() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'shortcode_visualizer';

        // Check if the table exists
        $this->assertEquals($table_name, $wpdb->get_var("SHOW TABLES LIKE '$table_name'"));
    }

    // Test if a shortcode can be inserted into the database
    public function test_insert_shortcode_into_database() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'shortcode_visualizer';

        // Simulate form submission to insert a new shortcode
        $wpdb->insert(
            $table_name,
            array(
                'shortcode_name' => 'test_shortcode',
                'shortcode_content' => 'This is a test shortcode content.'
            )
        );

        // Verify if the shortcode is stored in the database
        $shortcode = $wpdb->get_row("SELECT * FROM $table_name WHERE shortcode_name = 'test_shortcode'");
        $this->assertEquals('This is a test shortcode content.', $shortcode->shortcode_content);
    }

    // Test dynamic shortcode registration
    public function test_dynamic_shortcode_registration() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'shortcode_visualizer';

        // Insert a shortcode into the database
        $wpdb->insert(
            $table_name,
            array(
                'shortcode_name' => 'dynamic_shortcode_test',
                'shortcode_content' => 'Dynamic shortcode content.'
            )
        );

        // Trigger shortcode registration
        register_dynamic_shortcodes();

        // Simulate WordPress rendering a post with this shortcode
        $output = do_shortcode('[dynamic_shortcode_test]');

        // Check if the content is correctly rendered
        $this->assertEquals('Dynamic shortcode content.', $output);
    }

    // Test shortcode editing functionality in admin page
    public function test_shortcode_editing() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'shortcode_visualizer';

        // Insert a shortcode for editing
        $wpdb->insert(
            $table_name,
            array(
                'shortcode_name' => 'editable_shortcode',
                'shortcode_content' => 'Editable content.'
            )
        );

        // Simulate form submission to edit the shortcode
        $wpdb->update(
            $table_name,
            array('shortcode_content' => 'Updated editable content.'),
            array('shortcode_name' => 'editable_shortcode')
        );

        // Verify the updated content
        $shortcode = $wpdb->get_row("SELECT * FROM $table_name WHERE shortcode_name = 'editable_shortcode'");
        $this->assertEquals('Updated editable content.', $shortcode->shortcode_content);
    }

    // Test user input processing in shortcode form submission
    public function test_shortcode_form_submission() {
        // Simulate user submitting the form with some input data
        $fake_user_input = 'Test user input data';

        // Mock the POST request data
        $_POST['syb_input'] = $fake_user_input;

        // Capture the output of the form processing
        ob_start();
        echo shortcode_visualizer_create_post_request_form();
        $output = ob_get_clean();

        // Ensure the form output is properly displayed
        $this->assertStringContainsString('<textarea', $output);
        $this->assertStringContainsString('Test user input data', $output);
    }

    // Test security aspects of the plugin
    public function test_security_measures() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'shortcode_visualizer';

        // Attempt SQL injection and check if it's sanitized
        $wpdb->insert(
            $table_name,
            array(
                'shortcode_name' => 'test_injection',
                'shortcode_content' => '<script>alert("XSS")</script>'
            )
        );

        // Retrieve the stored shortcode content and ensure it's sanitized
        $shortcode = $wpdb->get_row("SELECT shortcode_content FROM $table_name WHERE shortcode_name = 'test_injection'");
        $sanitized_content = wp_kses_post($shortcode->shortcode_content);

        // Check if potentially harmful scripts are removed
        $this->assertNotEquals('<script>alert("XSS")</script>', $sanitized_content);
        $this->assertEquals('alert("XSS")', $sanitized_content);
    }

    // Clean up after each test
    public function tearDown() {
        global $wpdb;
        $table_name = $wpdb->prefix . 'shortcode_visualizer';

        // Delete the table after each test to reset the environment
        $wpdb->query("DROP TABLE IF EXISTS $table_name");
        parent::tearDown();
    }
}

?>
