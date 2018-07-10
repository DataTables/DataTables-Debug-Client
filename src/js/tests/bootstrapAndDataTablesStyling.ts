import * as lib from '../lib';

lib.createTest('Bootstrap and DataTables styling both loaded', function($) {
	let out = [];

	if (!$.fn.dataTable) {
		return out;
	}

	$.fn.dataTable.tables({ api: true }).iterator('table', function(settings, i) {
		// Easiest way to check for this is to check the paging controls and see if they look terrible!
		let container = $(this.table().container());
		
		if ( container.hasClass( 'dt-bootstrap4' ) ) {
			let paddingLeft = $('div.paginate_button').css('padding-left');

			if ( paddingLeft && parseInt( paddingLeft, 10 ) !== 0 ) {
				out.push({
					table: settings.nTable.id,
					level: 'error',
					msg:
						'It appears that both DataTables and DataTables/Bootstrap integration styling have been loaded on your page. This will result in visual errors such as two different ordering icons in the table header and widely spaced pagination buttons. Only one of the DataTables styling packages should be loaded - in this case likely the DataTables/Bootstrap integration. Use <a href="https://datatables.net/download">the download builder</a> to ensure that you get the files you need.'
				});
			}
		}
	});

	return out;
});
