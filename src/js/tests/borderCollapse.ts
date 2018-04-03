
export function name () {
	return 'Border collapse';
}

export default function ( $ ) {
	let out = [];

	if ( ! $.fn.dataTable ) {
		return out;
	}

	$.fn.dataTable.tables( {api: true} ).iterator( 'table', function ( settings, i ) {
		if ( $(settings.nTable).css('border-collapse') === 'collapse' ) {
			out.push( {
				table: settings.nTable.id,
				level: 'error',
				msg: 'The CSS for this table has `border-collapse: collapse` which is not supported by DataTables, particularly when scrolling is enabled. A collapsed border makes the column width calculations virtually impossible for alignment between columns. Please use `border-collapse: separate` and suitable border CSS statements to achieve the same effect.'
			} );
		}
	} );

	return out;
}
