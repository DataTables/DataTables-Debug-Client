
/*
This is a modified version of json2.js (http://www.JSON.org/json2.js) which will
accept functions and handle circular references.

TODO: Update to https://www.npmjs.com/package/serially or similar. This will require
a not-insignificant update on the server-side for displaying the data, since it will
need to be decoded there.
 */



function outerHTML(node){
// if IE, Chrome take the internal method otherwise build one
return node.outerHTML || (
	function(n){
		if ( n === document ) {
			return "";
		}
		var div = document.createElement('div'), h;
		div.appendChild( n.cloneNode(true) );
		h = div.innerHTML;
		div = null;
		return h;
	})(node);
}

var _seen_objects = [];


function f(n) {
	// Format integers to have at least two digits.
	return n < 10 ? '0' + n : n;
}

if (typeof Date.prototype.toJSON !== 'function') {

	Date.prototype.toJSON = function (key) {

		return isFinite(this.valueOf())
			? this.getUTCFullYear()     + '-' +
				f(this.getUTCMonth() + 1) + '-' +
				f(this.getUTCDate())      + 'T' +
				f(this.getUTCHours())     + ':' +
				f(this.getUTCMinutes())   + ':' +
				f(this.getUTCSeconds())   + 'Z'
			: null;
	};

	(String.prototype as any).toJSON      =
		(Number.prototype as any).toJSON  =
		(Boolean.prototype as any).toJSON = function (key) {
			return this.valueOf();
		};
}

var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
	gap,
	indent,
	meta = {    // table of character substitutions
		'\b': '\\b',
		'\t': '\\t',
		'\n': '\\n',
		'\f': '\\f',
		'\r': '\\r',
		'"' : '\\"',
		'\\': '\\\\'
	},
	rep;


function quote(string) {
	escapable.lastIndex = 0;
	return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
		var c = meta[a];
		return typeof c === 'string'
			? c
			: '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
	}) + '"' : '"' + string + '"';
}


function str(key, holder) {
	var i,          // The loop counter.
		k,          // The member key.
		v,          // The member value.
		length,
		mind = gap,
		partial,
		value = holder[key];

	if (value && typeof value === 'object' &&
			typeof value.toJSON === 'function') {
		value = value.toJSON(key);
	}

	if (typeof rep === 'function') {
		value = rep.call(holder, key, value);
	}

	switch (typeof value) {
	case 'function':
		return '"'+value.toString()
			.replace( /\\/g, "\\\\" )
			.replace( /\n/g, "\\n" )
			.replace( /\r/g, "" )
			.replace(/"/g, '\\"')+'"';

	case 'string':
		return quote(value);

	case 'number':
		return isFinite(value) ? String(value) : 'null';

	case 'boolean':
		return String(value);

	case 'object':
		if (!value) {
			return 'null';
		}

		// Extras such as FixedColumns have a reference to the DataTables settings object
		// for easy access, However it means that we have a circular reference, which
		// will kill browsers when you try to stringify it. So we only allow the DT object
		// to be stringifyed once (the main settings array)
		if ( (window as any).jQuery.inArray( value, _seen_objects ) !== -1 ) {
			return '"-- Previously seen object. Not included due to circular reference possibility --"';
		}
		else {
			_seen_objects.push( value );
		}

		// if ( jQuery.inArray( value, jQuery.fn.dataTableSettings ) !== -1 ) {
		//     if ( jQuery.inArray( value, _seen_objects ) !== -1 ) {
		//         return '"DataTables object"';
		//     }
		//     else {
		//         _seen_objects.push( value );
		//     }
		// }
		
		if ( value.nodeName ) {
			return '"'+outerHTML(value).replace( /\n/g, "\\n" ).replace( /\r/g, "" ).replace(/"/g, '\\"')+'"';
		}

		gap += indent;
		partial = [];

		if (Object.prototype.toString.apply(value) === '[object Array]') {

			length = value.length;
			for (i = 0; i < length; i += 1) {
				partial[i] = str(i, value) || 'null';
			}

			v = partial.length === 0
				? '[]'
				: gap
				? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
				: '[' + partial.join(',') + ']';
			gap = mind;
			return v;
		}

		if (rep && typeof rep === 'object') {
			length = rep.length;
			for (i = 0; i < length; i += 1) {
				if (typeof rep[i] === 'string') {
					k = rep[i];
					v = str(k, value);
					if (v) {
						partial.push(quote(k) + (gap ? ': ' : ':') + v);
					}
				}
			}
		} else {
			for (k in value) {
				if (Object.prototype.hasOwnProperty.call(value, k)) {
					v = str(k, value);
					if (v) {
						partial.push(quote(k) + (gap ? ': ' : ':') + v);
					}
				}
			}
		}

		v = partial.length === 0
			? '{}'
			: gap
			? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
			: '{' + partial.join(',') + '}';
		gap = mind;
		return v;
	}
}



export function stringify (value, replacer=null, space=2) {
	_seen_objects = [];

	var i;
	gap = '';
	indent = '';

	if (typeof space === 'number') {
		for (i = 0; i < space; i += 1) {
			indent += ' ';
		}
	} else if (typeof space === 'string') {
		indent = space;
	}

	rep = replacer;
	if (replacer && typeof replacer !== 'function' &&
			(typeof replacer !== 'object' ||
			typeof replacer.length !== 'number')) {
		throw new Error('JSON.stringify');
	}

	return str('', {'': value});
}


export function parse (text, reviver) {
	var j;

	function walk(holder, key) {

		var k, v, value = holder[key];
		if (value && typeof value === 'object') {
			for (k in value) {
				if (Object.prototype.hasOwnProperty.call(value, k)) {
					v = walk(value, k);
					if (v !== undefined) {
						value[k] = v;
					} else {
						delete value[k];
					}
				}
			}
		}
		return reviver.call(holder, key, value);
	}

	text = String(text);
	cx.lastIndex = 0;
	if (cx.test(text)) {
		text = text.replace(cx, function (a) {
			return '\\u' +
				('0000' + a.charCodeAt(0).toString(16)).slice(-4);
		});
	}

	if (/^[\],:{}\s]*$/
			.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
				.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
				.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

		j = eval('(' + text + ')');

		return typeof reviver === 'function'
			? walk({'': j}, '')
			: j;
	}

	throw new SyntaxError('DT_Debug_JSON.parse');
}

