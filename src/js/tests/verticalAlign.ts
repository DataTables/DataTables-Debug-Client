
export function name () {
	return 'vertial-align in table header';
}

export default function ( $ ) {
	let out = [];

	if ( ! $.fn.dataTable ) {
		return out;
	}

	$.fn.dataTable.tables( {api: true} ).iterator( 'table', function ( settings, i ) {
		var inst = new $.fn.dataTable.Api( settings );
		var tableFound = false;

		inst.columns().every( function () {
			var vertAlign = $(this.header()).css('vertical-align');

			if ( tableFound ) {
				return;
			}

			if ( vertAlign !== 'middle' && vertAlign !== 'top' && vertAlign !== 'bottom' ) {
				out.push( {
					table: settings.nTable.id,
					level: 'error',
					msg: '`vertical-align` for the table header cells is not top, middle or bottom. This can cause rendering errors in the table header.'
				} );

				tableFound = true;
			}
		} );
	} );

	return out;
}
