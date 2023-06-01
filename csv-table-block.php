<?php
/*
Plugin Name: CSV Table Block
Description: A custom block for displaying CSV data in a table format.
Version: 1.0
Author: Pete Gallagher
License: GPL2
*/

function csv_table_block_register_block() {
    wp_register_script(
        'csv-table-block-editor',
        plugins_url('block.js', __FILE__),
        array('wp-blocks', 'wp-components', 'wp-element', 'wp-i18n', 'wp-block-editor', 'wp-api-fetch'),
        filemtime(plugin_dir_path(__FILE__) . 'block.js')
    );

    register_block_type('custom/csv-table-block', array(
        'editor_script' => 'csv-table-block-editor',
    ));
}
add_action('init', 'csv_table_block_register_block');
