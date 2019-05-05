$(function() {
    console.log("Get funky");

    const GMAPS_GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?'
    const GMAPS_API_KEY = 'AIzaSyDugko09xbH7YY4avMUTZJNsA3uKHcuTeI';
    

    const ADZUNA_BASE_URL = 'https://api.adzuna.com/v1/api/';
    const ADZUNA_KEY = 'b22271cad1b74c76f8c6ec3587c34e86';
    const ADZUNA_APP_ID = 'e76d0c45';

    // Gets general Job Search Data
    function getAdzunaJobSearch (userInputCountry, userInputCity, jobCategory){
        let AdzunaJobSearchResponse = ADZUNA_BASE_URL +
        `jobs/${userInputCountry}/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_KEY}&where=${userInputCity}&category=${jobCategory}&content-type=application/json`;

        console.log('The Job Search Response URL is:', AdzunaJobSearchResponse);

        return fetch (AdzunaJobSearchResponse, {
            headers: {
                Accept: 'application/json'
            }
        })
        .then (response => /*Error Handler*/ response.json())
    }


    // Converts Total Count and Salary Mean response into HTML
    function jobCountSalaryHTML (data) {

        return `
                <label>Job Count
                    <span>${data.count}</span>
                </label>

                <label>Salary Mean
                    <span>${data.mean}</span>
                </label>`
    }



    // Gets Job History Data
    function getAdzunaJobHistory (userInputCountry, userInputCity, jobCategory) {
        
        let adzunaHistoryResponse = ADZUNA_BASE_URL +
        `jobs/${userInputCountry}/history?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_KEY}&where=${userInputCity}&category=${jobCategory}&content-type=application/json`;

        console.log('The History Response URL is:', adzunaHistoryResponse);

         return fetch (adzunaHistoryResponse, {
             headers: {
                 Accept: 'application/json'
             }
        })
        .then (response => /*Error Handler*/ response.json())           
    }
    

    // Displays Job History results in HTLM
    function displayAdzunaJobHistory (data) {  
        console.log('JSON results from History call:', data);

        if (data && data.month) {
            $('#results').append(historyHTML(data.month)); // Add location info here somewhere and somehow
        } 
    }


    // Displays Job Count & Mean Salary results in HTLM
    function displayAdzunaJobSearch (data) {
        console.log('JSON results from Job search call:', data);
        if (data && data.mean && data.count) {
            $('#results').append(jobCountSalaryHTML(data));
        }
    }


    // Converts Job History Data to HTML 
    function historyHTML (months) {
        let historyHTML = Object.keys(months).map(key => historyMonthHTML (key, months[key])).join(`\n`);
        return `<div>History:<ol>${historyHTML}</ol></div>`
    }


    // Formats Job History info
    function historyMonthHTML (month, salary) {

        // ADD SORT FUNCTIONALITY 

        // let sortedMonths = Object.keys.sort((month));   // BROKEN HELP!!!!!!

        return `<li>${month} salary: ${salary}</li>`
    }













    // Submit Button 

    function submitHandler () {

        $('form').submit(function (e) {
            
            e.preventDefault();

            // Gets User Input
            let userInputCountry = $('#userInputCountry').val();
            let userInputCity = $('#userInputCity').val().trim();


            let userInputCountry2 = $('#userInputCountry2').val();
            let userInputCity2 = $('#userInputCity2').val().trim();


            let jobCategory = $('#userInputJobCategory').val();

            // Logs User Input
            console.log('Submit Button was clicked');
            console.log('This is the captured User Input for the COUNTRY:', userInputCountry);
            console.log('This is the captured User Input for the CITY:', userInputCity);

            console.log('This is the captured User Input for the 2nd COUNTRY:', userInputCountry2);
            console.log('This is the captured User Input for the 2nd CITY:', userInputCity2);


            console.log('This is the captured User Input for the JOB CATEGORY:', jobCategory);

            $('#results').html('');

            // Does the things

            //Makes first call

            getAdzunaJobHistory (userInputCountry, userInputCity, jobCategory)
            .then(data => displayAdzunaJobHistory(data));

            getAdzunaJobSearch (userInputCountry, userInputCity, jobCategory)
            .then(data => displayAdzunaJobSearch(data));

            // Makes second call  

            getAdzunaJobHistory (userInputCountry2, userInputCity2, jobCategory)
            .then(data => displayAdzunaJobHistory(data));

            getAdzunaJobSearch (userInputCountry2, userInputCity2, jobCategory)
            .then(data => displayAdzunaJobSearch(data));


            // getsGmapsLoc (userInputCountry2, userInputCity2)
            // .then(data => /** heatmapfunction */ )

        });
    }



    submitHandler();
});


    // Needs argument that takes Array that have Object Coordinates
    function centerCoordOfGroup () {
        
    }


    // 
    function centerMapOnSearch () {

    }


