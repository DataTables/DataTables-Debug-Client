import { versionCompare } from '../lib';
import * as lib from '../lib';

lib.createTest('jQuery version', function($) {
	let out = [];

	if (versionCompare('1.7.0', $.fn.jquery) === true) {
		out.push({
			table: '-',
			level: 'error',
			msg:
				'You are using an old version of jQuery (' +
				$.fn.jquery +
				'). DataTables and extensions require at least jQuery 1.7.'
		});
	}

	return out;
});
