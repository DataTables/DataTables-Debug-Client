import * as lib from '../lib';

lib.createTest('Border collapse', function(DataTable, $) {
	let out = [];

	// Border collapse is fine in DT2
	if (DataTable.versionCheck('2')) {
		return out;
	}

	DataTable.tables({ api: true }).iterator('table', function(settings, i) {
		if ($(settings.nTable).css('border-collapse') === 'collapse') {
			out.push({
				table: settings.nTable.id,
				level: 'error',
				msg:
					'The CSS for this table has `border-collapse: collapse` which is not supported by DataTables v1, particularly when scrolling is enabled. A collapsed border makes the column width calculations virtually impossible for alignment between columns. Please use `border-collapse: separate` and suitable border CSS statements to achieve the same effect. Or update to DataTables 2 which does support collapsed borders.'
			});
		}
	});

	return out;
});