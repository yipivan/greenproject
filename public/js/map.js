var map;
var addresses = [];
var markers = [];
var origin;
var destination;

function initMap() {
    
    getPosition().then(position => {
        //first to run to set current location
        origin = new google.maps.LatLng({ lat: position.coords.latitude, lng: position.coords.longitude });

        //attach event listener to show location button
        let showLocBtn = document.getElementById('showloc');
        showLocBtn.addEventListener('click', getNearbyRecyclingPoints);

        //attach event listener to search button
        let searchBtn = document.getElementById('searchloc').getElementsByTagName('button')[0];
        searchBtn.addEventListener('click', getLocations);

        //initiailize the google map and place marker on user location
        map = new google.maps.Map(document.getElementById('map'), {
            center: origin,
            zoom: 15
        });
        let originMarker = new google.maps.Marker({
            position: origin,
            map: map,
            title: 'Im here!',
            draggable: true,
            animation: google.maps.Animation.DROP,
            icon: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
        });
    }).catch(err => {
        console.log(err);
    })
}

// function to fetching the recycling points
function getNearbyRecyclingPoints() {
    axios.get('https://api.data.gov.hk/v1/nearest-recyclable-collection-points', {
        params: {
            lat: origin.lat(),
            long: origin.lng(),
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
    var searchQuery = document.getElementById('searchloc').getElementsByTagName('input')[0].value;
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

// clearing the markers
function clearMarkers() {
    for (marker of markers) {
        marker.setMap(null);
    }
}

//create markers and infowindows
function createMarkerAndInfoWindows(response) {
    addresses = [];
    for (address of response.data.results) {
        let wasteTypes = address["waste-type"].split(",");
        address.wasteTypes = wasteTypes;
        addresses.push(address);
    }
    clearMarkers();
    markers = [];
    for (address of addresses) {
        let marker = new google.maps.Marker({
            position: { lat: address["lat-long"][0], lng: address["lat-long"][1] },
            map: map,
            title: address["address1-zh-hant"],
            animation: google.maps.Animation.DROP
        });
        createInfoWindow(marker, address);
        markers.push(marker);
    }
    adjustBounds();
}

//create infowindow helper
function createInfoWindow(marker, address) {

    let contentString = `
                        Address :${address["address1-en"]} <br>
                        Recycling Type: ${address["waste-type"]} <br>
                        <input type="button" value="Show route" onclick="getDirection()"></input>
                        `;
    let infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    google.maps.event.addListener(marker, "click", function (event) {
        destination = this.position;
        infowindow.open(map, marker);
    }); //end addListener
}

//get direction
function getDirection() {
    let directionsService = new google.maps.DirectionsService;
    directionsService.route({
        origin: origin,
        destination: destination,
        travelMode: "WALKING"
    }, (response, status) => {
        if (status === "OK") {
            var directionsDisplay = new google.maps.DirectionsRenderer({
                map: map,
                directions: response,
                draggable: true,
                polylineOptions: {
                    strokeColor: 'blue'
                }
            });
        } else {
            window.alert('Directions request failed due to ' + status);
        }
    })
}