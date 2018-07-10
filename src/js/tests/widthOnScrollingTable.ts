import {scrollingEnabled} from '../lib';
import * as lib from '../lib';

lib.createTest(
	'Scrolling tables should have width:100%',
	function ($) {
		let out = [];

		if ( ! $.fn.dataTable ) {
			return out;
		}

		$.fn.dataTable.tables( {api: true} ).iterator( 'table', function ( settings, i ) {
			if ( ! scrollingEnabled( settings ) ) {
				return out;
			}

			if ( $(settings.nTable).attr('width') != '100%' && $(settings.nTable).css('width') != '100%' ) {
				out.push( {
					table: settings.nTable.id,
					level: 'error',
					msg: 'Tables which have scrolling enabled should have their width set to be 100% to allow dynamic resizing of the table. This should be done with a `width="100%"` or `style="width:100%"` attribute. Using `width:100%` in your CSS is unfortunately not enough as it is very difficult to read a percentage value from stylesheets!'
				} );
			}
		} );

		return out;
	}
);
