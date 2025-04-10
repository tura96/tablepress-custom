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