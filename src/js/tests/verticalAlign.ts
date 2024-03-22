// Based on https://datatables.net/forums/discussion/comment/125984/#Comment_125984
import * as lib from '../lib';

lib.createTest('vertical-align in table header', function(DataTable, $) {
	let out = [];

	DataTable.tables({ api: true }).iterator('table', function(settings, i) {
		var inst = new DataTable.Api(settings);
		var tableFound = false;

		inst.columns().every(function() {
			var vertAlign = $(this.header()).css('vertical-align');

			if (tableFound) {
				return;
			}

			if (
				vertAlign !== '' && // when removed from the document
				vertAlign !== 'middle' &&
				vertAlign !== 'top' &&
				vertAlign !== 'bottom'
			) {
				out.push({
					table: settings.nTable.id,
					level: 'error',
					msg:
						'`vertical-align` for the table header cells is not top, middle or bottom. This can cause rendering errors in the table header.'
				});

				tableFound = true;
			}
		});
	});

	return out;
});
