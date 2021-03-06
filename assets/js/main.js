/**
 * iOS Clock App
 */

//=include ../../node_modules/jquery/dist/jquery.js

// Current time friendly format
function now() {
	var time = new Date()
	var hr = time.getHours()
	var min = time.getMinutes()
	var sec = time.getSeconds()

	if ( hr > 12 ) {
		hr -= 12
	}
	if ( hr < 10 ) {
		hr = " " + hr
	}
	if ( min < 10 ) {
		min = "0" + min
	}
	if ( sec < 10 ) {
		sec = "0" + sec
	}

	return hr + ":" + min + ":" + sec
}

var startClock = function( next ) {
	var time = now();
	time = time.replace( /:/g, '<span class="colon">:</span>' );
	$( '#clock' ).html( time );
	var t = setTimeout( startClock, 500 );
};

function round( value, decimals ) {
	return Number( Math.round( value + 'e' + decimals ) + 'e-' + decimals );
}

/**
 * Weather Forecast
 */
function lookupWeather() {

	// Current time for adjusting weather report
	var time = new Date();
	var hr = time.getHours();

	// Find current geolocation
	navigator.geolocation.getCurrentPosition( function( position ) {
		var query = 'https://api.weather.gov/points/' + round( position.coords.latitude, 4 ) + ',' + round( position.coords.longitude, 4 ) + '/forecast';

		var req = $.ajax( {
			url: query,
			dataType: 'json',
			cache: false
		} );

		req.done( function( resp ) {
			var today = new Date();
			var offset = ( hr > 5 ) ? 0 : 1;
			var weather = resp.properties.periods[ offset ];
			var month = today.getMonth() + 1;
			var day = today.getDate();

			weather.formattedDate = month + '/' + day;

			$( '[data-weather]' ).each( function() {
				var prop = $( this ).data( 'weather' );
				var val = weather[ prop ];
				$( this ).text( val );
			} );

			$( 'body' ).addClass( 'ready' );
		} );

		req.fail( function( err ) {
			console.error( err );
		} );
	} );
}

// Disallow moving on iOS
function blockMove( event ) {
	event.preventDefault();
}

// Clock
startClock();

// Weather
lookupWeather();

// Re-check every 5 minutes
setInterval( function() {
	lookupWeather();
	console.info( 'Re-checked weather after 5 mins...' )
}, 300000 );
