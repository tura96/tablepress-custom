(function($) {
    'use strict';
    
    $(document).ready(function() {
        setTimeout(function() {
            // Select the WP Table Builder toolbar
        }, 2000);
    });
    
    // Function to render HTML content from table cells
    function renderHtmlInCells() {
        // Get all table cells that might contain HTML
        const cells = document.querySelectorAll('.jexcel td div');
        
        cells.forEach(cell => {
        const content = cell.textContent;
        
        // Check if the content appears to be HTML (contains < and >)
        if (content && content.includes('<') && content.includes('>')) {
            try {
            // Create a temporary container
            const tempContainer = document.createElement('div');
            
            // Set the HTML content
            tempContainer.innerHTML = content;
            
            // Replace the text content with the actual HTML elements
            cell.textContent = ''; // Clear existing text
            cell.appendChild(tempContainer);
            
            // If you want the content directly in the cell instead of in a nested div
            // You can use this instead:
            // cell.innerHTML = content;
            } catch (error) {
            console.error('Error rendering HTML in cell:', error);
            }
        }
        });
    }

  jQuery(document).ready(function ($) {

    // Function to insert HTML into the selected cell
    function insertHtmlIntoSelectedCell(htmlContent) {
            const $selectedCell = $('#table-editor td.highlight-selected.highlight');

            if ($selectedCell.length === 0) {
                alert('Please select a cell first!');
                return;
            }

            const $row = $selectedCell.closest('tr');
            const rowIndex = $row.index();
            const colIndex = $selectedCell.index() - 1;

            // Update DOM
            $selectedCell.html(htmlContent);

            // Update TablePress data
            if (typeof tp !== 'undefined' && tp.editor?.options?.data) {
                if (tp.editor.options.data[rowIndex]) {
                    tp.editor.options.data[rowIndex][colIndex] = htmlContent;
                    console.log(`Updated tp.editor.options.data[${rowIndex}][${colIndex}]`);
                }
            }
        }

        // Handle all preset buttons (with class .insert-html-btn)
        $('.insert-html-btn').on('click', function () {
            const htmlContent = $(this).data('html');
            insertHtmlIntoSelectedCell(htmlContent);
        });

        // Handle custom text input button
        $('#insert-custom-html-btn').on('click', function () {
            const customText = $('#custom-html-text').val().trim();

            if (!customText) {
                alert('Please enter some custom text.');
                return;
            }

            const htmlContent = `<span>${customText}</span>`;
            insertHtmlIntoSelectedCell(htmlContent);
        });
    });
    
  // Execute when the document is fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    renderHtmlInCells();

    document.addEventListener('click', function (e) {
        const isInsideHighlight = e.target.closest('.highlight-selected');
        if (!isInsideHighlight) {
            renderHtmlInCells();
        }
    });
    // Delegate listener for dynamic .highlight-selected changes
    document.addEventListener('click', function (e) {
        if (e.target.closest('.highlight-selected')) {
            renderHtmlInCells();
        }
    });

    // Optional: listen for other types of changes too
    document.addEventListener('change', function (e) {
        if (e.target.closest('.highlight-selected')) {
            renderHtmlInCells();
        }
    });
  });
})(jQuery);