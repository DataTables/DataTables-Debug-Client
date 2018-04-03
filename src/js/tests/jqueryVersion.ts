import {versionCompare} from '../lib';

export function name () {
	return 'jQuery version';
}

export default function ( $ ) {
	let out = [];

	if ( versionCompare( '1.7.0', $.fn.jquery ) === true ) {
		out.push( {
			table: '-',
			level: 'error',
			msg: 'You are using an old version of jQuery ('+$.fn.jquery+'). DataTables and extensions require at least jQuery 1.7.'
		} );
	}

	return out;
}
