$(function() {
    console.log("Get funky");

    const ADZUNA_BASE_URL = 'https://api.adzuna.com/v1/api/';
    const ADZUNA_KEY = 'b22271cad1b74c76f8c6ec3587c34e86';
    const ADZUNA_APP_ID = 'e76d0c45';

    const GMAPS_GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?'
    const GMAPS_API_KEY = 'AIzaSyDugko09xbH7YY4avMUTZJNsA3uKHcuTeI';

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


    // Converts Total Job Count and Salary Mean response into HTML
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

    function geoCodesLoc (userInputCountry, userInputCity){
    
        let GMAPS_RESPONSE = GMAPS_GEOCODE_URL + `addess=${userInputCity},+${userInputCountry}&key=${GMAPS_API_KEY}`
        console.log('GMAPS JSON URL RESPONSE:', GMAPS_RESPONSE);
    
        return fetch (GMAPS_RESPONSE)
        .then (response => {
            if (response.ok) {
                return response.json()
            }            
            // NETWORK OK BUT WEB ERROR
            return Promise.reject (response.body)
        })
        .catch(err => console.log('Error from Gmaps for Geocoding:', err))
        .then (data => {console.log('Google Maps ', data)
            return data
        })
        .then (data => latLngGetter(data))
    }

    function latLngGetter (data) {
        let latitude = data[0].geometry.location.lat;
        let longitude = data[0].geometry.location.lng;
        
        console.log('The obtained Latitude is', latitude);
        console.log('The obtained Longitude is', longitude);
        
        let latLngLoc = {latitude, longitude};

        console.log ('The Latitude and Longitude Oject Location is representated as such:', latLngLoc)

        return latLngLoc
    }


    // Calculates the Center of the two locations selected by the user
    function getCentOfTwoLocs (loc1, loc2) {
        // Obtains Latitude for Locations 1 & 2
        let lat1 = loc1.latitude;
        let lat2 = loc2.latitude;

        // Obtains Longitude for Locations 1 & 2
        let lng1 = loc1.longitude;
        let lng2 = loc2.longitude;

        // Calculates Center of Latitude and Longitude coordinates respectively
        let latCen = computeDistanceBetween(lat1, lat2) / 2;
        let lngCen = computeDistanceBetween(lng1, lng2) / 2;

        // Logs results
        console.log('Computated Latitude center is:', latCen);
        console.log('Computated Longitude center is:', lngCen);

        latLngCen = {latCen, lngCen}

        console.log ('The Latitude and Longitude CENTER Oject Location is representated as such:', latLngCen);

        return latlngCen
    }


    // Centers the map equidistance from the two locations selected by the user
    function centerMap (coordinatesObj) {
        
        let geoCenLat = coordinatesObj.latCen;
        let geoCenLng = coordinatesObj.lngCen;
        
        let GMLL = new google.maps.LatLng(geoCenLat, geoCenLng) // GMLL = Google Maps Latitude and Longitude
        
        return GMLL
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

            // OBTAIN USER JOB CATEGORY
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

            // Makes 1st call to get job data based on user selected location
            let city1jobs = getAdzunaJobSearch (userInputCountry, userInputCity, jobCategory)
            // Displays Job data (Salary Mean and Total Available Count)
            .then(data => {
                displayAdzunaJobSearch(data)
                // GeoCodes user 1st selected locations
                return geoCodesLoc(userInputCountry, userInputCity)            
            })


            // Makes 2nd call to get job data based on user selected location
            let city2jobs = getAdzunaJobSearch (userInputCountry2, userInputCity2, jobCategory)
            // Displays Job data (Salary Mean and Total Available Count)
            .then(data => {
                displayAdzunaJobSearch(data)
                // GeoCodes user 2nd selected location
                return geoCodesLoc(userInputCountry2, userInputCity2)
            })



            let promises = [city1jobs, city2jobs];
            Promise.all(promises)
            .catch (err => console.log('All Promises did not work', err))
            // Takes the GeoCodes and calculates the center of the two locations
            .then (getCentOfTwoLocs)
            // Uses new coordinates to center map on new coordinates
            .then (centerMap)
        });
    }
    submitHandler();
});




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


// Heat Map Stuff??



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
