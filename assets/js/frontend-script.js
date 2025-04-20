(function($) {
    'use strict';
    
    $(document).ready(function() {
        // Handle checkbox changes
        $(document).on('change', 'input[data-ninja-table-element="checkbox"]', function() {
            var $this = $(this);
            var tableId = $this.closest('table').data('table_id');
            var rowId = $this.closest('tr').data('row_id');
            var columnKey = $this.closest('td').data('column_key');
            
            // You can add AJAX call here to save state if needed
            console.log('Checkbox changed:', {
                tableId: tableId,
                rowId: rowId,
                columnKey: columnKey,
                checked: $this.is(':checked')
            });
        });
        
        // Handle toggle changes
        $(document).on('change', 'input[data-ninja-table-element="toggle"]', function() {
            var $this = $(this);
            var tableId = $this.closest('table').data('table_id');
            var rowId = $this.closest('tr').data('row_id');
            var columnKey = $this.closest('td').data('column_key');
            
            // You can add AJAX call here to save state if needed
            console.log('Toggle changed:', {
                tableId: tableId,
                rowId: rowId,
                columnKey: columnKey,
                checked: $this.is(':checked')
            });
        });
    });
    
})(jQuery);

document.addEventListener('DOMContentLoaded', function() {
    console.log('TablePress wrapper class script starting');
    setTimeout(function() {
        // Find all TablePress tables
        var tablePressTables = document.querySelectorAll('table.tablepress');
        console.log('Found TablePress tables:', tablePressTables.length);
        
        // Process each table
        tablePressTables.forEach(function(table) {
            console.log('Processing table:', table.id);
            
            // Get table classes
            var tableClasses = table.className.split(' ');
            // console.log('Table classes:', tableClasses);
            
            // Filter out standard TablePress/DataTables classes
            var extraClasses = tableClasses.filter(function(cls) {
                return !cls.includes('tablepress') && 
                    !cls.includes('dataTable') && 
                    !cls.includes('no-footer')
            });
            
            // console.log('Extra classes found:', extraClasses);
            // console.log('ID :' , table.id )
            // Find the wrapper by going up the DOM tree
            var wrapper = table.closest('.dt-container');
            if (!wrapper) {
                wrapper = document.getElementById(table.id + '_wrapper');
            }
            
            // console.log('Wrapper found:', wrapper);
            
            // Add the extra classes to the wrapper
            if (wrapper && extraClasses.length > 0) {
                extraClasses.forEach(function(cls) {
                    wrapper.classList.add(cls);
                });
                console.log('Updated wrapper classes:', wrapper.className);
            }
        });
    }, 500);
});