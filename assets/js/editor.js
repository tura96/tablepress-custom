(function (wp) {
	const { createElement: el, Fragment, useEffect, useState } = wp.element;
	const { PanelBody, RadioControl } = wp.components;
	const { addFilter } = wp.hooks;

	const CustomRadioField = (props) => {
		const { tableOptions, updateTableOptions } = props;

		const currentValue = tableOptions?.theme_palette || '';

		const [value, setValue] = useState(currentValue);

		useEffect(() => {
			updateTableOptions({ theme_palette: value });
		}, [value]);

		return el(
			PanelBody,
			{ title: 'Theme Palette Selector', initialOpen: true },
			el(RadioControl, {
				label: 'Choose a theme palette:',
				selected: value,
				options: [
					{ value: '', label: 'Neutral' },
					{ value: 'primary-mode', label: 'Primary' },
					{ value: 'secondary1-mode', label: 'Secondary 1' },
					{ value: 'secondary2-mode', label: 'Secondary 2' },
					{ value: 'secondary3-mode', label: 'Secondary 3' },
				],
				onChange: (val) => setValue(val),
			}),
			el(
				'div',
				{ className: 'theme-palette-image-preview' },
				[
					el(
						'div',
						{
							key: 'neutral',
							className: 'neutral theme-palette' + (value === '' ? ' active' : ''),
						},
						[
							el('span', {}, 'Neutral'),
							el('img', {
								src: `/wp-content/plugins/tablepress-custom/assets/image/palette/neutral.png`,
							}),
						]
					),
					el(
						'div',
						{
							key: 'primary',
							className: 'primary theme-palette' + (value === 'primary-mode' ? ' active' : ''),
						},
						[
							el('span', {}, 'Primary'),
							el('img', {
								src: `/wp-content/plugins/tablepress-custom/assets/image/palette/primary.png`,
							}),
						]
					),
					el(
						'div',
						{
							key: 'secondary-1',
							className: 'secondary-1 theme-palette' + (value === 'secondary1-mode' ? ' active' : ''),
						},
						[
							el('span', {}, 'Secondary 1'),
							el('img', {
								src: `/wp-content/plugins/tablepress-custom/assets/image/palette/secondary-1.png`,
							}),
						]
					),
					el(
						'div',
						{
							key: 'secondary-2',
							className: 'secondary-2 theme-palette' + (value === 'secondary2-mode' ? ' active' : ''),
						},
						[
							el('span', {}, 'Secondary 2'),
							el('img', {
								src: `/wp-content/plugins/tablepress-custom/assets/image/palette/secondary-2.png`,
							}),
						]
					),
					el(
						'div',
						{
							key: 'secondary-3',
							className: 'secondary-3 theme-palette' + (value === 'secondary3-mode' ? ' active' : ''),
						},
						[
							el('span', {}, 'Secondary 3'),
							el('img', {
								src: `/wp-content/plugins/tablepress-custom/assets/image/palette/secondary-3.png`,
							}),
						]
					),
				]
			)
		);
	};

	addFilter(
		'tablepress.editScreenPortals',
		'tpr/custom-radio',
		(OriginalComponent) => (props) => {
			return el(
				Fragment,
				null,
				el(OriginalComponent, props),
				el(CustomRadioField, props)
			);
		}
	);
})(window.wp);