
// Check to see if server-side processing is enabled when paging is disabled
export function name () {
	return 'Server-side processing and paging';
}

export default function ( $ ) {
	let out = [];

	if ( ! $.fn.dataTable ) {
		return out;
	}

	$.fn.dataTable.tables( {api: true} ).iterator( 'table', function ( settings, i ) {
		//if ( settings.oFeatures.bServerSide && ! settings.oFeatures.bPaginate ) {
			out.push( {
				table: settings.nTable.id,
				level: 'config',
				msg: 'This table has server-side processing enabled, but paging disabled. In this configuration, the full data set will be transferred from the server on every draw request - the result is that you will get zero benefit from server-side processing and just introduce network latency into your application. Enable paging when using server-side processing.'
			} );
		//}
	} );

	return out;
}
