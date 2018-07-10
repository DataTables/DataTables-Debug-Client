// Based on https://www.datatables.net/forums/discussion/42957/rowreorder-editor-don-t-send-post-on-drop#latest
import * as lib from '../lib';

lib.createTest('Row Id is available on table rows with RowReorder', function($) {
	let out = [];

	if (!$.fn.dataTable.RowReorder) {
		return out;
	}

	$.fn.dataTable.tables({ api: true }).iterator('table', function(settings, i) {
		let api = new $.fn.dataTable.Api(settings);

		if (api.rows().count() === 0) {
			return out;
		}

		if (settings.rowreorder && !api.row(0).id()) {
			out.push({
				table: settings.nTable.id,
				level: 'error',
				msg:
					"RowReorder is enabled on this table, but there are no row id's. The row id is used to be able to uniquely identify each row, which is particularly important when submitting the row change via Editor. Include a `DT_RowId` property in the row data objects, or use the `rowId` initialisation property to tell DataTables where to find the row id."
			});
		}
	});

	return out;
});
