/**
 * TablePress Meta Extension: Admin JavaScript
 *
 * Adds a Theme Palette dropdown to the TablePress Edit screen and integrates with the save action.
 *
 * @package TablePress Meta Extension
 * @author Your Name
 * @since 1.0.0
 */

/* global tablepressMetaExtension, wp */

( function( wp ) {
    const { SelectControl } = wp.components;
    const { __ } = wp.i18n;
    const { addFilter } = wp.hooks;

    // Add Theme Palette dropdown to the Edit screen options section
    addFilter( 'tablepress.editScreenOptions', 'tablepress-meta-extension', function( Options, props ) {
        return function( newProps ) {
            return (
                <>
                    <Options { ...newProps } />
                    <SelectControl
                        label={ tablepressMetaExtension.text.themePaletteLabel }
                        value={ newProps.tableMeta._theme_palette }
                        options={ [
                            { label: tablepressMetaExtension.text.default, value: 'default' },
                            { label: tablepressMetaExtension.text.dark, value: 'dark' },
                            { label: tablepressMetaExtension.text.light, value: 'light' },
                        ] }
                        onChange={ ( value ) => newProps.updateTableMeta( { ...newProps.tableMeta, _theme_palette: value } ) }
                    />
                </>
            );
        };
    } );

    // Modify the saveTableChanges function to include _theme_palette
    addFilter( 'tablepress.saveTableChangesRequestData', 'tablepress-meta-extension', function( requestData, props ) {
        requestData.tablepress.meta = JSON.stringify( {
            _theme_palette: props.tableMeta._theme_palette || 'default',
        } );
        return requestData;
    } );

} )( wp );