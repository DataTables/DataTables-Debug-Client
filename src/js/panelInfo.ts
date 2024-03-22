export default function(panel, DataTable, $) {
	let tables = DataTable.settings;
	let plural = tables.length === 1 ? '1 table' : tables.length + ' tables';

	panel.html(`Information about ${plural} available`);

	for (let i = 0, ien = tables.length; i < ien; i++) {
		let table = tables[i];
		let info = $(`<table class="datatables-debug--info-table" />`);

		let dataSource = 'DOM';
		if (table.sAjaxSource !== null || table.ajax !== null) {
			dataSource = 'Ajax';
		} else if (table.oInit && table.oInit.aaData) {
			dataSource = 'Javascript';
		}

		let processingMode = table.oFeatures.bServerSide ? 'Server-side' : 'Client-side';

		info.append($(`<tr><td>Data source:</td><td>${dataSource}</td></tr>`));
		info.append($(`<tr><td>Processing mode:</td><td>${processingMode}</td></tr>`));
		info.append($(`<tr><td>Draws:</td><td>${table.iDraw}</td></tr>`));
		info.append($(`<tr><td>Columns:</td><td>${table.aoColumns.length}</td></tr>`));
		info.append($(`<tr><td>Rows - total:</td><td>${table.aoData.length}</td></tr>`));
		info.append($(`<tr><td>Rows - after search:</td><td>${table.aiDisplay.length}</td></tr>`));
		info.append($(`<tr><td>Display start:</td><td>${table._iDisplayStart}</td></tr>`));
		info.append($(`<tr><td>Display length:</td><td>${table._iDisplayLength}</td></tr>`));

		panel.append(`<h3 class="datatables-debug--info-title">#${table.nTable.id}</h3>`).append(info);
	}
}
