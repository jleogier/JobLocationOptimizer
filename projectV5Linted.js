/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable indent */
// eslint-disable-next-line no-undef
// eslint-disable-next-line func-names
// eslint-disable-next-line no-undef
$(function () {
    console.log('Get funky');

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


    // Converts Total Job Count and Salary Mean response into HTML
    function resultsHTML(countAndLocArr) {

        console.log('This is the data being passed before displaying the results. Should be an Array', countAndLocArr);
        console.log('Now I have to try to work with it somehow. Here are the attempts:', Promise.resolve(countAndLocArr[0].PromiseValue));

        return `
                <label>Location
                    <span>${countAndLocArr[1].formatted_address}</span>
                </label>
                <label>Job Count
                    <span>${countAndLocArr[0].count}</span>
                </label>
                <label>Salary Mean
                    <span>${countAndLocArr[0].mean}</span>
                </label>`;
    }

    // Displays Job Count & Mean Salary results in HTLM
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




    // Calculates the Center of the two locations selected by the user
    function getCentOfTwoLocs(locArr) {
        // Obtains Latitude for Locations 1 & 2
        const lat1 = locArr[0].results[0].geometry.location.lat;
        const lat2 = locArr[1].results[0].geometry.location.lat;

        // Obtains Longitude for Locations 1 & 2
        const lng1 = locArr[0].results[0].geometry.location.lng;
        const lng2 = locArr[1].results[0].geometry.location.lng;

        console.log('Lat1/Lng1', lat1, lng1);
        console.log('Lat2/Lng2', lat2, lng2);

        // Calculates Center of Latitude and Longitude coordinates respectively
        const latCen = (lat1 + lat2) / 2;
        const lngCen = (lng1 + lng2) / 2;

        // Logs results
        console.log('Computed Latitude center is:', latCen);
        console.log('Computed Longitude center is:', lngCen);

        latLngCen = { latCen, lngCen };

        console.log('The Latitude and Longitude CENTER Oject Location is representated as such:', latLngCen);

        return latLngCen;
    }


    // Centers the map equidistance from the two locations selected by the user
    function centerMap(latLngCen) {

        const geoCenLat = latLngCen.latCen;
        const geoCenLng = latLngCen.lngCen;

        console.log('This is the GeoCenLat:', geoCenLat);
        console.log('This is the geoCenLng:', geoCenLng);

        const GMLL = new google.maps.LatLng(geoCenLat, geoCenLng);
        // GMLL = Google Maps Latitude and Longitude

        console.log('This is the Map Lat/Long... Object?', GMLL);

        return map.setCenter(GMLL);
    }

// This should almost work somehow though I need to pass in the
// Job data and GMLL (Lat/Lng Obj Lit for the center) Must package both forms of data
// to pass to this circle making function


    function jobLocObjJoiner (jobData, locData) {

        let jobCount = Promise.resolve(jobData);
        let location = locData;

        console.log('This is the Job Count acquired by the Job Count and Location Joiner function:', jobCount);
        console.log('This is the location acquired by the Job Count and Location Joiner function:', location);

        let countAndLocArr = [jobCount, location];

        console.log('This is the countAndLocArr being returned by the Job Count and Location Joiner function:', countAndLocArr);

        displayResults(countAndLocArr);

        return countAndLocArr;
    }




    function addCirclesToMap(countAndLocArr) {

        // Construct the circle for each loc in locationsArr.
        // Note: We scale the area of the circle based on the Job Count.
        return countAndLocArr.map((location) => {
          // Add the circle for this location to the map.
          return new google.maps.Circle({
            strokeColor: '#FF0000',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#FF0000',
            fillOpacity: 0.35,
            map,
            center: location.center,
            radius: Math.sqrt(job.count) * 100,
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

            jobLocObjJoiner(getAdzunaJobSearch(userInputCountry, userInputCity, jobCategory), getsGMAPSObj(userInputCountry, userInputCity))
            // .then((countAndLocArr) => { addCirclesToMap(countAndLocArr); });

            jobLocObjJoiner(getAdzunaJobSearch(userInputCountry2, userInputCity2, jobCategory), getsGMAPSObj(userInputCountry2, userInputCity2))
            // .then((countAndLocArr) => { addCirclesToMap(countAndLocArr); });






            // getCentOfTwoLocs(getsGMAPSObj(userInputCountry, userInputCity), getsGMAPSObj(userInputCountry2, userInputCity2))
            // .then(centerMap);







            // Pass center coords (GMLL) + job data to final map to produce circles  .then(stuff)
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
