var map;
var addresses = [];
var markers = [];
var origin;
var destination;
var directionsDisplay;
var infowindows = [];

//prevent dropdown menu from closing itself by clicking
$('.dropdown-menu').on('click', function(e){
    if($(this).hasClass('dropdown-menu-form')){
        e.stopPropagation();
    }
});

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
            zoom: 15,
            disableDefaultUI: true
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
    clearRoutes();
    axios.get('https://api.data.gov.hk/v1/nearest-recyclable-collection-points', {
        params: {
            lat: origin.lat(),
            long: origin.lng(),
            max: 10
        }
    }).then(response => {
        createMarkerAndInfoWindows(response);
        
        // For Search result list rendering
        //console.log(response.data.results);

        var resultData = response.data.results;
        console.log(resultData);

        clearResult();
        renderHTML(resultData);
        
    }).catch(err => {
        console.log(err);
    });
}

// For Search result list rendering
var resultDisplay = document.getElementById("list");

// clear results list displayed for new search query
function clearResult(){
    resultDisplay.innerHTML = "";
}

function renderHTML(data) {
    var listResult = "";
    var listHeading = "<br><h5>" + "Recycling Points near <br> your current/selected location:" + "</h5>";
    var backToMap = "<h6 onclick='location.href=\"#pagelink\"' style='cursor:pointer;'>Back to Map</h6>";

    
    
    //console.log("TEST RESULT:" + data);

    for (i=0; i<data.length; i++){

        var wasteData = data[i]["waste-type"];
        console.log(wasteData);


        var waste = wasteData.replace(/,/g, "             ");  
        // console.log(waste);

        var wasteTest = "<p id='wastetype'>" + waste + "</p>";

        
        // wasteTest.style.backgroundColor = 'green';

        // var n = waste.includes("Paper");
        // let paper = "Paper"
        // console.log(n);

        // function colorWasteType(paper){
        //     if (n = true) {
        //         // return "<span style='background-color: green;'>" + paper + "</span>";
        //     }
        //     else {
        //         return true;
        //     }
        // }

        listResult += "<div id='listBox' onclick='location.href=\"#pagelink\"' style='cursor:pointer;'>" +
        "<strong>" + data[i]["address1-en"] + "</strong><br>" + 
        "<p>" + data[i]["address1-zh-hant"] + "<br><br>"
        + "<strong>" + "recyclable waste-type accepted:" + "</strong><br>"
        + "<div id='test'>" + data[i]["waste-type"] + "</div>" + "</p>" + "</div>";
    }

    resultDisplay.insertAdjacentHTML('beforeend', wasteTest);

    resultDisplay.insertAdjacentHTML('beforeend', listHeading);
    resultDisplay.insertAdjacentHTML('beforeend', listResult);

    //to add Back to Map link at the end of the search result list
    resultDisplay.insertAdjacentHTML('beforeend', backToMap);
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
    clearRoutes();
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

            // render the results list
            console.log(searchQuery);
            //console.log(response.data.results);

            var resultData = response.data.results;
            console.log(resultData);
    
            clearResult();
            renderData(resultData, searchQuery);
            
        }).catch(err => {
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
    })
}

// For Search result list rendering
function renderData(data, location) {
    var listResult = "";
    var listHeading = "<br><h5>" + "Recycling Points near <br> your entered location: " + location + "</h5>";
    var backToMap = "<h6 onclick='location.href=\"#pagelink\"' style='cursor:pointer;'>Back to Map</h6>";

    //console.log("TEST RESULT:" + data);

    for (i=0; i<data.length; i++){
        listResult += "<div id='listBox' onclick='location.href=\"#pagelink\"' style='cursor:pointer;'>" +
        "<strong>" + data[i]["address1-en"] + "</strong><br>" + 
        "<p>" + data[i]["address1-zh-hant"] + "<br><br>"
        + "<strong>" + "recyclable waste-type accepted:" + "</strong><br>"
        + data[i]["waste-type"] + "</p>" + "</div>";
    }

    resultDisplay.insertAdjacentHTML('beforeend', listHeading);
    resultDisplay.insertAdjacentHTML('beforeend', listResult);

    //to add Back to Map link at the end of the search result list
    resultDisplay.insertAdjacentHTML('beforeend', backToMap);
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
    infoWindows = [];
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
    addresses = [];
    adjustBounds();
}

//create infowindow helper
function createInfoWindow(marker, address) {

    let contentString = `
                        Address :${address["address1-en"]} <br>
                        Recycling Type: ${address["waste-type"]} <br>
                        <input type="button" value="Show route" onclick="getDirection(); closeInfoWindows()"></input>
                        `;
    let infowindow = new google.maps.InfoWindow({
        content: contentString
    });
    infowindows.push(infowindow);
    google.maps.event.addListener(marker, "click", function (event) {
        destination = this.position;
        closeInfoWindows();
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
            if (directionsDisplay) {
                directionsDisplay.setMap(null);
            }
            directionsDisplay = new google.maps.DirectionsRenderer({
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

//close all infowindows
function closeInfoWindows() {
    for (infoWindow of infowindows){
        infoWindow.close();
    }
}

function clearRoutes() {
    if (directionsDisplay) {
        directionsDisplay.setMap(null);
    }
}
