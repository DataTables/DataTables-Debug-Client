import {scrollingEnabled} from '../lib';
import * as lib from '../lib';

lib.createTest(
	'Misaligned header and columns on a scrolling table',
	function ($) {
		let out = [];

		if ( ! $.fn.dataTable ) {
			return out;
		}

		$.fn.dataTable.tables( {api: true} ).iterator( 'table', function ( settings, i ) {
			if ( ! scrollingEnabled( settings ) ) {
				return out;
			}

			if ( ! $(settings.nTable).is(':visible') ) {
				return out;
			}

			let bodyWidth = $('table', settings.nScrollBody).width();
			let headWidth = $('table', settings.nScrollHead).width();

			if ( Math.abs( bodyWidth - headWidth ) > 3 ) {
				out.push( {
					table: settings.nTable.id,
					level: 'error',
					msg: 'The table has scrolling enabled and the header and body parts of the table are misaligned. This is typically cased by the table being initialised when it is hidden. In this case, the table needs to have the `<a href="https://datatables.net/reference/api/columns.adjust()">columns.adjust()</a>` method called on it when the table is made visible. <a href="https://datatables.net/examples/api/tabs_and_scrolling.html">This example</a> shows how that can be done with Bootstrap tabs.'
				} );
			}
		} );

		return out;
	}
);
