import * as lib from '../lib';

lib.createTest('`dom` option with Bootstrap', function($) {
	let out = [];

	if (!$.fn.dataTable) {
		return out;
	}

	$.fn.dataTable.tables({ api: true }).iterator('table', function(settings, i) {
		let dom = settings.sDom;
		let bootstrapTable =
			$(settings.nTable).hasClass('bootstrap') || $(settings.nTable).hasClass('bootstrap4');

		if (dom.indexOf('<') === -1 && bootstrapTable) {
			out.push({
				table: settings.nTable.id,
				level: 'error',
				msg:
					'Your `dom` option appears to be too simple for Bootstrap integration with DataTables! This will result in the table\'s layout looking incorrect. The most common cause for this is using Buttons with a Bootstrap DataTable and using the `B` option in `dom`. <a href="https://datatables.net/extensions/buttons/examples/styling/bootstrap4.html">Please see this example</a> to see how to use Buttons with a Bootstrap DataTable'
			});
		}
	});

	return out;
});
