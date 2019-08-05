$(function () {
    let circles = [];
    let bounds = { north: NaN, east: NaN, south: NaN, west: NaN };

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

    function tryAllCities(country1, city1, country2, city2, jobCategory){
        getLocAndJobForCity(country1, city1, jobCategory)
        .then(city1results => {
            displayResults(city1results);
        })
        .catch( city1error => {
            console.log('city 1 error:', city1error.message);
            console.error(city1error);
        });

        // --- not dependent on each other
        getLocAndJobForCity(country2, city2, jobCategory)
        .then(city2results => {
            displayResults(city2results);
        })
        .catch( city2error => {
            console.log('city 2 error:', city2error.message);
            console.error(city2error);

        });
;

    }

    function getLocAndJobForCity(countryName, cityName, jobCategory){
        return getsGMAPSObj(countryName, cityName)
        .catch( err => {
            // this means no city was found in geolocation
        })
        .then(locData =>
            getAdzunaJobSearch(countryName, cityName, jobCategory)
            .then( jobsData => {
                return {
                    loc: locData,
                    jobs: jobsData
                }
            })
        )
        .catch( adzunaErr => {
            console.log("it would be interesting to know how we got here, when geolocation succeeds but adzuna doesn't");
            // this means that adzuna choked on the city name that google didn't choke on
        })
    }




    // Converts Job and Location response into HTML
    function resultsHTML(city) {


        if( city.loc.results && city.loc.results.length ){
            // WE HAVE LOC RESULTS! GO FOR LAUNCH?

            if( city.jobs.results && city.jobs.results.length ){
                // DO WE ALSO HAVE JOB RESULTS?????

                const jobData = city.jobs;
                const jobCount = jobData.count;
                const mean = jobData.mean;
                const location = city.loc.results[0].formatted_address;
    
                if (mean === undefined) {
                    return `
                    <section class="result" role="show-result">
                        <label class="result" id="noData" aria-errormessage="not enough job data for location">Not enough Job Data for ${location} because the Aduzna API isn't very good. No map marker will be shown on map</label>                
                    </section>`;
                }
    
    
                console.log('This is the data being passed before displaying the results in HTML. Should be a jobs/loc object for a city:', city);
    
            return `
            <section class="result" role="show-result">
                    <label class="result label" aria-label="Location">Location
                        <span class="displayedData" aria-label="result location">${location}</span>
                    </label>
                    <label class="result label" aria-label="Job-Count">Job Count
                        <span class="displayedData" aria-label="result job count">${jobCount}</span>
                    </label>
                    <label class="result label" aria-label="Salary-Mean">Salary Mean
                        <span class="displayedData" aria-label="result job mean">${mean}</span>
                    </label>
            </section>
                    `;


            } else {
                // either no results object or a valid results array with 0 elements in it
                // either way, "Not found" or "No results" is valid feedback to the user
                $('#errormessage').html('Results not found.');
            }

        } else {

            // GEOLOCATION ERROR FOR THIS CITY...
            // but what does that mean if we also have job results?

        }

        console.log('Play', jobs[0]);
           
    }

        // GOOD ABSTRACTION, inside which has frustrating bullshit we want to ignore for now
    function addCityToMapBounds(cityBounds){

        if( isNaN(bounds.north) || cityBounds.northeast.lat > bounds.north ){
            // set incoming cityBounds as global bounds true north
            bounds.north = cityBounds.northeast.lat;
        }

        if( isNaN(bounds.south) || cityBounds.southwest.lat < bounds.south ){
            // set incoming cityBounds as global bounds true south
            bounds.south = cityBounds.southwest.lat;
        }

        if( isNaN(bounds.east) || cityBounds.northeast.lng > bounds.east ){
            // set incoming cityBounds as global bounds true east
            bounds.east = cityBounds.northeast.lng;
        }

        if( isNaN(bounds.west) || cityBounds.southwest.lat < bounds.west ){
            // set incoming cityBounds as global bounds true west
            bounds.west = cityBounds.southwest.lng;
        }

    }

    function zoomToMapBounds(){
        // center map on the global bounds
        console.log("Asking google to center map on bounds: ", JSON.stringify(bounds) )
        // wait until this point to make an actual google lat lng bounds object
        map.fitBounds(bounds);   // not working cause bounds suck
    }


    // Displays results in HTML for ONE city
    function displayResults(data) {
        // put circle on map and track it
        let newCircle = addCircleToMap(data);
        circles.push(newCircle);

        let cityBounds = data.loc.results[0].geometry.bounds;

        console.log('CITY BOUNDS:', cityBounds);

        addCityToMapBounds(cityBounds)

        zoomToMapBounds();
            
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

        // Location Error handling Attempts 
            if (!data || !Array.isArray(data.results) || !data.results.length )  {
                console.log('THIS IS A MAJOR GEOLOCATION ERROR');
                // throw new Error(`Failed to geolocate: "${userInputCity}, ${userInputCountry}"`);
            }

            return data;
        })
        .then( data => {
            console.log('This is the data:', data, 'Playing with it now:', data.status);
            console.log('Status:', data.status);

            locErrorCheck(data)

            return data
        });
    }


    function locErrorCheck (data) {

        if (data.status === 'ZERO_RESULTS') {
            console.log('THIS IS THE STATUS ERROR:', data.status);
            return locErrorHTML();
        }
        else if (data.results[0].types[0] != 'locality') {
            console.log('This is a Locality Error', data.results[0].types);
            return locErrorHTML();
        } 
        else {
            return data
        }


    }


    // Location Error Handler Function maybe? 
    function locErrorHTML () {
        
        locErrMsg = `
        <section class="result" role="show-result">
            <label class="result" id="noData" aria-errormessage="status error">No Location Information found. Please check what you entered. Must be 2 valid locations</label>                
        </section>
        `

        return $('#results').append(locErrMsg);

}

    // Centers the map based on the users two selected locations
    function centerMap(jobsAndLocData) {

        let { jobs, loc } = jobsAndLocData;

        // Sets Bound Path
        const boundPath1 = jobs[1].results[0].geometry.bounds
        const boundPath2 = jobsAndLocData[1][1].results[0].geometry.bounds

        // Sets Location Path
        const location1 = jobs[1].results[0].geometry.location;
        const location2 = jobsAndLocData[1][1].results[0].geometry.location;
        
        // Obtains Latitude for Locations 1 & 2
        const lat1 = location1.lat;
        const lat2 = location2.lat;

        // Obtains Longitude for Locations 1 & 2
        const lng1 = location1.lng;
        const lng2 = location2.lng;

        // Location 1 Lat/Lng
        const loc1LatLng = { lat: lat1, lng: lng1 };
        console.log('Location 1 Lat/Lng:', loc1LatLng);
        console.log('Lat1/Lng1', lat1, lng1);

        // Location 2 Lat/Lng
        const loc2LatLng = { lat: lat2, lng: lng2 };
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
        map.setCenter(GMLL);

        console.log('This is the Map Lat/Lng Object', GMLL);

        let viewPortBounds = boundingBoxForAllCoords(boundPath1, boundPath2)
    
        const padding = {
                right: 75,
                left: 75,
                top: 75,
                bottom: 75,
            };
            return map.fitBounds(viewPortBounds, padding);
        }

    // Sets the Bounding Box
    function boundingBoxForAllCoords (bounds1, bounds2) {

        let newNEBound = [];
        let newSWBound = [];

        let n; // North
        let e; // East
        let s; // South
        let w; // West

        // Most North (Lat) Bound
        if (bounds1.northeast.lat > bounds2.northeast.lat) {
            n = bounds1.northeast.lat;
        } else {
            n = bounds2.northeast.lat;
        }

        // Most East (Lng) Bound
        if (bounds1.northeast.lng > bounds2.northeast.lng) {
            e = bounds1.northeast.lng;
        } else {
            e = bounds2.northeast.lng;
        }

        // Most South (Lat) Bound
        if (bounds1.southwest.lat < bounds2.southwest.lat) {
            s = bounds1.southwest.lat;
        } else {
            s = bounds2.southwest.lat;
        }

        // Most West (Lng) Bound
        if (bounds1.southwest.lng < bounds2.southwest.lng) {
            w = bounds1.southwest.lng;
        } else {
            w = bounds2.southwest.lng;
        }

        // Arrarys of new SW and NE Lat/Lng Bounds
        newSWBound = toObject([s, w]);
        newNEBound = toObject([n, e]);

        console.log('This is the new SW Bound:', newSWBound);
        console.log('This is the new NE Bound:', newNEBound);

        // Lat/Lng Boudns map object
        const latLngBounds = new google.maps.LatLngBounds(newSWBound, newNEBound);

        console.log('This is the Lat/Lng BOUNDS Obj:', latLngBounds);

        return latLngBounds
    };

    // Converts Arr into Lat/Lng Obj
    function toObject(arr) {
        var latLngObj = {};
        for (var i = 0; i < arr.length; ++i)
            latLngObj[i] = arr[i];
            console.log('This is the converted Arr into Obj', latLngObj);        

        return {
            lat: arr[0],
            lng: arr[1]
        };
    }


    function addCircleToMap(cityResult) {
        // Note: We scale the area of the circle based on the Job Count.
        console.log('adding circle for city result:', cityResult);
        let { jobs, loc } = cityResult;

          // Add the circle for this location to the map.

        const jobCount = jobs.count;
        console.log('This is the obtained job Count:', jobCount);

        const location = loc.results[0].geometry.location;
        console.log('This is the obtained lat/lng of the location:', location);

        if (jobCount <= 100) {
            return 
        } else {
            return new google.maps.Circle({
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#FF0000',
                fillOpacity: 0.35,
                map,
                center: location,
                radius: jobCount * 100,
            });
        }
    }

    // Submit Button
    function submitHandler() {

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
            console.log('Submit Button was clicked. Here is captured data: ',
                { userInputCountry, userInputCity, userInputCountry2, userInputCity2, jobCategory }
            );

            // Displays the results on DOM
            $('#results').html('');

            // DOES THE MAIN SUBMIT HANDLER THINGS:

            return tryAllCities(userInputCountry, userInputCity, userInputCountry2, userInputCity2, jobCategory);
        });
    }
    submitHandler();
});

// function deleteAllCircles () {
//     for (var i = 0; i < circles.length; i++) {
//         circles[i].setMap(null);
//       }
//     circles =[];
// }


// Initializes Map
function initMap() {
    // bounds = new google.maps.LatLngBounds();
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37.77439, lng: -122.419416 },
        zoom: 9,
        mapTypeId: 'roadmap',
        });

        infoWindow = new google.maps.InfoWindow();

        // Get User Location
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
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