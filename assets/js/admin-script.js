(function ($) {
    "use strict";

    //=========================
    // 🔧 Utility Functions
    //=========================

    const renderHtmlInCells = () => {
        const cells = document.querySelectorAll(".jexcel td div");
        cells.forEach((cell) => {
            const content = cell.textContent;
            if (content && content.includes("<") && content.includes(">")) {
                try {
                    const temp = document.createElement("div");
                    temp.innerHTML = content;
                    cell.textContent = "";
                    cell.appendChild(temp);
                } catch (err) {
                    console.error("Error rendering cell HTML:", err);
                }
            }
        });
    };

    const insertHtmlIntoSelectedCell = (htmlContent) => {
        const $selectedCell = $("#table-editor td.highlight-selected.highlight");
        if ($selectedCell.length === 0) {
            alert("Please select a cell first!");
            return;
        }

        const $row = $selectedCell.closest("tr");
        const rowIndex = $row.index();
        const colIndex = $selectedCell.index() - 1;

        $selectedCell.html(htmlContent);

        if (typeof tp !== "undefined" && tp.editor?.options?.data) {
            if (tp.editor.options.data[rowIndex]) {
                tp.editor.options.data[rowIndex][colIndex] = htmlContent;
                
            }
        }
    };

    //=========================
    // 🧩 Modal Editor Logic
    //=========================

    let editorInitialized = false;
    const modal = document.getElementById("tablepress-editor-insert-text");
    const editorId = "tablepress-editor-insert-textarea";

    const openEditorModal = (html = "") => {
        modal.style.display = "block";

        if (!editorInitialized) {
            wp.editor.initialize(editorId, {
                tinymce: {
                    wpautop: true,
                    height: 400,
                    plugins: "lists link image paste media fullscreen",
                    toolbar1: "formatselect | bold italic underline strikethrough | alignleft aligncenter alignright | bullist numlist | link unlink image",
                    toolbar_mode: "wrap",
                },
                quicktags: true,
                mediaButtons: true,
            });

            editorInitialized = true;

            setTimeout(() => {
                tinymce.get(editorId)?.setContent(html);
            }, 300);
        } else {
            tinymce.get(editorId)?.setContent(html);
        }
    };

    const closeEditorModal = () => {
        modal.style.display = "none";
        if (editorInitialized) {
            wp.editor.remove(editorId);
            editorInitialized = false;
        }
    };
    const modalLabel = document.getElementById("tablepress-editor-insert-label");
    const freeTextEditorId = "label-free-textarea";
    const openModal = (id) => {
        document.getElementById(id).style.display = "block";
        if (id === "tablepress-editor-insert-label") {
            initColorPickers();
            initIconPicker();
            initFreeTextEditor();
        }
    };
    const closeModal = (id) => {
        document.getElementById(id).style.display = "none";
        if (id === 'tablepress-editor-insert-text'){
            if (editorInitialized) {
                wp.editor.remove(editorId);
                editorInitialized = false;
            }
        }
    };

    // Label
    const initColorPickers = () => {
        const textColorField = document.getElementById("tablepress-editor-text-color-picker");
        const bgColorField = document.getElementById("tablepress-editor-bg-color-picker");

        if (!textColorField || !bgColorField) {
            console.error("Color picker fields not found!");
            return;
        }

        const initPicker = (field, defaultColor) => {
            $(field).wpColorPicker({
                defaultColor: defaultColor,
                palettes: true,
                change: (event, ui) => {
                    
                },
            });
        };

        const interval = setInterval(() => {
            if (typeof $.fn.wpColorPicker !== "undefined") {
                clearInterval(interval);
                initPicker(textColorField, "#000000");
                initPicker(bgColorField, "#ffffff");
            }
        }, 100);

        setTimeout(() => {
            if (typeof $.fn.wpColorPicker === "undefined") {
                clearInterval(interval);
                console.error("wpColorPicker not available.");
            }
        }, 10000);
    };

    const initIconPicker = () => {
        const uploadButton = document.getElementById("label-icon-upload");
        const iconUrlInput = document.getElementById("label-icon-url");
        const iconPreview = document.querySelector(".icon-preview");

        if (!uploadButton || !iconUrlInput || !iconPreview) {
            console.error("Icon picker elements not found!");
            return;
        }

        let mediaUploader;
        uploadButton.addEventListener("click", (e) => {
            e.preventDefault();
            if (mediaUploader) {
                mediaUploader.open();
                return;
            }

            mediaUploader = wp.media({
                title: "Select Icon",
                button: { text: "Use this icon" },
                multiple: false,
                library: { type: "image" },
            });

            mediaUploader.on("select", () => {
                const attachment = mediaUploader.state().get("selection").first().toJSON();
                iconUrlInput.value = attachment.url;
                iconPreview.innerHTML = `<img src="${attachment.url}" alt="Icon preview" />`;
            });

            mediaUploader.open();
        });
    };

    const initFreeTextEditor = () => {
        if (!editorInitialized) {
            wp.editor.initialize(freeTextEditorId, {
                tinymce: {
                    wpautop: true,
                    height: 200,
                    plugins: "lists link image paste media",
                    toolbar1: "bold italic underline | bullist numlist | link unlink",
                    toolbar_mode: "wrap",
                },
                quicktags: true,
                mediaButtons: true,
            });

            editorInitialized = true;
        }
    };
    // End Lable

    const handleModalSave = async (modalId) => {
        let html = '';
    
        switch (modalId) {
            case 'tablepress-editor-insert-text':
                html = tinymce.get('tablepress-editor-insert-textarea')?.getContent() || '';
                break;
            case 'tablepress-editor-insert-label':
                const iconUrl = document.getElementById("label-icon-url").value;
                const labelText = document.getElementById("label-text").value.trim();
                const textColor = document.getElementById("tablepress-editor-text-color-picker").value;
                const bgColor = document.getElementById("tablepress-editor-bg-color-picker").value;
                const freeTextPosition = document.getElementById("label-free-text-position").value;
                const freeText = tinymce.get(freeTextEditorId)?.getContent() || "";

                html = "<div class='oa-label'>";
                if (freeText && freeTextPosition === "before") {
                    html += freeText;
                }

                html += `<label style="color: ${textColor}; background-color: ${bgColor}; display: inline-flex; align-items: center;">`;
                if (iconUrl) {
                    html += `<img src="${iconUrl}" style="width: 20px; height: 20px; margin-right: 5px;" />`;
                }
                html += `${labelText}</label>`;

                if (freeText && freeTextPosition === "after") {
                    html += freeText;
                }
                html += '</div>';
                if (html && (labelText || iconUrl || freeText)) {
                    insertHtmlIntoSelectedCell(html);
                } else {
                    alert("Please provide at least some label text, an icon, or free text.");
                }
                closeModal(modalId);
                return;
                break;
            case 'tablepress-editor-insert-checkbox':
                const cbLabel = document.getElementById('tablepress-editor__checkbox').value;
                const cbChecked = document.getElementById('showCheckbox').checked;
                const cbClass = cbChecked ? 'checkbox-checked' : 'checkbox-unchecked';
                const cbIconUrl = cbChecked ? `${window.tablepress_editor_plugin_url.url}assets/image/checkbox.svg` : `${window.tablepress_editor_plugin_url.url}assets/image/uncheckbox.svg`;
    
                try {
                    const response = await fetch(cbIconUrl);
                    const svg = await response.text();
    
                    html = `<span class="tablepress-custom-checkbox ${cbClass}"><span class="checkbox-icon">${svg}</span><span class="checkbox-text">${cbLabel}</span></span>`;
                } catch (error) {
                    console.error('Failed to load SVG:', error);
                }
            break

            case 'tablepress-editor-insert-radio':
                const rLabel = document.getElementById('radio-label').value;
                const radioChecked = document.getElementById('radioCheck').checked;
                const radioClass = radioChecked ? 'radio-checked' : 'radio-unchecked';
                const radioIconUrl = radioChecked ? `${window.tablepress_editor_plugin_url.url}assets/image/radio.svg` : `${window.tablepress_editor_plugin_url.url}assets/image/unradio.svg`;

                try {
                    const response = await fetch(radioIconUrl);
                    const svg = await response.text();
    
                    html = `<span class="tablepress-custom-radio ${radioClass}"><span class="radio-icon">${svg}</span><span class="radio-text">${rLabel}</span></span>`;
                } catch (error) {
                    console.error('Failed to load SVG:', error);
                }

                break;

            case 'tablepress-editor-insert-toggle':
                const toggleLabel = document.getElementById('toggle-label').value;
                const toggleState = document.getElementById('toggleState').checked;
                const toggleClass = toggleState ? 'toggle-on' : 'toggle-off';
                const toggleIconUrl = toggleState ? `${window.tablepress_editor_plugin_url.url}assets/image/toggle-on-2.svg` : `${window.tablepress_editor_plugin_url.url}assets/image/toggle-off-2.svg`;

                try {
                    const response = await fetch(toggleIconUrl);
                    const svg = await response.text();

                    html = `<span class="tablepress-custom-toggle ${toggleClass}"><span class="toggle-track">${svg}</span><span class="toggle-text">${toggleLabel}</span></span>`;
                } catch (error) {
                    console.error('Failed to load SVG:', error);
                }
                break;
        }

        if (html) {
            insertHtmlIntoSelectedCell(html);
        }
    
        closeModal(modalId);
    };

    const initGeneralModalEvents = () => {
        document.querySelectorAll(".editor-modal-close").forEach((btn) => {
            btn.addEventListener("click", () => {
                const target = btn.dataset.target;
                closeModal(target);
            });
        });
    
        document.querySelectorAll(".editor-modal-save").forEach((btn) => {
            btn.addEventListener("click", () => {
                const target = btn.dataset.target;
                handleModalSave(target);
            });
        });
    };
    
    const bindModalControls = () => {
        const closeBtn = modal.querySelector("#tablepress-editor-insert-text-close");
        const saveBtn = modal.querySelector("#tablepress-editor-insert-text-save");

        if (closeBtn) closeBtn.addEventListener("click", closeEditorModal);
        if (saveBtn) saveBtn.addEventListener("click", handleSaveEditorContent);
    };

    //=========================
    // ➕ Addon Buttons
    //=========================

    const renderAddonButtons = () => {
        const buttonsHtml = `
        <button class="components-button is-secondary is-compact oa-insert-text">Insert Text</button>
        <button class="components-button is-secondary is-compact oa-insert-label">Insert Label</button>
        <button class="components-button is-secondary is-compact oa-insert-checkbox">Insert Checkbox</button>
        <button class="components-button is-secondary is-compact oa-insert-radio">Insert Radio</button>
        <button class="components-button is-secondary is-compact oa-insert-toggle">Insert Toggle</button>
        <button class="components-button is-secondary is-compact oa-edit-html">Edit Selected</button>
        `;

        const mainSection = document.getElementById("tablepress-table-manipulation-section");
        if (mainSection) {
            const wrapper = mainSection.querySelector(".column-1 .components-flex .components-flex");
            if (wrapper) {
                wrapper.insertAdjacentHTML("beforeend", buttonsHtml);
                initEditorButtons();
            }
        }
    };

    const initWPEditor = (html = "") => {
        const editorId = "tablepress-editor-insert-textarea";
        if (!editorInitialized) {
            wp.editor.initialize(editorId, {
                tinymce: {
                    wpautop: true,
                    height: 400,
                    plugins: "lists link image paste media fullscreen",
                    toolbar1: "formatselect | bold italic underline strikethrough | alignleft aligncenter alignright | bullist numlist | link unlink image",
                    toolbar_mode: "wrap",
                },
                quicktags: true,
                mediaButtons: true,
            });

            editorInitialized = true;

            setTimeout(() => {
                tinymce.get(editorId)?.setContent(html);
            }, 300);
        } else {
            tinymce.get(editorId)?.setContent(html);
        }
    };

    const initEditorButtons = () => {
        document.querySelector(".oa-insert-text")?.addEventListener("click", (event) => {
            event.preventDefault();
            const $selectedCell = $("#table-editor td.highlight-selected.highlight");
            if ($selectedCell.length === 0) {
                alert("Please select a cell to edit.");
                return;
            }

            initWPEditor("");
            openModal("tablepress-editor-insert-text");
        });
    
        document.querySelector(".oa-insert-label")?.addEventListener("click", (event) => {
            event.preventDefault();
            openModal("tablepress-editor-insert-label");

        });
        
        document.querySelector(".oa-insert-checkbox")?.addEventListener("click", (event) => {
            event.preventDefault();
            openModal("tablepress-editor-insert-checkbox");
        });
        
        document.querySelector(".oa-insert-radio")?.addEventListener("click", (event) => {
            event.preventDefault();
            openModal("tablepress-editor-insert-radio");
        });
        
        document.querySelector(".oa-insert-toggle")?.addEventListener("click", (event) => {
            event.preventDefault();
            openModal("tablepress-editor-insert-toggle");
        });        
    
        document.querySelector(".oa-edit-html")?.addEventListener("click", (event) => {
            event.preventDefault();
            const $selectedCell = $("#table-editor td.highlight-selected.highlight");
            if ($selectedCell.length === 0) {
                alert("Please select a cell to edit.");
                return;
            }
    
            const $oaLabel = $selectedCell.find(".oa-label");
            const currentHtml = $oaLabel.length > 0 ? $oaLabel[0].outerHTML : $selectedCell.html().trim();
            if ($oaLabel.length > 0) {
                const $labelWrapper = $($oaLabel[0]);
                const $label = $labelWrapper.find("label");
            
                // Extract label text
                const labelText = $label.clone()
                    .children("img").remove().end()
                    .text().trim();
                
                // Extract colors directly from the inline style attribute
                let textColor = "#000000";
                let bgColor = "#ffffff";
                const labelStyleAttr = $label.attr("style") || "";
                
                // Parse inline styles more accurately
                if (labelStyleAttr) {
                    const colorMatch = labelStyleAttr.match(/color:\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\([^)]+\))/i);
                    if (colorMatch && colorMatch[1]) {
                        textColor = colorMatch[1].trim();
                        // Convert RGB to hex if needed
                        if (textColor.startsWith("rgb")) {
                            textColor = rgbToHex(textColor);
                        }
                    }
                    
                    const bgMatch = labelStyleAttr.match(/background-color:\s*(#[0-9a-fA-F]{6}|#[0-9a-fA-F]{3}|rgb\([^)]+\))/i);
                    if (bgMatch && bgMatch[1]) {
                        bgColor = bgMatch[1].trim();
                        // Convert RGB to hex if needed
                        if (bgColor.startsWith("rgb")) {
                            bgColor = rgbToHex(bgColor);
                        }
                    }
                }
                
                const icon = $label.find("img").attr("src") || "";
            
                // Improved algorithm to determine free text and its position with HTML preservation
                let freeText = "";
                let freeTextPosition = "none";
            
                // Clone the label wrapper to work with
                const $clonedWrapper = $labelWrapper.clone();
                const $clonedLabel = $clonedWrapper.find("label");
                
                // Get HTML before the label
                let beforeHtml = "";
                let afterHtml = "";
                
                // Create a temporary div to hold all elements before the label
                const tempBeforeDiv = document.createElement('div');
                
                // Process all nodes before the label
                let currentNode = $clonedWrapper[0].firstChild;
                while (currentNode && !$(currentNode).is($clonedLabel[0])) {
                    const nextNode = currentNode.nextSibling;
                    tempBeforeDiv.appendChild(currentNode.cloneNode(true));
                    currentNode = nextNode;
                }
                
                // Get HTML string of content before label
                beforeHtml = tempBeforeDiv.innerHTML;
                
                // Create a temporary div to hold all elements after the label
                const tempAfterDiv = document.createElement('div');
                
                // Find the label node
                let foundLabel = false;
                currentNode = $clonedWrapper[0].firstChild;
                
                // Skip until after the label
                while (currentNode) {
                    const nextNode = currentNode.nextSibling;
                    
                    if (foundLabel) {
                        // We're after the label, collect this node
                        tempAfterDiv.appendChild(currentNode.cloneNode(true));
                    } else if ($(currentNode).is($clonedLabel[0])) {
                        // We found the label, mark it and continue
                        foundLabel = true;
                    }
                    
                    currentNode = nextNode;
                }
                
                // Get HTML string of content after label
                afterHtml = tempAfterDiv.innerHTML;
                
                // Determine which position to use based on content
                if (beforeHtml.trim()) {
                    freeText = beforeHtml;
                    freeTextPosition = "before";
                } else if (afterHtml.trim()) {
                    freeText = afterHtml;
                    freeTextPosition = "after";
                }
            
                // Debug output
                console.log("Before HTML:", beforeHtml);
                console.log("After HTML:", afterHtml);
                console.log("Selected position:", freeTextPosition);
                console.log("Free text HTML:", freeText);
            
                // Populate modal with a slight delay to ensure it's ready
                setTimeout(() => {
                    // Make sure to update values correctly for WP color pickers
                    $("#label-text").val(labelText);
                    
                    // WordPress color picker specific handling
                    $("#tablepress-editor-text-color-picker").val(textColor).wpColorPicker('color', textColor);
                    $("#tablepress-editor-bg-color-picker").val(bgColor).wpColorPicker('color', bgColor);
                    
                    $("#label-icon-url").val(icon);
                    $("#label-free-text-position").val(freeTextPosition).trigger('change');
            
                    if (icon) {
                        $(".icon-preview").html(`<img src="${icon}" alt="Icon preview" />`);
                    }
            
                    // Add a delay and check if the editor exists before setting content
                    setTimeout(() => {
                        if (freeText) {
                            // First, try using the editor ID variable if available
                            if (typeof freeTextEditorId !== 'undefined' && tinymce.get(freeTextEditorId)) {
                                tinymce.get(freeTextEditorId).setContent(freeText);
                                console.log("Set HTML content using freeTextEditorId:", freeTextEditorId, freeText);
                            } 
                            // Fall back to a standard ID if the variable isn't available
                            else if (tinymce.get('label-free-text')) {
                                tinymce.get('label-free-text').setContent(freeText);
                                console.log("Set HTML content using standard ID 'label-free-text':", freeText);
                            }
                            // Also update any textarea with the same ID as a backup
                            $("#label-free-text").val(freeText);
                        }
                    }, 200);
                }, 300);
            
                openModal("tablepress-editor-insert-label");
            } else if ($selectedCell.find('.tablepress-custom-radio').length > 0) {
                const $radio = $selectedCell.find('.tablepress-custom-radio');
                const radioChecked = $radio.hasClass('radio-checked');
                const radioText = $radio.find(".radio-text").text().trim();

                const radioModal = document.getElementById("tablepress-editor-insert-radio");
                if (radioModal) {
                    const labelInput = radioModal.querySelector("#radio-label");
                    const checkInput = radioModal.querySelector("#radioCheck");

                    if (labelInput) labelInput.value = radioText;
                    if (checkInput) checkInput.checked = radioChecked;
                }
                openModal("tablepress-editor-insert-radio");
            } else if ($selectedCell.find('.tablepress-custom-checkbox').length > 0) {
                let $checkbox = $selectedCell.find('.tablepress-custom-checkbox');
                let checkboxChecked = false;
                if ($checkbox.length > 0) {
                    checkboxChecked = $checkbox.hasClass('checkbox-checked');
                }
                let checkboxText = $checkbox.find(".checkbox-text").text();

                const checkboxModal = document.getElementById("tablepress-editor-insert-checkbox");
                if (checkboxModal) {
                    const checkInput = checkboxModal.querySelector("#showCheckbox");
                    const labelInput = checkboxModal.querySelector("#tablepress-editor__checkbox");

                    if (labelInput) labelInput.value = checkboxText;
                    if (checkInput) checkInput.checked = checkboxChecked;
                }

                openModal("tablepress-editor-insert-checkbox");
            } else if ($selectedCell.find('.tablepress-custom-toggle').length > 0) {
                let $toggle = $selectedCell.find('.tablepress-custom-toggle');
                let toggleChecked = false;
                if ($toggle.length > 0) {
                    toggleChecked = $toggle.hasClass('toggle-on');
                }
                let toggleText = $toggle.find(".toggle-text").text();
                const toggleModal = document.getElementById("tablepress-editor-insert-toggle");
                if (toggleModal) {
                    const checkInput = toggleModal.querySelector("#toggleState");
                    const labelInput = toggleModal.querySelector("#toggle-label");

                    if (labelInput) labelInput.value = toggleText;
                    if (checkInput) checkInput.checked = toggleChecked;
                }
                openModal("tablepress-editor-insert-toggle");
            } else {
                initWPEditor(currentHtml);
                openModal("tablepress-editor-insert-text");
            }
        });
    };

    const initThemePaletteSelect = () => {
        setTimeout(() => {
            const selectedValue = ninjaTablesCustomElements?.theme_palette || '';
    
            document.querySelectorAll('input[name="inspector-radio-control-0"]').forEach((input) => {
                if (input.value === selectedValue) {
                    input.checked = true;
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });

            const editScreen = document.getElementById("tablepress-edit-screen");
            const tableOptions = document.getElementById("tablepress_edit-table-options");

            if (editScreen && tableOptions && tableOptions.parentNode) {
            tableOptions.parentNode.insertBefore(editScreen, tableOptions);
            }
                    }, 1000);
    }
    const initThemePaletteSelector = () => {
        // Get the current theme_palette from tp.table.options or fallback to empty string
        let customClass = '';
        if (window.tp && window.tp.table && window.tp.table.options && window.tp.table.options.theme_palette) {
            customClass = window.tp.table.options.theme_palette;
        }
    
        // Create the custom section
        const section = document.createElement('div');
        section.className = 'postbox';
        section.id = 'custom-class-section';
        
        const title = document.createElement('h2');
        title.className = 'hndle';
        title.textContent = 'Theme Palette';
        section.appendChild(title);
        
        const inside = document.createElement('div');
        inside.className = 'inside';
        section.appendChild(inside);
        
        const table = document.createElement('table');
        table.className = 'tablepress-options tablepress-options-palette';
        inside.appendChild(table);
        
        const tbody = document.createElement('tbody');
        table.appendChild(tbody);
        
        const row = document.createElement('tr');
        tbody.appendChild(row);
        
        const th = document.createElement('th');
        th.className = 'column-1';
        th.textContent = 'Select Theme Palette';
        row.appendChild(th);
        
        const td = document.createElement('td');
        td.className = 'column-2';
        row.appendChild(td);
        
        const options = [
            { value: '', text: 'None (Default)' },
            { value: 'primary-mode', text: 'Palette 1' },
            { value: 'secondary1-mode', text: 'Palette 2' },
            { value: 'secondary2-mode', text: 'Palette 3' },
            { value: 'secondary3-mode', text: 'Palette 4' }
        ];
        
        // Create radio buttons and attach change event listeners
        options.forEach(function(opt, index) {
            const container = document.createElement('div');
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'table[options][theme_palette]';
            radio.id = 'custom-class-' + index;
            radio.value = opt.value;
            
            if (opt.value === customClass) {
                radio.checked = true;
            }
            
            // Add change event listener to update TablePress options
            radio.addEventListener('change', function() {
                if (window.tp && window.tp.helpers && window.tp.helpers.unsaved_changes) {
                    // Update tp.table.options directly
                    window.tp.table.options.theme_palette = this.value;
                    // Trigger unsaved changes
                    window.tp.helpers.unsaved_changes.set();
                    // Call updateTableOptions if available (to sync with React state)
                    if (window.tp.updateTableOptions) {
                        window.tp.updateTableOptions({ theme_palette: this.value });
                    }
                }
                // Update hidden input as backup
                hiddenInput.value = this.value;
            });
            
            const label = document.createElement('label');
            label.htmlFor = 'custom-class-' + index;
            label.textContent = opt.text;
            label.style.marginLeft = '5px';
            
            container.appendChild(radio);
            container.appendChild(label);
            td.appendChild(container);
        });
    
        const row2 = document.createElement('tr');
        const descriptionTd = document.createElement('td');
        descriptionTd.colSpan = 2;
        const description = document.createElement('p');
        description.className = 'description';
        description.textContent = 'Select a theme palette to apply to the table on the frontend.';
        descriptionTd.appendChild(description);
        row2.appendChild(descriptionTd);
        tbody.appendChild(row2);
        
        // Find the correct insertion point
        const editOptions = document.querySelector('#tablepress_edit-options');
        if (editOptions) {
            editOptions.appendChild(section);
        } else {
            const form = document.querySelector('#tablepress-page > form');
            if (form) {
                form.appendChild(section);
            }
        }
    
        // Add a direct hidden field as backup
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'tablepress_theme_palette';
        hiddenInput.value = customClass;
        
        const form = document.querySelector('#tablepress-page > form');
        if (form) {
            form.appendChild(hiddenInput);
        }
    };


    const updateCheckboxPreview = () => {
        const checkbox = document.getElementById('showCheckbox');
        const textInput = document.getElementById('tablepress-editor__checkbox');
        const previewCheckbox = document.getElementById('previewCheckbox');
        const previewText = document.getElementById('previewCheckboxText');

        // checkbox.addEventListener('change', updatePreview);
        // textInput.addEventListener('input', updatePreview);
        if (checkbox.checked) {
            previewCheckbox.classList.toggle('checked');
        }
        previewText.textContent = textInput.value || 'Body';
    }
    const rgbToHex = (rgb) => {
        const result = rgb.match(/\d+/g);
        if (!result) return "#000000";
        return "#" + result.map(x => {
            const hex = parseInt(x).toString(16);
            return hex.length === 1 ? "0" + hex : hex;
        }).join("");
    }
    

    //=========================
    // 🔄 HTML Cell Insertions
    //=========================

    const initInsertHandlers = () => {
        $(".insert-html-btn").on("click", function () {
            const htmlContent = $(this).data("html");
            insertHtmlIntoSelectedCell(htmlContent);
        });

        $("#insert-custom-html-btn").on("click", function () {
            const customText = $("#custom-html-text").val().trim();
            if (!customText) {
                alert("Please enter some custom text.");
                return;
            }
            const htmlContent = `<span>${customText}</span>`;
            insertHtmlIntoSelectedCell(htmlContent);
        });
    };

    //=========================
    // 🧠 Initialization
    //=========================

    document.addEventListener("DOMContentLoaded", () => {
        renderAddonButtons();
        renderHtmlInCells();
        initInsertHandlers();
        initGeneralModalEvents();
        // initThemePaletteSelector();
        initThemePaletteSelect();

        document.addEventListener("click", () => renderHtmlInCells());
        document.addEventListener("change", () => renderHtmlInCells());
    });
})(jQuery);
