/*!
 * @summary   DataTables debug client-side script
 * @copyright Copyright 2018 SpryMedia Ltd.
 * @license   MIT https://datatables.net/license/mit
 */

import panelCommon from './panelCommon';
import panelUpload from './panelUpload';
import panelVersions from './panelVersions';
import settings from './settings';

(function(window, document, $, undefined) {
	function loadFile(type: string, path: string): void {
		var n, img;

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

	let panels = {
		common: panelCommon,
		upload: panelUpload,
		versions: panelVersions
	};

	if ($ === undefined) {
		alert('DataTables debugger: jQuery not loaded on this page, therefore no ' + 'DataTables :-(');
		return;
	}

	// Load CSS
	loadFile('css', settings.debugRoot + '/css/debug.css');

	// Create a three panel view:
	// - Version check (loads a JSON feed with current JSON information)
	// - Run common issue checks (loads an extra script with the required tests)
	// - Upload debug information
	let debug = $('<div/>')
		.addClass('datatables-debug')
		.css('top', 30 + $(window).scrollTop())
		.append(
			$('<div/>')
				.addClass('datatables-debug--title')
				.html('DataTables debugger')
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
		)
		.append(
			$('<div>&times;</div>')
				.addClass('datatables-debug--close')
				.on('click', function() {
					debug.remove();
				})
		)
		.appendTo('body');

	draggable($('div.datatables-debug--title', debug), debug);

	debug.on('click', 'div.datatables-debug--button', function() {
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

			panels[type](panel.children(), $);

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
})(window, document, (<any>window).jQuery);
