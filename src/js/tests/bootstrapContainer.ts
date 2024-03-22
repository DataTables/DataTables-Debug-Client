import * as lib from '../lib';

lib.createTest('Bootstrap tables should be in a container', function(DataTable, $) {
	let out = [];

	DataTable.tables({ api: true }).iterator('table', function(settings, i) {
		// Easiest way to check for this is to check the paging controls and see if they look terrible!
		let container = $(this.table().container());
		
		if ( container.hasClass( 'dt-bootstrap4' ) ) {
			let parents = $(this.table().node()).parents();

			if ( parents.filter('div.container').length === 0 && parents.filter('div.container-fluid').length == 0 ){
				out.push({
					table: settings.nTable.id,
					level: 'warning',
					msg:
						'Your table is not inside a <a href="https://getbootstrap.com/docs/4.0/layout/overview/">`container` or `container-fluid` element</a>. This can cause the table to be misaligned due to the use of negative margins on the column layout used by DataTables for Bootstrap. Typically you should include a container element near the top level of your HTML.'
				});
			}
		}
	});

	return out;
});
