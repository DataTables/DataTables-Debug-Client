// No way to just import everything with a single statement I'm afraid,
// every test needs to be added here and in the `tests` variable.
import * as serverSidePaging from './tests/serverSidePaging';

let tests = [
	serverSidePaging
];

export default function ( panel, $ ) {
	let info = $(' <span class="datatables-debug--common-run>Gathering information</span>');

	panel
		.html( 'Running tests...' )
		.append( info );

	let results = [];

	for ( let i=0, ien=tests.length ; i<ien ; i++ ) {
		info.html( 'Test '+(i+1)+'/'+tests.length + ': '+ tests[i].name() );
		results = results.concat( tests[i].default( $ ) );
	}

	if ( results.length === 0 ) {
		panel.html( tests.length +' tests complete. No failures or warnings found!<br><br>If you are having problems with your DataTables, please upload a data profile using the <i>Upload</i> option below, and post a support request in <a href="https://datatables.net/forums">DataTables forums</a>, with a link to a page showing the issue so we can help to debug and investigate the issue.');
	}
	else {
		panel.html( tests.length +' tests complete. '+ results.length +' problem'+(results.length===1?' was':'s were')+' found:' );

		let table = $('<div/>')
			.addClass( 'datatables-debug--common-table' )
			.appendTo( panel );

		table.append( $('<div/>')
			.addClass( 'datatables-debug--common-item' )
			.addClass( '__title' )
			.append( $('<span/>')
				.addClass( 'datatables-debug--common-table' )
				.html( 'Table ID' )
			)
			.append( $('<span/>')
				.addClass( 'datatables-debug--common-message' )
				.html( 'Problem description' )
			)
		);

		for ( let i=0, ien=results.length ; i<ien ; i++ ) {
			table.append( $('<div/>')
				.addClass( 'datatables-debug--common-item' )
				.addClass( '__'+results[i].level )
				.append( $('<span/>')
					.addClass( 'datatables-debug--common-name' )
					.html( '#'+results[i].table )
				)
				.append( $('<span/>')
					.addClass( 'datatables-debug--common-message' )
					.html( results[i].msg )
				)
			);
		}
	}
}
