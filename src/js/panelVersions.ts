import {versionCompare} from './lib';

export default function ( panel, $ ) {
	panel.html( 'Loading...' );

	ajaxLoad( $, panel, function (versions) {
		display( panel, $, versions )
	} );
}

function display ( panel, $, versions ) {
	panel.empty();
	panel.append( $('<div/>')
		.addClass( 'datatables-debug--versions-title' )
		.html( 'Installed Libraries' )
	);

	for ( let i=0, ien=versions.length ; i<ien ; i++ ) {
		if ( versions[i].version !== null ) {
			displayItem( panel, $, versions[i] );
		}
	}

	panel.append( $('<div/>')
		.addClass( 'datatables-debug--versions-title' )
		.html( 'Not Installed Libraries' )
	);

	let count = 0;
	for ( let i=0, ien=versions.length ; i<ien ; i++ ) {
		if ( versions[i].version === null ) {
			displayItem( panel, $, versions[i] );
			count++;
		}
	}

	if ( count === 0 ) {

	}
}

function displayItem ( panel, $, item ) {
	let update = $('<span/>')
		.addClass( 'datatables-debug--versions-update' )
		.html( ' ' );
	
	if ( item.version ) {
		let toTag = versionCompare( item.version, item.tag );
		let toNightly = versionCompare( item.tag, item.nightly );

		if ( toTag === false ) {
			update.html( 'New version available '+item.version );
			update.addClass( '__new_version' );
		}
		else if ( toTag === null && toNightly === null ) {
			update.html( 'Up to date' );
			update.addClass( '__up_to_date' );
		}
		else if ( toTag === null && toNightly === false ) {
			update.html( 'Nightly available '+item.nightly );
			update.addClass( '__nightly_available' );
		}
		// else if ( toTag === null && toNightly === true ) -- Tag ahead of release!
		else if ( toTag === true ) { // Version ahead of the tag
			update.html( 'Using nightly' );
			update.addClass( '__nightly' );
		}
	}
	else {
		update.addClass( '__empty' );
	}

	panel.append( $('<div/>')
		.addClass( 'datatables-debug--versions-item' )
		.append( $('<span/>')
			.addClass( 'datatables-debug--versions-name' )
			.html( item.name )
		)
		.append( update )
		.append( $('<span/>')
			.addClass( 'datatables-debug--versions-version' )
			.html( item.version || item.tag )
		)
	);
}


function ajaxLoad( $, panel, callback ) {
	$.ajax( {
		url: 'https://api.datatables.net/versions/feed',
		dataType: 'json',
		success: function ( json ) {
			let localVersions = [];
			let software = [
				'AutoFill', 'Buttons', 'ColReorder', 'Editor',
				'FixedColumns', 'FixedHeader', 'KeyTable', 'Responsive',
				'RowGroup', 'RowReorder', 'Scroller', 'Select'
			];

				localVersions.push( {
				name: 'DataTables',
				version: $.fn.dataTable ?
					$.fn.dataTable.version :
					null,
				tag: json.DataTables.release.version,
				nightly: json.DataTables.nightly.version
			} );

			for ( let i=0, ien=software.length ; i<ien ; i++ ) {
				let name = software[i];
				let hostName = name === 'Select' ?
					'select' :
					name;
				
				localVersions.push( {
					name: name,
					version: $.fn.dataTable && $.fn.dataTable[hostName] ?
						$.fn.dataTable[hostName].version :
						null,
					tag: json[name].release.version,
					nightly: json[name].nightly.version
				} );
			}

			callback( localVersions );
		}
	} );
}
