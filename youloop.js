var option = {
	vLink : "",
	startPos : 0,
	endPos : 0,
	bAutoplay : false,
	bControls : false,
	bFullScreen : false,
	bLoop : false,
	bNoLogo : false
};

function toSecond( hour, min, sec ) {
	var answer = ( hour * 3600 ) + ( min * 60 ) + sec;
	return answer;
}

function getMatchLength( str, p ) {
	var answer = str.match( p );
	return answer.input.length;
}

function getVideoId( url ) {
	var id = "", low = "";
	var i = 0, j = 0;
	var p = "[a-zA-Z0-9_-]+";

	for ( i = 0; url.codePointAt(i) !== undefined; i++ ) {
		if ( url.codePointAt(i) > 0x7f ) return null;
	}

	low = url.toLowerCase();

	i = low.indexOf( "youtube.com/watch?" );
	if ( i !== -1 ) {
		j = low.indexOf( "v=", i + 18 );		
		if ( j !== -1 ) {
			id = url.substr( j + 2, 11 );

			if ( getMatchLength( id, p ) === 11 ) {
				return id;
			} else {
				return null;
			}
		}

		return null;
	}

	i = low.indexOf( "youtu.be/" );
	if ( i !== -1 ) {
		id = url.substr( i + 9, 11 );

		if ( getMatchLength( id, p ) === 11 ) {
			return id;
		} else {
			return null;
		}
	}

	i = low.indexOf( "youtube.com/embed/" );
	if ( i !== -1 ) {
		id = url.substr( i + 18, 11 );

		if ( getMatchLength( id, p ) === 11 ) {
			return id;
		} else {
			return null;
		}
	}

	return null;
}

document.getElementById( "jump" ).addEventListener( "click", function() {
	var id = "", opt = "", url = "";
	var a = b = h = m = s = 0;

	id = getVideoId( document.getElementById( "video" ).value );
	if ( id === null ) return;
	url = "https://www.youtube.com/embed/" + id;

	h = parseInt( document.getElementById( "start_h" ).value );
	if ( h < 0 || ( parseInt( document.getElementById( "start_h" ).max ) < h ) ) h = 0;
	m = parseInt( document.getElementById( "start_m" ).value );
	if ( m < 0 || 59 < m ) m = 0;
	s = parseInt( document.getElementById( "start_s" ).value );
	if ( s < 0 || 59 < s ) s = 0;

	a = toSecond( h, m, s );
	if ( a !== 0 ) {
		option.startPos = a;
		opt += ( "&start=" + a.toString() );
	}

	h = parseInt( document.getElementById( "end_h" ).value );
	if ( h < 0 || ( parseInt( document.getElementById( "end_h" ).max ) < h ) ) h = 0;
	m = parseInt( document.getElementById( "end_m" ).value );
	if ( m < 0 || 59 < m ) m = 0;
	s = parseInt( document.getElementById( "end_s" ).value );
	if ( s < 0 || 59 < s ) s = 0;

	b = toSecond( h, m, s );
	if ( b !== 0 && a <= b ) {
		option.endPos = b;
		opt += ( "&end=" + b.toString() );
	}

	option.bAutoplay = document.getElementById( "autoplay" ).checked;
	option.bControls = document.getElementById( "controls" ).checked;
	option.bFullScreen = document.getElementById( "fs" ).checked;
	option.bLoop = document.getElementById( "loop" ).checked;
	option.bNoLogo = document.getElementById( "nologo" ).checked;

	if ( option.bAutoplay ) opt += "&autoplay=1";
	if ( !option.bControls ) opt += "&controls=0";
	if ( !option.bFullScreen ) opt += "&fs=0";
	if ( option.bNoLogo ) opt += "&modestbranding=1";
	if ( option.bLoop ) opt += ( "&loop=1&playlist=" + id );

	if ( opt !== "" ) url = url + "?" + opt.slice(1);
	option.vLink = url;
	window.open().location.href = url;
}, false);
