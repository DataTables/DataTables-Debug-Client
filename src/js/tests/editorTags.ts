import * as lib from '../lib';

lib.createTest('Unknown Editor template tags', function(DataTable, $) {
	let out = [];

	$('editor-field').each(function() {
		if (
			!$(this)
				.next()
				.hasClass('DTE_Field')
		) {
			out.push({
				table: '-',
				level: 'config',
				msg:
					'The `&lt;editor-field&gt;` tag for `' +
					$(this).attr('name') +
					'` has not been replaced by a field. This is caused by the name attribute for the tag not exactly matching the `field.name` value for a field in the Editor instance. Ensure that there is a field for this tag, and that there are no typos in the names. Case must match as well as any leading object/table names.'
			});
		}
	});

	$('[data-editor-template]').each(function() {
		if ($(this).is(':empty')) {
			out.push({
				table: '-',
				level: 'config',
				msg:
					'The field `' +
					$(this).attr('data-editor-template') +
					'` does not have a field configured for display. This is caused by the name attribute for the tag not exactly matching the `field.name` value for a field in the Editor instance. Ensure that there is a field for this tag, and that there are no typos in the names. Case must match as well as any leading object/table names.'
			});
		}
	});

	return out;
});
