import * as lib from '../lib';

lib.createTest('`dom` option with DataTables 2', function(DataTable, $) {
	let out = [];

	if (DataTable.version.charAt(0) !== '1') {
		DataTable.tables({ api: true }).iterator('table', function(settings, i) {
			let dom = settings.sDom;

			if (dom) {
				out.push({
					table: settings.nTable.id,
					level: 'error',
					msg: 'You are using the <code>dom</code> option with DataTables 2 (or newer). While this is supported, DataTables doesn\'t ship with CSS for this option and you are strongly encouraged to update <a href="https://datatables.net/upgrade/2#dom-property">to the new layout property</a>.'
				});
			}
		});
	}

	return out;
});
