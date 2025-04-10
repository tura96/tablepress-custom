<?php
/**
 * Plugin Name:Tables Custom Form Elements
 * Description: Adds checkbox and toggle switch elements to TablePress
 * Version: 1.0
 * Author: Tee
 */

// Don't allow direct access
if (!defined('ABSPATH')) {
    exit;
}

// Add custom elements to Ninja Tables
class NinjaTablesCustomElements {
    
    public function __construct() {
        
        // Add JavaScript for admin
        add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_scripts'));
        
        // Add JavaScript for frontend
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_scripts'));

        add_action( 'admin_notices', array($this, 'add_custom_tablepress_section') );

    }
    
    public function enqueue_admin_scripts($hook) {
        
        wp_enqueue_script(
            'ninja-tables-custom-elements',
            plugin_dir_url(__FILE__) . 'assets/js/admin-script.js',
            array('jquery'),
            '1.0.0',
            true
        );
        
        wp_enqueue_style(
            'ninja-tables-custom-elements',
            plugin_dir_url(__FILE__) . 'assets/css/admin-style.css',
            array(),
            '1.0.0'
        );
    }
    
    public function enqueue_frontend_scripts() {
        wp_enqueue_script(
            'ninja-tables-custom-elements-front',
            plugin_dir_url(__FILE__) . 'assets/js/frontend-script.js',
            array('jquery'),
            '1.0.0',
            true
        );
        
        wp_enqueue_style(
            'ninja-tables-custom-elements-front',
            plugin_dir_url(__FILE__) . 'assets/css/frontend-style.css',
            array(),
            '1.0.0'
        );
    }
    public function add_custom_tablepress_section() {
        if ( isset( $_GET['page'] ) && $_GET['page'] === 'tablepress' ) {
            ?>
            <div id="custom-tablepress-section">
                <h3>Insert Preset HTML</h3>
                <div style="margin-bottom: 10px;">
                    <button class="insert-html-btn button button-secondary" data-html='<button class="components-button is-secondary is-compact">Add</button>'>Add Button</button>
                    <button class="insert-html-btn button button-secondary" data-html='<label class="ninja-table-switch"><input type="checkbox"><span class="ninja-table-slider round"></span></label>'>Toggle Switch</button>
                    <button class="insert-html-btn button button-secondary" data-html='<label class="custom-table"><input type="checkbox"><span class=""></span></label>'>Check box</button>
                    <button class="insert-html-btn button button-secondary" data-html='<label class="custom-table"><input type="radio"><span class=""></span></label>'>Toggle radio</button>
                    <button class="insert-html-btn button button-secondary" 

                    data-html="<?php echo esc_attr('<img src=\'' . plugin_dir_url(__FILE__) . 'assets/image/toggle-button.png\' alt=\'placeholder\' />'); ?>">Image</button>
                </div>
    
                <div style="margin-bottom: 10px;">
                    <input type="text" id="custom-html-text" class="regular-text" placeholder="Enter custom text..." />
                    <button id="insert-custom-html-btn" class="button button-primary">Insert Custom Text</button>
                </div>
            </div>
    
            <style>
                #custom-tablepress-section { 
                    margin: 15px 0; 
                    padding: 10px; 
                    background: #f1f1f1; 
                    border: 1px solid #ddd; 
                }
                #custom-tablepress-section button {
                    margin-right: 5px;
                }
            </style>
            <?php
        }
    }
}

// Initialize the class
new NinjaTablesCustomElements();