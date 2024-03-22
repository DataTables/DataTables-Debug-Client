import * as lib from '../lib';

lib.createTest('Legacy DataTables', function(DataTable, $) {
	let out = [];

	if (! $.fn.dataTable.versionCheck('2')) {
		out.push({
			table: null,
			level: 'error',
			msg:
				'DataTables v1 is no longer supported. Please update to the latest version of DataTables, which available <a href="https://datatables.net/download">on the DataTables download page</a>.'
		});
	}

	return out;
});