import * as lib from '../lib';

lib.createTest('FixedHeader without user-scalable', function($) {
	let out = [];
	let userScalable = true;

	$('meta').each(function() {
		let val = $(this).attr('content');

		if (val && val.match(/user\-scalable=no/)) {
			userScalable = false;
		}
	});

	if ($.fn.dataTable.FixedHeader && userScalable) {
		out.push({
			table: '-',
			level: 'warning',
			msg:
				'Using FixedHeader without setting a `meta` tag to "user-scalable=no" will mean that FixedHeader does not work on Android devices as `position:fixed` is disabled in the browser under those conditions. Either add a suitable meta tag, or be aware that FixedHeader will not operate for Android users.'
		});
	}

	return out;
});
