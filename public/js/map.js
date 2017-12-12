var addresses = [];
var markers = [];
var map;
var currentLocation;

function initMap() {

    getPosition().then(position => {
        //first to run to set current location
        currentLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        };

        //attach event listener to show location button
        let showLocBtn = document.getElementById('showloc');
        showLocBtn.addEventListener('click', getNearbyRecyclingPoints);

        //attach event listener to search button
        let searchBtn = document.getElementById('searchloc').getElementsByTagName('button')[0];
        searchBtn.addEventListener('click', getLocations);

        //initiailize the google map and place marker on user location
        map = new google.maps.Map(document.getElementById('map'), {
            center: currentLocation,
            zoom: 15
        });
        let originMarker = new google.maps.Marker({
            position: currentLocation,
            map: map,
            title: 'Im here!',
            draggable: true,
            animation: google.maps.Animation.DROP,
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });
        console.log(originMarker);
    }).catch(err => {
        console.log(err);
    })
}

// function to fetching the recycling points
function getNearbyRecyclingPoints() {
    axios.get('https://api.data.gov.hk/v1/nearest-recyclable-collection-points', {
        params: {
            lat: currentLocation.lat,
            long: currentLocation.lng,
            max: 10
        }
    }).then(response => {
        createMarkerAndInfoWindows(response);
    }).catch(err => {
        console.log(err);
    });
}

//adjust the map boundary
function adjustBounds() {
    var bounds = new google.maps.LatLngBounds();
    // Extend the boundaries of the map for each marker and display the marker
    for (marker of markers) {
        marker.setMap(map);
        bounds.extend(marker.position);
    }
    map.fitBounds(bounds);
}

// function getting geolocation from browser
function getPosition() {
    return new Promise(function (resolve, reject) {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
};

//handle user query
function getLocations() {
    console.log('click');
    var searchQuery = document.getElementById('searchloc').getElementsByTagName('input')[0].value;
    console.log(searchQuery);
    axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
            address: searchQuery,
            key: 'AIzaSyAukIcOBd5XzTyDZBhDhSOOFHqONrH_vzk',
        }
    }).then(response => {
        var lat = response.data.results[0].geometry.location.lat;
        var lng = response.data.results[0].geometry.location.lng;
        axios.get('https://api.data.gov.hk/v1/nearest-recyclable-collection-points', {
            params: {
                lat: lat,
                long: lng,
                max: 10
            }
        }).then(response => {
            createMarkerAndInfoWindows(response);
        }).catch(err => {
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
    })
}

// hiding the markers
function clearMarkers() {
    for (marker of markers) {
        marker.setMap(null);
    }
}

//create markers and infowindows
function createMarkerAndInfoWindows(response) {
    console.log(response);
    addresses = [];
    for (address of response.data.results) {
        let wasteTypes = address["waste-type"].split(",");
        address.wasteTypes = wasteTypes;
        addresses.push(address);
    }
    console.log(addresses);
    clearMarkers();
    markers = [];
    for (address of addresses) {
        let marker = new google.maps.Marker({
            position: { lat: address["lat-long"][0], lng: address["lat-long"][1] },
            map: map,
            title: 'recycling points',
            animation: google.maps.Animation.DROP
        });
        createInfoWindow(marker, address);
        markers.push(marker);
    }
    adjustBounds();
}

//create infowindow helper
function createInfoWindow(marker, address) {

    let contentString = `Address :${address["address1-en"]} <br>
                        Recycling Type: ${address["waste-type"]}`;
    var infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    marker.addListener('click', () => {
        infowindow.open(map, marker);
    })
}

//get direction
function getDirection(origin, destination) {

}