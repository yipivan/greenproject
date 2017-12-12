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
        searchBtn.addEventListener('click', getDirection);

        //initiailize the google map and place marker on user location
        map = new google.maps.Map(document.getElementById('map'), {
            center: currentLocation,
            zoom: 15
        });
        let originMarker = new google.maps.Marker({
            position: currentLocation,
            map: map,
            title: 'Im here!',
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
            lat: currentLocation.lat,
            long: currentLocation.lng,
            max: 10
        }
    }).then(response => {
        let latlngs = [];
        for (address of response.data.results) {
            latlngs.push({
                lat: address["lat-long"][0],
                lng: address["lat-long"][1]
            })
        }
        clearMarkers();
        markers = [];
        for (latlng of latlngs) {
            let marker = new google.maps.Marker({
                position: latlng,
                map: map,
                title: 'recycling points',
                animation: google.maps.Animation.DROP
            });
            markers.push(marker);
        }
        adjustBounds();
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
function getDirection() {
    console.log('click');
    var searchQuery = document.getElementById('searchloc').getElementsByTagName('input')[0].value;
    console.log(searchQuery);
    axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
        params: {
            address: searchQuery,
            key: 'AIzaSyAukIcOBd5XzTyDZBhDhSOOFHqONrH_vzk',
        }
    }).then(response => {
        console.log(response);
        var lat = response.data.results[0].geometry.location.lat;
        var lng = response.data.results[0].geometry.location.lng;
        axios.get('https://api.data.gov.hk/v1/nearest-recyclable-collection-points', {
            params: {
                lat: lat,
                long: lng,
                max: 10
            }
        }).then(response => {
            let latlngs = [];
            for (address of response.data.results) {
                latlngs.push({
                    lat: address["lat-long"][0],
                    lng: address["lat-long"][1]
                })
            }
            clearMarkers();
            markers = [];
            for (latlng of latlngs) {
                let marker = new google.maps.Marker({
                    position: latlng,
                    map: map,
                    title: 'recycling points',
                    animation: google.maps.Animation.DROP
                });
                markers.push(marker);
            }
            adjustBounds();
        }).catch(err => {
            console.log(err);
        });
    })
        .catch(err => {
            console.log(err);
        })
}

// hiding the markers
function clearMarkers() {
    for (marker of markers) {
        marker.setMap(null);
    }
}