import { versionCompare } from '../lib';
import * as lib from '../lib';

lib.createTest('jQuery version', function(DataTable, $) {
	let out = [];

	if (versionCompare('3', $.fn.jquery) === true) {
		out.push({
			table: '-',
			level: 'error',
			msg:
				'You are using an old version of jQuery (' +
				$.fn.jquery +
				'). We suggest you update to at least jQuery 3.'
		});
	}

	return out;
});
