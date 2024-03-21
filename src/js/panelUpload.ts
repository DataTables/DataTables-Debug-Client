import { stringify as jsonStringify } from './json';
declare var DataTable;

export default function(panel, $) {
	panel.html(
		'It can often greatly assist in debugging a table if we can see the configuration and data in the table. This feature of the debugger will read your local DataTables configuration and upload it to <a href="https://debug.datatables.net">debug.datatables.net</a> for inspection.<br><br>Important: The data uploaded to the server can only be viewed by SpryMedia employees will be automatically deleted after two weeks. The data will <i>never</i> be sold or otherwise published. It is used for debugging any issues you are experiencing with DataTables only.'
	);

	panel.append(
		$('<button class="datatables-debug--upload-button">Upload configuration</button>').on(
			'click',
			function() {
				$(this).replaceWith('<div class="datatables-debug--upload-ready">Gathering data</div>');

				setTimeout(function() {
					gatherData($);
				}, 200);
			}
		)
	);
}

function gatherData($) {
	let data = {
		modules: {} as any,
		ext: {} as any,
		tables: {} as any,
		tablesDisplayData: [],
		tablesDisplayExtra: []
	};

	// DataTables information (version)
	data.modules.datatables = {
		version: DataTable.version,
		apiIndex: 0,
		errorMode: DataTable.errMode,
		builder: !DataTable.ext ? false : DataTable.ext.builder || false
	};

	// Extras
	extraGeneric(data, 'AutoFill', DataTable);
	extraGeneric(data, 'Buttons', DataTable);
	extraGeneric(data, 'ColReorder', DataTable);
	extraGeneric(data, 'Editor', DataTable);
	extraGeneric(data, 'FixedColumns', DataTable);
	extraGeneric(data, 'FixedHeader', DataTable);
	extraGeneric(data, 'KeyTable', DataTable);
	extraGeneric(data, 'Responsive', DataTable);
	extraGeneric(data, 'RowReorder', DataTable);
	extraGeneric(data, 'Scroller', DataTable);
	extraGeneric(data, 'SearchBuilder', DataTable);
	extraGeneric(data, 'SearchPanes', DataTable);
	extraGeneric(data, 'StateRestore', DataTable);
	extraGeneric(data, 'select', DataTable);

	// Global DataTable options
	let dtExt = DataTable.ext;

	data.ext.filtering = dtExt.afnFiltering;
	data.ext.search = dtExt.ofnSearch;
	data.ext.sorting = dtExt.oSort;
	data.ext.sortData = dtExt.afnSortData;
	data.ext.types = dtExt.aTypes;
	data.ext.features = dtExt.aoFeatures;
	data.ext.paging = dtExt.oPagination;
	data.ext.api = {};

	// Can't just copy oApi - don't want the private functions
	for (let key in dtExt.oApi) {
		if (dtExt.oApi.hasOwnProperty(key)) {
			if (key.substr(0, 1) !== '_') {
				data.ext.api[key] = dtExt.oApi[key];
			}
		}
	}

	// Tables
	data.tables = DataTable.settings;

	// Current display of the table (with filtering information)
	data.tablesDisplayData = [];
	data.tablesDisplayExtra = [];

	for (let i = 0, ien = DataTable.settings.length; i < ien; i++) {
		let table = DataTable.settings[i];
		let rowCount = table.aoData.length;
		let displayMA = table.aiDisplayMaster;
		let displayA = table.aiDisplay;
		let tableData = [];
		let extra = [];
		let api = new DataTable.Api(table);

		for (let j = 0, jen = rowCount; j < jen; j++) {
			let row = [];

			row = api.row(displayMA[j]).data();
			tableData.push(row);
			extra.push({
				dataIndex: displayMA[j],
				removedByFiltering: $.inArray(displayMA[j], displayA) === -1 ? true : false
			});
		}

		data.tablesDisplayData.push(tableData);
		data.tablesDisplayExtra.push(extra);
	}

	$('div.datatables-debug--upload-ready').html('Encoding for upload');

	setTimeout(function() {
		stringify($, data);
	}, 200);
}

function stringify($, data) {
	let str;
	let json;

	str = jsonStringify(data);
	try {
	} catch (e) {
		alert(
			'An error occurred, likely due to a circular reference. Please report to support with a link.'
		);
		return;
	}

	// The string created has all of the DataTables code in it, which we really don't
	// want... So parse the JSON and then delete what we don't want. This allows us to
	// remove stuff without interfering with what is on the page
	try {
		json = eval('(' + str + ')');
	} catch (e) {
		alert('A JSON parsing error occurred.<br>Please report to support with a link.');
		return;
	}

	for (let i = 0, ien = json.tables.length; i < ien; i++) {
		delete json.tables[i].oInstance;
		delete json.tables[i].oApi;
	}

	str = jsonStringify(json);

	$('div.datatables-debug--upload-ready').html('Uploading...');

	setTimeout(function() {
		upload($, str);
	}, 200);
}

function upload($, dataStr) {
	$.ajax({
		url: 'https://debug.datatables.net/submit.php',
		data: {
			data: dataStr,
			unique: new Date().getTime(),
			nextGeneration: 2
		},
		type: 'POST',
		success: function(response) {
			let a = response.split(' - ');
			let url = a[1];

			if (a[0] === 'done') {
				$('div.datatables-debug--upload-ready').html(
					'Upload complete!<br>'+
					'Your debug code is: <strong>' + url + '</strong></a><br>' +
					'Please include this in any support requests.'
				);
			} else {
				$('div.datatables-debug--upload-ready').html('An error occurred.');
				$('div.datatables-debug--upload-ready').after(url);
			}
		}
	});
}

function extraGeneric(data, name, dt) {
	let extn;

	if (dt[name]) {
		extn = dt[name];
	} else if (window[name]) {
		// Legacy
		extn = window[name];
	}

	if (extn) {
		data.modules[name.toLowerCase()] = {
			version: extn.version || extn.VERSION || 'Unknown' // (upper case is legacy)
		};
	}
}
