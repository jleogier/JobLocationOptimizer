$(function() {
    console.log("Get funky");

    const ADZUNA_BASE_URL = 'https://api.adzuna.com/v1/api/';
    const ADZUNA_KEY = 'b22271cad1b74c76f8c6ec3587c34e86';
    const ADZUNA_APP_ID = 'e76d0c45';

    // Gets general Job Search Data: Total Count + Salary Mean
    function getAdzunaJobSearch (userInputCountry, userInputCity, jobCategory){
        let AdzunaJobSearchResponse = ADZUNA_BASE_URL +
        `jobs/${userInputCountry}/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_KEY}&where=${userInputCity}&category=${jobCategory}&content-type=application/json`;

        console.log('The Job Search Response URL is:', AdzunaJobSearchResponse);

        return fetch (AdzunaJobSearchResponse, {
            headers: {
                Accept: 'application/json'
            }
        })
        .then (response => response.json())
        .catch(err => console.log(err));
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

    // Displays Job Count & Mean Salary results in HTLM
    function displayAdzunaJobSearch (data) {
        console.log('JSON results from Job search call:', data);
        if (data && data.mean && data.count) {
            $('#results').append(jobCountSalaryHTML(data));
        }
    }

    function getsGmapsLoc (userInputCountry, userInputCity){
    
        let GMAPS_RESPONSE = GMAPS_GEOCODE_URL + `addess=${userInputCity},+${userInputCountry}&key=${GMAPS_API_KEY}`
        console.log('GMAPS JSON URL RESPONSE:', GMAPS_RESPONSE);
    
        return fetch (GMAPS_RESPONSE)
        .then (response => response.json())
        .then (data => console.log(data))
        .then (data => latLngGetter(data))
        .then (new google.maps.LatLng(data[0], data[1]))
        .catch(err => console.log(err));
    }

    // https://maps.googleapis.com/maps/api/geocode/json?address=Seattle,+us&key=AIzaSyDugko09xbH7YY4avMUTZJNsA3uKHcuTeI

    // https://maps.googleapis.com/maps/api/geocode/json?address=Denver,+us&key=AIzaSyDugko09xbH7YY4avMUTZJNsA3uKHcuTeI

    // .then (data => displayLocation(data));

    // function displayLocation (data){
    //     console.log(data);

    //     $('#results').append(`
    //     <div>${data.results[0].formatted_address}</div>
    //     `);

    // }


    function latLngGetter (data) {
        let latitude = results[0].geometry.location.lat;
        let longitude = results[0].geometry.location.lng;

        let latLngLoc = [latitude, longitude];

        return latLngLoc
    }



    // Submit Button 

    function submitHandler () {

        $('form').submit(function (e) {
            
            e.preventDefault();

            // OBTAIN USER INPUT LOCATIONS:
            // Obtain Location 1
            let userInputCountry = $('#userInputCountry').val();
            let userInputCity = $('#userInputCity').val().trim();
            
            // Obtain Location 2
            let userInputCountry2 = $('#userInputCountry2').val();
            let userInputCity2 = $('#userInputCity2').val().trim();

            // OBTAIN USER INPUT: JOB CATEGORY
            let jobCategory = $('#userInputJobCategory').val();

            // Logs User Input selection
            console.log('Submit Button was clicked');
            console.log('This is the captured User Input for the COUNTRY:', userInputCountry);
            console.log('This is the captured User Input for the CITY:', userInputCity);

            console.log('This is the captured User Input for the 2nd COUNTRY:', userInputCountry2);
            console.log('This is the captured User Input for the 2nd CITY:', userInputCity2);

            console.log('This is the captured User Input for the JOB CATEGORY:', jobCategory);

            $('#results').html('');


            // DOES THE MAIN SUBMIT HANDLER THINGS

            cities = [];

            // let city1history = getAdzunaJobHistory (userInputCountry, userInputCity, jobCategory)
            // .then(data => displayAdzunaJobHistory(data))
            // .then(json => {
            //     cities[0] ? cities[0].history = data : cities[0] = {history: data}; 
            //     return data;
            // });

            // Makes first call 
            city1jobs = getAdzunaJobSearch (userInputCountry, userInputCity, jobCategory)
            .then(userInputCountry, userInputCity => getsGmapsLoc(userInputCountry, userInputCity))
            .then(data => displayAdzunaJobSearch(data))
            // .then(json => cities[0] ? cities[0].jobs = data : cities[0] = {jobs: data} );



            // Makes second call  
            city2jobs = getAdzunaJobSearch (userInputCountry2, userInputCity2, jobCategory)
            .then(userInputCountry2, userInputCity2 => getsGmapsLoc(userInputCountry2, userInputCity2))
            .then(data => displayAdzunaJobSearch(data))


            // let promises = [city1history, city1jobs, city2history, city2jobs];

            // Promise.all(promises).then(results =>{
                
            // })
            // .catch( err => {
            //     console.log("One or more promises failed between city1 and city2 job and history searches.");
            //     console.error(err);
            // })


            // getsLocInput (userInputCountry2, userInputCity2)
            // .then(data => /** heatmapfunction */ )

        });
    }
    submitHandler();
});


const GMAPS_GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?'
const GMAPS_API_KEY = 'AIzaSyDugko09xbH7YY4avMUTZJNsA3uKHcuTeI';



    /**** GENERAL MAP CONTROL FUNCTIONS FOR UI  ********/

    // input: array of objects with location: keys which are google maps LatLng objects
    // output: Lat Long Coordinate for map
    // Needs argument that takes Array that have Object Coordinates
    function centerCoordOfLocations () {



        // calculate the topmost, leftmost, rightmost, and bottom-most lat/long coords of all results
        // make a new box with that toppest, rightest, etc..
        // find the center of that new box
        // left + (right-left/2), bottom + (top-bottom/2)
    }


    // input: array of objects with location: keys which are google maps LatLng objects
    // output: none
    // side effect: contact map and tell it to center on coord
    function centerMapOnLocations () {
        // call centerCoordOfGroup() to get the actual coord
        // then call the map to center on that coord
    }


    /**** DATA SPECIFIC FUNCTIONS  ******/

    function coordForSearchResult(result){
        if (!result) return;

        let lat = 0;// some data inside result like result.location.latitude
        let lng = 0;// some data inside result like result.location.longitude

        // parse job search results
        if( result.type == "jobSearch" ){
            lat = result.job.location.lat;
        }

        // parse city results
        if( result.type == "citySearch" ){
            lat = result.city.latitude;
        }

        return new google.maps.LatLng(lat, lng)
    }


    // input: many search results
    // output: many coordinate object as google LatLng()
    function locationsForSearchResults(results){
        return data.map(function(result){
            return { 
                location: coordForSearchResult(result),
                weight: 1 
            };
        });
    }
    

    // input: raw adzuna data
    // output: none
    // side effects: adding pins to map/heatmap
    function addResultsToMap(data){
        if( map && data && data.length ){

            let coords = locationsForSearchResults(data);

            centerMapOnLocations(coords);
              
            var heatmap = new google.maps.visualization.HeatmapLayer({
                data: coords
            });
            heatmap.setMap(map);
        } 
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


// function getsGmapsLoc (userInputCountry, userInputCity){
    
//     let GMAPS_RESPONSE = GMAPS_GEOCODE_URL + `addess=${userInputCity},+${userInputCountry}&key=${GMAPS_API_KEY}`
//     console.log('GMAPS JSON URL RESPONSE:', GMAPS_RESPONSE);

//     return fetch (GMAPS_RESPONSE)
//     .then (response => response.json())
    

// }





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
