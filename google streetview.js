// Globals
let gmap = null;
let Pano = null;
let map = null;
let marker = null;
let in_sv = false;
let center = [-83.703, 42.298];
let sv_mark = null; // button element
let sv_mode = null; // button element

// Map API initilization //////////////////////////////////////////////////////
function initMapbox() {
	mapboxgl.accessToken = 'pk.eyJ1IjoiY2FvYSIsImEiOiJjazFncHJqZzYwMXkyM2hxcWp6d2hucTk1In0.5Z7Nmggo79voVuNvU2i7sQ';
	map = new mapboxgl.Map({
		container: 'mapbox',
		style: 'mapbox://styles/mapbox/streets-v11',
		center: center,
		zoom: 10,
		attributionControl: false,
		maxBounds: [[-84,42],[-82.5,43]],
		maxPitch: 0,
	})
	map.addControl(new mapboxgl.NavigationControl(), 'top-right');
	map.addControl(new mapboxgl.AttributionControl({compact: true}));
	map.on('click', setMarker);
}

function updateCoords() {
	const lnglat = marker.getLngLat();
	center = [lnglat.lng, lnglat.lat];
}
function setMarker(e) {
	if (marker) {
		marker.setLngLat(e.lngLat);
	}
	else {
		marker = new mapboxgl.Marker({draggable: true});
		if ('lngLat' in e) {
			marker.setLngLat(e.lngLat);
		} else {
			marker.setLngLat(map.getCenter());
		}
		marker.addTo(map);
		marker.on('dragend', updateCoords);
	}
	updateCoords();
	sv_mark.innerText = "Remove Marker";
	sv_mode.disabled = false;
}
function removeMarker(e) {
	marker.remove();
	marker = null;
	sv_mark.innerText = "Add Marker";
	sv_mode.disabled = true;
}
function toggleMarker(e) {
	marker ? removeMarker(e) : setMarker(e);
	e.preventDefault();
}




// GMaps street view functions ////////////////////////////////////////////////
function initGMaps() {
    CMap = new google.maps.Map(document.getElementById('map'), {
        center: { lng: center[0], lat: center[1]  },
        zoom: 8,
        minZoom: 6,
        streetViewControl: false,
        scaleControl: true,
        clickableIcons: false,
        fullscreenControl: false
	});
}
function enterStreetView() {
	map.getContainer().style.visibility = 'hidden';
	initGMaps();
    Pano = new google.maps.StreetViewPanorama(
        document.getElementById('map'), {
            position: { lng: center[0], lat: center[1]  },
            pov: { heading: 0, pitch: 10 },
            fullscreenControl: false
        }
    );
    CMap.setStreetView(Pano);
}

function exitStreetView() {
	Pano.setVisible(false);
	CMap.getDiv().innerHTML = '';
	CMap.getDiv().setAttribute("style", "");
	map.getContainer().style.visibility = 'visible';
}

function toggleStreetView(e) {
	if (in_sv) {
		exitStreetView(e);
		sv_mark.disabled = false;
		sv_mode.innerText = "Enter Street View";
		in_sv = false;
	} else {
		enterStreetView(e);
		sv_mark.disabled = true;
		sv_mode.innerText = "Leave Street View";
		in_sv = true;
	}
	e.preventDefault();
}

// Page initialization ////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function(event) {
	sv_mark = document.getElementById("sv_mark");
	sv_mode = document.getElementById("sv_mode");
	initMapbox();
	sv_mode.addEventListener("click", toggleStreetView);
	sv_mark.addEventListener("click", toggleMarker);
});