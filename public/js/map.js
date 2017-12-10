var map;
function initMap() {
    const HK = { lat: 22.3964, lng: 114.1095}
    map = new google.maps.Map(document.getElementById('map'), {
        center: HK,
        zoom: 11
    });
    var tribeca = { lat: 40.719526, lng: -74.0089934 };
    var marker = new google.maps.Marker({
        position: tribeca,
        map: map,
        title: 'First Marker!'
    });
    // var infowindow = new google.maps.InfoWindow({
    //     content: "DO you ever feel like an InfoWindow, floating through the wind," + ""
    // })
}

// Get location form
var locationForm = document.getElementById('location-form');