// Initializes Map 
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 37.77439, lng: -122.419416},
        zoom: 9
        });

        infoWindow = new google.maps.InfoWindow;

        // Get User Location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
            }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
        }
    }

var map;



// https://maps.googleapis.com/maps/api/geocode/json?address=Mountain+View,+CA&key=AIzaSyDugko09xbH7YY4avMUTZJNsA3uKHcuTeI
// https://maps.googleapis.com/maps/api/geocode/json?address=Los+Angeles,+us&key=AIzaSyDugko09xbH7YY4avMUTZJNsA3uKHcuTeI


function getsGmapsLoc (userInputCountry, userInputCity){
    
    let GMAPS_RESPONSE = GMAPS_GEOCODE_URL + `addess=${userInputCity},+${userInputCountry}&key=${GMAPS_API_KEY}`
    console.log('GMAPS JSON URL RESPONSE:', GMAPS_RESPONSE);

    return fetch (GMAPS_RESPONSE)
    .then (response => response.json())
    

}








var heatMapData = [
    new google.maps.LatLng(37.785, -122.439),
    {location: new google.maps.LatLng(37.785, -122.437), weight: 2},
    {location: new google.maps.LatLng(37.785, -122.435), weight: 3}
  ];
  
  var sanFrancisco = new google.maps.LatLng(37.774546, -122.433523);
  
  map = new google.maps.Map(document.getElementById('map'), {
    center: sanFrancisco,
    zoom: 13,
    mapTypeId: 'satellite'
  });
  
  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: heatMapData
  });
  heatmap.setMap(map);





/* Data points defined as a mixture of WeightedLocation and LatLng objects */
// var heatMapData = [
//     {location: new google.maps.LatLng(37.782, -122.447), weight: 0.5},
//     new google.maps.LatLng(37.782, -122.445),
//     {location: new google.maps.LatLng(37.782, -122.443), weight: 2},
//     {location: new google.maps.LatLng(37.782, -122.441), weight: 3},
//     {location: new google.maps.LatLng(37.782, -122.439), weight: 2},
//     new google.maps.LatLng(37.782, -122.437),
//     {location: new google.maps.LatLng(37.782, -122.435), weight: 0.5},
  
//     {location: new google.maps.LatLng(37.785, -122.447), weight: 3},
//     {location: new google.maps.LatLng(37.785, -122.445), weight: 2},
//     new google.maps.LatLng(37.785, -122.443),
//     {location: new google.maps.LatLng(37.785, -122.441), weight: 0.5},
//     new google.maps.LatLng(37.785, -122.439),
//     {location: new google.maps.LatLng(37.785, -122.437), weight: 2},
//     {location: new google.maps.LatLng(37.785, -122.435), weight: 3}
//   ];
  
//   var sanFrancisco = new google.maps.LatLng(37.774546, -122.433523);
  
//   map = new google.maps.Map(document.getElementById('map'), {
//     center: sanFrancisco,
//     zoom: 13,
//     mapTypeId: 'satellite'
//   });
  
//   var heatmap = new google.maps.visualization.HeatmapLayer({
//     data: heatMapData
//   });
//   heatmap.setMap(map);

















// ADD LINEAR REGRESSION - CURRENTLY BROKEN FOR NO REASON: 
// https://dracoblue.net/dev/linear-least-squares-in-javascript/




// function findLineByLeastSquares(values_x, values_y) {
//     var sum_x = 0;
//     var sum_y = 0;
//     var sum_xy = 0;
//     var sum_xx = 0;
//     var count = 0;

//     /*
//      * We'll use those variables for faster read/write access.
//      */
//     var x = 0;
//     var y = 0;
//     var values_length = values_x.length;

//     if (values_length != values_y.length) {
//         throw new Error('The parameters values_x and values_y need to have same size!');
//     }

//     /*
//      * Nothing to do.
//      */
//     if (values_length === 0) {
//         return [ [], [] ];
//     }

//     /*
//      * Calculate the sum for each of the parts necessary.
//      */
//     for (var v = 0; v &lt; values_length; v++) {
//         x = values_x[v];
//         y = values_y[v];
//         sum_x += x;
//         sum_y += y;
//         sum_xx += x*x;
//         sum_xy += x*y;
//         count++;
//     }

//     /*
//      * Calculate m and b for the formular:
//      * y = x * m + b
//      */
//     var m = (count*sum_xy - sum_x*sum_y) / (count*sum_xx - sum_x*sum_x);
//     var b = (sum_y/count) - (m*sum_x)/count;

//     /*
//      * We will make the x and y result line now
//      */
//     var result_values_x = [];
//     var result_values_y = [];

//     for (var v = 0; v &lt; values_length; v++) {
//         x = values_x[v];
//         y = x * m + b;
//         result_values_x.push(x);
//         result_values_y.push(y);
//     }

//     return [result_values_x, result_values_y];
// }