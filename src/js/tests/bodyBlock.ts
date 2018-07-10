// Test based on https://www.datatables.net/forums/discussion/48025/responsive-plugin-not-working#latest
import * as lib from '../lib';

lib.createTest('display: block on body', function($) {
	let out = [];

	if ($('body').css('display') == 'table' && $('body').css('table-layout') != 'fixed') {
		out.push({
			table: '-',
			level: 'error',
			msg:
				'Your `body` element has `display:table`, but the `table-layout` property is not set to `fixed`. This can cause problems with the width of the body tag. It is recommend you set the table-layout to be fixed with a width of 100%.'
		});
	}

	return out;
});
