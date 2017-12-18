var btn = document.getElementById("resultlist");

btn.addEventListener("click", function(){
    var ourRequest = new XMLHttpRequest();
    ourRequest.open('GET', 'https://api.data.gov.hk/v1/nearest-recyclable-collection-points?lat=22.2812&long=114.1659&max=5');
    ourRequest.onload = function(){
        // putting the data from JSON/API to ourData variable
        var ourData = JSON.parse(ourRequest.responseText);
        createHTML(ourData);
        //put data in array to display in the variable
        var displayData = ourData.results;
        //renderHTML(displayData);
        //console.log(ourData);

        //for accessing specific array index and property
        // console.log(ourData.results[0].id);
        // console.log(ourData.results[0].state);
        // console.log(ourData.results[0]["waste-type"]);
        // console.log(ourData.results[0]["address1-en"]);
    };

    // error handling
    ourRequest.onerror = function(){
        console.log("there is an error");
    };

    ourRequest.send();
});

function createHTML(data){
    //needs innerHTML to access inside script tag for handlebar.js
    var listTemplate = document.getElementById("template").innerHTML;
    var compiledTemplate = Handlebars.compile(listTemplate);
    var ourGeneratedHTML = compiledTemplate(data);

    var resultsContainer = document.getElementById("list");
    resultsContainer.innerHTML = ourGeneratedHTML;
}

$('#recycle-form').on('submit', function() {
    window.alert('form submit!');
})