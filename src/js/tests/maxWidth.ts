
// Based on https://datatables.net/forums/discussion/comment/125984/#Comment_125984
export function name () {
	return 'Max-width';
}

export default function ( $ ) {
	let out = [];

	if ( ! $.fn.dataTable ) {
		return out;
	}

	$.fn.dataTable.tables( {api: true} ).iterator( 'table', function ( settings, i ) {
		if ( $(settings.nTable).css('max-width') != 'none' ) {
			out.push( {
				table: settings.nTable.id,
				level: 'error',
				msg: 'This table has `max-width` applied to its CSS which can cause issues, particularly in Safari. Setting max-width will not allow the table to expand beyond the value given, meaning that column alignment and scrolling can be effected.'
			} );
		}
	} );

	return out;
}
