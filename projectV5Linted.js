/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable indent */
// eslint-disable-next-line no-undef
// eslint-disable-next-line func-names
// eslint-disable-next-line no-undef
$(function () {
    console.log('Get funky'); // Document Ready

    const ADZUNA_BASE_URL = 'https://api.adzuna.com/v1/api/';
    const ADZUNA_KEY = 'b22271cad1b74c76f8c6ec3587c34e86';
    const ADZUNA_APP_ID = 'e76d0c45';

    const GMAPS_GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?';
    const GMAPS_API_KEY = 'AIzaSyDugko09xbH7YY4avMUTZJNsA3uKHcuTeI';

    // Gets general Job Search Data: Total Count + Salary Mean
    function getAdzunaJobSearch(userInputCountry, userInputCity, jobCategory) {
        const AdzunaJobSearchResponse = `${ADZUNA_BASE_URL
         }jobs/${userInputCountry}/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_KEY}&where=${userInputCity}&category=${jobCategory}&content-type=application/json`;

        console.log('The Job Search Response URL is:', AdzunaJobSearchResponse);

        return fetch(AdzunaJobSearchResponse, {
            headers: {
                Accept: 'application/json',
            },
        })
        .then(response => response.json())
        .catch(err => console.error(err));
    }


    // Converts Job and Location response into HTML
    function resultsHTML(jobsAndLocData) {

        console.log('This is the data being passed before displaying the results in HTML. Should be an Array:', jobsAndLocData);

        return `
                <label>Location
                    <span>${jobsAndLocData[1].results[0].formatted_address}</span>
                </label>
                <label>Job Count
                    <span>${jobsAndLocData[0].count}</span>
                </label>
                <label>Salary Mean
                    <span>${jobsAndLocData[0].mean}</span>
                </label>`;
    }

    // Displays results in HTLM
    function displayResults(data) {
        console.log('Results that will be displayed in HTML looks like this first:', data);
            $('#results').append(resultsHTML(data));
    }

    // GeoCodes location selected by user
    function getsGMAPSObj(userInputCountry, userInputCity) {
        const GMAPS_RESPONSE = `${GMAPS_GEOCODE_URL}address=${userInputCity}+${userInputCountry}&key=${GMAPS_API_KEY}`;
        console.log('GMAPS JSON URL RESPONSE:', GMAPS_RESPONSE);

        return fetch(GMAPS_RESPONSE)
        .then((response) => {
            if (response.ok) {
                return response.json();
            }
            // NETWORK OK BUT WEB ERROR
            return Promise.reject(response.body);
        })
        .catch(err => console.error('Error from Gmaps:', err))
        .then((data) => {
 console.log('Google Maps JSON response:', data);
            return data;
        });
    }




    // Centers the map based on the users two selected locations
    function centerMap(jobsAndLocData) {
        // Obtains Latitude for Locations 1 & 2
        const lat1 = jobsAndLocData[0][1].results[0].geometry.location.lat;
        const lat2 = jobsAndLocData[1][1].results[0].geometry.location.lat;

        // Obtains Longitude for Locations 1 & 2
        const lng1 = jobsAndLocData[0][1].results[0].geometry.location.lng;
        const lng2 = jobsAndLocData[1][1].results[0].geometry.location.lng;

        
        // Location 1 Lat/Lng
        const loc1LatLng = {lat1, lng1};
        console.log('Location 1 Lat/Lng:', loc1LatLng);
        console.log('Lat1/Lng1', lat1, lng1);
        
        // Location 2 Lat/Lng
        const loc2LatLng = {lat2, lng2};
        console.log('Location 2 Lat/Lng:', loc2LatLng);
        console.log('Lat2/Lng2', lat2, lng2);

        // Calculates Center of Latitude and Longitude coordinates respectively
        const latCen = (lat1 + lat2) / 2;
        const lngCen = (lng1 + lng2) / 2;

        // Logs results
        console.log('Computed Latitude center is:', latCen);
        console.log('Computed Longitude center is:', lngCen);

        latLngCen = { latCen, lngCen };

        console.log('The Latitude and Longitude CENTER Oject Location is representated as such:', latLngCen);


        const geoCenLat = latLngCen.latCen;
        const geoCenLng = latLngCen.lngCen;

        console.log('This is the GeoCenLat:', geoCenLat);
        console.log('This is the geoCenLng:', geoCenLng);

        const GMLL = new google.maps.LatLng(geoCenLat, geoCenLng);
        // GMLL = Google Maps Latitude and Longitude

        console.log('This is the Map Lat/Long... Object?', GMLL);

    
        map.setCenter(GMLL);
        // Need to make the map keep the two locations in bound somehow -------!!!!!!!!!!

    }

    // Joins JSON data sets for Job and Location

    function jobLocObjJoiner (jobData, locData) {

        let jobLocDataSet = Promise.all([jobData, locData])
        // let jobsAndLocData = jobLocDataSet
        .then(jobLocDataSet => {displayResults(jobLocDataSet)
            return jobLocDataSet
        });

        return jobLocDataSet;
    }



// Adds 2 Circles to the map, representing the Total Job Count in each city ----- THIS DOESN'T WORK!!!!!!!!!

    function addCirclesToMap(jobsAndLocData) {
        console.log('This is the data being passed to add the circles:', jobsAndLocData);

        // Centers the map
        centerMap(jobsAndLocData);

        // Construct the circle for each loc in locationsArr.
        // Note: We scale the area of the circle based on the Job Count.
        return jobsAndLocData.map((location) => {
          // Add the circle for this location to the map.
          return new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map,
            center: location.center,
            radius: Math.sqrt(jobsAndLocData.count) * 100,
          });
        });
      }

    // Submit Button

    function submitHandler() {
        // eslint-disable-next-line prefer-arrow-callback
        $('form').submit(function (e) {
            e.preventDefault();

            // OBTAIN USER INPUT LOCATIONS:
            // Obtain Location 1
            const userInputCountry = $('#userInputCountry').val();
            const userInputCity = $('#userInputCity').val().trim();

            // Obtain Location 2
            const userInputCountry2 = $('#userInputCountry2').val();
            const userInputCity2 = $('#userInputCity2').val().trim();

            // OBTAIN USER JOB CATEGORY
            const jobCategory = $('#userInputJobCategory').val();

            // Logs User Input selection
            console.log('Submit Button was clicked');
            console.log('This is the captured User Input for the COUNTRY:', userInputCountry);
            console.log('This is the captured User Input for the CITY:', userInputCity);

            console.log('This is the captured User Input for the 2nd COUNTRY:', userInputCountry2);
            console.log('This is the captured User Input for the 2nd CITY:', userInputCity2);

            console.log('This is the captured User Input for the JOB CATEGORY:', jobCategory);

            $('#results').html('');


            // DOES THE MAIN SUBMIT HANDLER THINGS
            let jobLocDataset1 = jobLocObjJoiner(getAdzunaJobSearch(userInputCountry, userInputCity, jobCategory), getsGMAPSObj(userInputCountry, userInputCity));


            let jobLocDataset2 = jobLocObjJoiner(getAdzunaJobSearch(userInputCountry2, userInputCity2, jobCategory), getsGMAPSObj(userInputCountry2, userInputCity2));

            let finalPromise = [jobLocDataset1, jobLocDataset2];

            Promise.all(finalPromise)
            .then (data => {console.log('This is the Datas Final Form', data)
            
                return data
            })
            .then (data => addCirclesToMap (data))

        });
    }
    submitHandler();
});


// Initializes Map
// eslint-disable-next-line no-unused-vars
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37.77439, lng: -122.419416 },
        zoom: 9,
        });

        infoWindow = new google.maps.InfoWindow();

        // Get User Location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
            // eslint-disable-next-line prefer-const
            let pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
            }, function () {
            handleLocationError(true, infoWindow, map.getCenter());
            });
        } else {
        // Browser doesn't support Geolocation
        handleLocationError(false, infoWindow, map.getCenter());
        }
    }


// Pretty sure I don't need this:
// var map;


// Circle drawer sample https://developers.google.com/maps/documentation/javascript/examples/circle-simple
