<?php
/**
 * Plugin Name:Tables Custom Form Elements
 * Description: Adds checkbox and toggle switch elements to TablePress
 * Version: 1.0
 * Author: Oangle
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

        $table_id = isset( $_GET['table_id'] ) ? sanitize_text_field( $_GET['table_id'] ) : '';
        $theme_palette = '';
        if ( $table_id ) {
            // $table = TablePress::$model_table->load( $table_id );
            // if ( ! is_wp_error( $table ) && isset( $table['options']['theme_palette'] ) ) {
            //     $theme_palette = $table['options']['theme_palette'];
            // }
            // $table_post_id = 0;
            // $tables = get_option( 'tablepress_tables' );
            // $tables = json_decode( $tables, true );
            // if ( empty( $tables['table_post'] ) ) {
            //     $table_post_id = 0;
            // }
            // $posts = array_flip( $tables['table_post'] );
            // $table_post_id = isset( $posts[$table_id] ) ? $posts[$table_id] : 0;
            // $theme_palette = get_post_meta( $table_post_id, '_theme_palette', true );
      
            $theme_palette = get_option( 'tablepress_theme_palette_' . $table_id, true );
        }

        // Localize script to pass the current custom class
        wp_localize_script(
            'ninja-tables-custom-elements',
            'ninjaTablesCustomElements',
            array(
                'theme_palette' => $theme_palette,
            )
        );

        $asset_url = plugin_dir_url( __FILE__ ) . 'assets/js/editor.js';

        wp_enqueue_script(
            'tpr-custom-radio',
            $asset_url,
            [ 'wp-element', 'wp-components', 'wp-data', 'wp-hooks', 'wp-i18n' ],
            '1.0',
            true
        );
        

        wp_localize_script(
            'ninja-tables-custom-elements',
            'tablepress_editor_plugin_url',
            array(
                'url' => plugin_dir_url(__FILE__)
            )
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
            <!-- Text Editor Modal -->
            <div id="tablepress-editor-insert-text" class="tablepress-editor--modal">
                <div class="tablepress-editor--modal-content">
                    <div class="tablepress-editor--modal-header">
                        <h2>Free Text Editor</h2>
                        <span class="editor-modal-close" id="tablepress-editor-insert-text-close" data-target="tablepress-editor-insert-text">&times;</span>
                    </div>
                    <div class="tablepress-editor--modal-body">
                        <textarea id="tablepress-editor-insert-textarea" class="wp-editor-area"></textarea>
                    </div>
                    <div class="tablepress-editor--modal-footer">
                        <button id="tablepress-editor-insert-text-save" class="components-button is-secondary is-compact editor-modal-save" data-target="tablepress-editor-insert-text">Save</button>
                    </div>
                </div>
            </div>
            <!-- Label Modal -->
            <div id="tablepress-editor-insert-label" class="tablepress-editor--modal">
                <div class="tablepress-editor--modal-content">
                    <div class="tablepress-editor--modal-header">
                        <h2>Label Editor</h2>
                        <span class="editor-modal-close" data-target="tablepress-editor-insert-label">&times;</span>
                    </div>
                    <div class="tablepress-editor--modal-body">
                        <div class="modal-field">
                            <label for="label-icon">Select Icon</label>
                            <div class="icon-preview"></div>
                            <button id="label-icon-upload" class="components-button is-secondary">Choose Icon</button>
                            <input type="hidden" id="label-icon-url" />
                        </div>
                        <div class="modal-field">
                            <label for="label-text">Label Text</label>
                            <input type="text" id="label-text" placeholder="Enter label text" />
                        </div>
                        <div class="modal-field">
                            <label for="tablepress-editor-text-color-picker">Text Color</label>
                            <input type="text" id="tablepress-editor-text-color-picker" value="#000000" />
                        </div>
                        <div class="modal-field">
                            <label for="tablepress-editor-bg-color-picker">Background Color</label>
                            <input type="text" id="tablepress-editor-bg-color-picker" value="#ffffff" />
                        </div>
                        <div class="modal-field">
                            <label for="label-free-text-position">Free Text Position</label>
                            <select id="label-free-text-position">
                                <option value="before">Before Label</option>
                                <option value="after">After Label</option>
                                <option value="none">None</option>
                            </select>
                        </div>
                        <div class="modal-field free-text-area">
                            <label for="label-free-textarea">Free Text</label>
                            <textarea id="label-free-textarea"></textarea>
                        </div>
                    </div>
                    <div class="tablepress-editor--modal-footer">
                        <button id="tablepress-editor-insert-label-save" class="components-button is-secondary is-compact editor-modal-save" data-target="tablepress-editor-insert-label">Save</button>
                    </div>
                </div>
            </div>
            <!-- Similar modals for Checkbox -->
            <div id="tablepress-editor-insert-checkbox" class="tablepress-editor--modal">
                <div class="tablepress-editor--modal-content">
                    <div class="tablepress-editor--modal-header">
                        <h2>Checkbox Editor</h2>
                        <span class="editor-modal-close" data-target="tablepress-editor-insert-checkbox">&times;</span>
                    </div>
                    <div class="tablepress-editor--modal-body">
                        <div class="tablepress-editor__section">
                            <input type="checkbox" id="showCheckbox" checked>
                            <input type="text" id="tablepress-editor__checkbox" id="tablepress-editor__checkbox" placeholder="Enter your text" value="">
                        </div>
                        <div class="tablepress-editor__preview tablepress-editor__preview--checbkox">
                            <span>Preview: </span>
                            <div id="previewCheckbox" class="preview-checkbox checked"></div>
                            <span id="previewCheckboxText">Body</span>
                        </div>
                    </div>
                    <div class="tablepress-editor--modal-footer">
                        <button id="tablepress-editor-insert-checkbox-save" class="components-button is-secondary is-compact editor-modal-save" data-target="tablepress-editor-insert-checkbox">Save</button>
                    </div>
                </div>
            </div>
            <!-- Similar modals for Radio -->
            <div id="tablepress-editor-insert-radio" class="tablepress-editor--modal">
                <div class="tablepress-editor--modal-content">
                    <div class="tablepress-editor--modal-header">
                        <h2>Radio Editor</h2>
                        <span class="editor-modal-close" data-target="tablepress-editor-insert-radio">&times;</span>
                    </div>
                    <div class="tablepress-editor--modal-body">
                        <input type="checkbox" name="radio-state" id="radioCheck" checked>
                        Radio Text: 
                        <input type="text" id="radio-label" placeholder="Label text" />
                    </div>
                    <div class="tablepress-editor--modal-footer">
                        <button id="tablepress-editor-insert-radio-save" class="components-button is-secondary is-compact editor-modal-save" data-target="tablepress-editor-insert-radio">Save</button>
                    </div>
                </div>
            </div>
            <!-- Similar modals for Toggle -->
            <div id="tablepress-editor-insert-toggle" class="tablepress-editor--modal">
                <div class="tablepress-editor--modal-content">
                    <div class="tablepress-editor--modal-header">
                        <h2>Toggle Editor</h2>
                        <span class="editor-modal-close" data-target="tablepress-editor-insert-toggle">&times;</span>
                    </div>
                    <div class="tablepress-editor--modal-body">
                        <input type="checkbox" name="toggleState" id="toggleState" checked>
                        Select Icon: 
                        <input type="text" id="toggle-label" placeholder="Label text" />
                    </div>
                    <div class="tablepress-editor--modal-footer">
                        <button id="tablepress-editor-insert-toggle-save" class="components-button is-secondary is-compact editor-modal-save" data-target="tablepress-editor-insert-toggle">Save</button>
                    </div>
                </div>
            </div>
            <?php
        }
    }
}

// Initialize the class
new NinjaTablesCustomElements();


function enqueue_wp_editor_modal_scripts() {
    wp_enqueue_editor();
    wp_enqueue_script('jquery');
    wp_enqueue_script('wp-util');
    wp_enqueue_style('wp-color-picker');
    wp_enqueue_script('wp-color-picker');
}
add_action('admin_enqueue_scripts', 'enqueue_wp_editor_modal_scripts');

add_filter( 'tablepress_table_render_options', 'apply_theme_palette_to_table', 10, 2 );
function apply_theme_palette_to_table( $render_options, $table ) {
    $theme_palette = get_option( 'tablepress_theme_palette_' . $table['id'], '' );
    if ( ! empty( $theme_palette ) ) {
        $render_options['extra_css_classes'] = trim( ( ! empty( $render_options['extra_css_classes'] ) ? $render_options['extra_css_classes'] . ' ' : '' ) . $theme_palette );
    }
    return $render_options;
}

add_action( 'wp_ajax_tablepress_save_table', 'save_tablepress_theme_palette', 5 );
function save_tablepress_theme_palette() {
    if ( empty( $_POST['tablepress']['id'] ) || ! check_ajax_referer( TablePress::nonce( 'edit', $_POST['tablepress']['id'] ), '_ajax_nonce', false ) ) {
        return;
    }
    $table_id = sanitize_text_field( $_POST['tablepress']['id'] );
    if ( ! current_user_can( 'tablepress_edit_table', $table_id ) ) {
        return;
    }
    $valid_classes = array( '', 'primary-mode', 'secondary1-mode', 'secondary2-mode', 'secondary3-mode' );
    $theme_palette = '';

    if ( ! empty( $_POST['tablepress']['options'] ) ) {
        $options = json_decode( wp_unslash( $_POST['tablepress']['options'] ), true );
        if ( is_array( $options ) && isset( $options['theme_palette'] ) ) {
            $theme_palette = sanitize_text_field( $options['theme_palette'] );
        }
    }

    if ( in_array( $theme_palette, $valid_classes, true ) ) {
        update_option( 'tablepress_theme_palette_' . $table_id, $theme_palette );
    } else {
        update_option( 'tablepress_theme_palette_' . $table_id, '' );
    }
}

add_filter('tablepress_table_render_options', 'store_tablepress_extra_classes', 10, 2);
function store_tablepress_extra_classes($render_options, $table) {
    // Store the extra CSS classes in a global variable or transient
    if (!empty($render_options['extra_css_classes'])) {
        set_transient('tablepress_extra_classes_' . $table['id'], $render_options['extra_css_classes'], 60 * 60);
    }
    return $render_options;
}

add_filter('tablepress_table_output', 'add_classes_to_dt_wrapper', 20, 3);
function add_classes_to_dt_wrapper($output, $table, $render_options) {
    // Get the stored extra classes
    $extra_classes = get_transient('tablepress_extra_classes_' . $table['id']);
    
    if (!empty($extra_classes)) {
        // Find the wrapper div with the correct ID
        $pattern = '/<div id="tablepress-' . $table['id'] . '_wrapper" class="(.*?)"/';
        
        if (preg_match($pattern, $output, $matches)) {
            $current_classes = $matches[1];
            $new_classes = $current_classes . ' ' . $extra_classes;
            
            // Replace the class attribute
            $output = str_replace(
                '<div id="tablepress-' . $table['id'] . '_wrapper" class="' . $current_classes . '"',
                '<div id="tablepress-' . $table['id'] . '_wrapper" class="' . $new_classes . '"',
                $output
            );
        }
        
        // Clean up the transient
        delete_transient('tablepress_extra_classes_' . $table['id']);
    }
    
    return $output;
}

add_action('wp_footer', 'add_tablepress_wrapper_classes_js_debug');
function add_tablepress_wrapper_classes_js_debug() {
    // Get all tables with their IDs and extra classes
    global $wpdb;
    $table_options = $wpdb->get_results(
        "SELECT table_id, option_value FROM {$wpdb->prefix}tablepress_tables"
    );
    
    if (empty($table_options)) {
        return;
    }
    
    echo "<script>
    console.log('TablePress wrapper class debug starting');
    document.addEventListener('DOMContentLoaded', function() {
    ";
    
    foreach ($table_options as $option) {
        $table_data = json_decode($option->option_value, true);
        echo "console.log('Processing table ID: {$option->table_id}');";
        echo "console.log('Table data:', " . json_encode($table_data) . ");";
        
        if (!empty($table_data['options']['extra_css_classes'])) {
            echo "
            var wrapper = document.getElementById('tablepress-{$option->table_id}_wrapper');
            console.log('Wrapper found:', wrapper);
            if (wrapper) {
                console.log('Adding classes: " . esc_js($table_data['options']['extra_css_classes']) . "');
                wrapper.classList.add('" . esc_js($table_data['options']['extra_css_classes']) . "');
                console.log('New classes:', wrapper.className);
            } else {
                console.log('Wrapper not found for tablepress-{$option->table_id}_wrapper');
            }
            ";
        } else {
            echo "console.log('No extra CSS classes found for table {$option->table_id}');";
        }
    }
    
    echo "
    });
    </script>";
}