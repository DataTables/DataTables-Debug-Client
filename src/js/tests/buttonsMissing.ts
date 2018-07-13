import * as lib from '../lib';

lib.createTest('Buttons config options, but buttons not loaded', function($) {
	let out = [];

	if (!$.fn.dataTable) {
		return out;
	}

	$.fn.dataTable.tables({ api: true }).iterator('table', function(settings, i) {
		var opts = this.init();

		if ( opts.buttons && ! $.fn.dataTable.Buttons ) {
			out.push({
				table: settings.nTable.id,
				level: 'error',
				msg:
					'The `buttons` configuration option is defined, but the Buttons library is not available on the page. If you want to make use of Buttons (including the export buttons), you need to include the Buttons extension for DataTables. Use the <a href="https://datatables.net/download">download builder</a> to ensure that you get all the files you need.'
			});
		}
	});

	return out;
});
