/*!
 * @summary   DataTables debug client-side script
 * @copyright Copyright 2018 SpryMedia Ltd.
 * @license   MIT https://datatables.net/license/mit
 */

import panelCommon from './panelCommon';
import panelInfo from './panelInfo';
import panelUpload from './panelUpload';
import panelVersions from './panelVersions';
import settings from './settings';

(function(window, document) {
	// Load CSS
	loadFile('css', settings.debugRoot + '/bookmarklet/debug.css?4');

	// Set up the debug panel
	let debug = document.createElement('div');
	debug.className = 'datatables-debug';
	debug.style.top = (30 + window.scrollY) + 'px';
	document.body.append(debug);

	let title = document.createElement('div');
	title.textContent = 'DataTables debugger';
	title.className = 'datatables-debug--title';
	debug.appendChild(title);

	let close = document.createElement('div');
	close.innerHTML = '&times;'
	close.className = 'datatables-debug--close';
	close.addEventListener('click', function () {
		debug.remove();
	});
	debug.appendChild(close);

	let DataTable = (window as any).DataTable;
	let $;
	
	if (DataTable && DataTable.$) {
		$ = DataTable.$;
	}
	else if ((window as any).jQuery) {
		$ = (window as any).jQuery;
	}

	// Sanity checks
	if (! DataTable && $ && $.fn.dataTable) {
		// When there is no global DataTable variable, which was introduced in 1.11, but DataTables is
		// available on the jQuery object.
		sanityError(
			'Legacy DataTables',
			'It looks like you are using a <em>really</em> old version of DataTables (' + $.fn.dataTable.ext.sVersion + '). This version is long since End Of Life and no longer supported. You are strongly encouraged <a href="https://datatables.net/download">to update to the latest version of DataTables</a>. The DataTables debugger does not provide any further functionality for legacy versions of DataTables.',
			debug
		);
		return;
	}

	if (! DataTable) {
		// No global var
		sanityError(
			'DataTables library not found!',
			'There is no global <code>DataTable</code> variable for the debugger to operate on. This can happen because DataTables is not loaded, or you are using a loader which does not expose DataTables globally by default (e.g. ES Modules).<br><br>If you are loading DataTables, add <code>window.DataTable = DataTable;</code> after your load of DataTables to make it visible to the debugger.',
			debug
		);
		return;
	}

	if (! $) {
		// No jQuery attached to DataTables or available globally
		sanityError(
			'jQuery library not found',
			'DataTables uses jQuery as a dependency and it was not found. Please ensure that jQuery is available for DataTables on your page.',
			debug
		);
		return;
	}

	let panels = {
		info: panelInfo,
		common: panelCommon,
		upload: panelUpload,
		versions: panelVersions
	};

	// Create a three panel view:
	// - Version check (loads a JSON feed with current JSON information)
	// - Run common issue checks (loads an extra script with the required tests)
	// - Upload debug information
	$(debug)
		.append(
			$('<div/>')
				.addClass('datatables-debug--button')
				.data('panel', 'info')
				.html(
					'Table information' +
						'<div class="datatables-debug--button-info">Summary information about the DataTables on this page.</div>'
				)
		)
		.append(
			$('<div/>')
				.addClass('datatables-debug--button')
				.data('panel', 'versions')
				.html(
					'Version check' +
						'<div class="datatables-debug--button-info">Check to see if your page is running the latest DataTables software.</div>'
				)
		)
		.append(
			$('<div/>')
				.addClass('datatables-debug--button')
				.data('panel', 'common')
				.html(
					'Check for common issues' +
						'<div class="datatables-debug--button-info">Run automated tests to check for common and previously reported issues.</div>'
				)
		)
		.append(
			$('<div/>')
				.addClass('datatables-debug--button')
				.data('panel', 'upload')
				.html(
					'Upload configuration data' +
						'<div class="datatables-debug--button-info">Upload your table\'s configuration and data to allow for further analysis.</div>'
				)
		);

	draggable($('div.datatables-debug--title', debug), $(debug));

	$(debug).on('click', 'div.datatables-debug--button', function() {
		if (
			$(this)
				.next()
				.hasClass('datatables-debug--panel')
		) {
			let panel = $(this).next();
			panel.removeClass('__full');

			setTimeout(function() {
				panel.remove();
			}, 1000);
		} else {
			let type = $(this).data('panel');
			let panel = $('<div/>')
				.addClass('datatables-debug--panel')
				.append($('<div/>').addClass('datatables-debug--panel-liner'));

			panels[type](panel.children(), DataTable, $);

			panel.insertAfter(this);

			setTimeout(function() {
				panel.addClass('__full');
			}, 100);
		}
	});

	function draggable(dragHandle, dragged) {
		let initX, initY, mousePressX, mousePressY;

		dragHandle.on('mousedown', function(event) {
			initX = dragged[0].offsetLeft;
			initY = dragged[0].offsetTop;
			mousePressX = event.clientX;
			mousePressY = event.clientY;

			$(window)
				.on('mousemove', function(e) {
					dragged.css({
						left: initX + e.clientX - mousePressX,
						top: initY + e.clientY - mousePressY
					});
				})
				.on('mouseup', function() {
					$(window).off('mouseup mousemove');
				});
		});
	}

	function loadFile(type: string, path: string): void {
		var n;

		if (type == 'css') {
			n = document.createElement('link');
			n.type = 'text/css';
			n.rel = 'stylesheet';
			n.href = path;
			n.media = 'screen';
			document.getElementsByTagName('head')[0].appendChild(n);
		} else {
			n = document.createElement('script');
			n.setAttribute('language', 'JavaScript');
			n.setAttribute('src', path);
			n.setAttribute('charset', 'utf8');
			document.body.appendChild(n);
		}
	}

	/**
	 * Show an error message that is terminal
	 */
	function sanityError(title: string, message: string, host: HTMLElement) {
		let sanity = document.createElement('div');
		sanity.className = 'datatables-debug--sanity';

		let titleEl = document.createElement('div');
		titleEl.className = 'datatables-debug--sanity__title';
		titleEl.innerHTML = title;
		sanity.appendChild(titleEl);

		let messageEl = document.createElement('div');
		messageEl.className = 'datatables-debug--sanity__message';
		messageEl.innerHTML = message;
		sanity.appendChild(messageEl);

		host.appendChild(sanity);
	}
})(window, document);
