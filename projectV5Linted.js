/* eslint-disable no-undef */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable prefer-arrow-callback */
/* eslint-disable indent */
// eslint-disable-next-line no-undef
// eslint-disable-next-line func-names
// eslint-disable-next-line no-undef


let circles = [];

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


        const location = jobsAndLocData[1].results[0].formatted_address;

        const jobData = jobsAndLocData[0];

        const jobCount = jobData.count;

        const mean = jobData.mean;
            if (mean === undefined) {
                return `
                <section class="result" role="show-result">
                <label class="result" id="noData" aria-errormessage="not enough job data for location">Not enough Job Data for ${location} because the Aduzna API sucks. No map marker will be shown</label>                
                </section>`;

            } else {
                mean;
            }

        console.log('This is the data being passed before displaying the results in HTML. Should be an Array:', jobsAndLocData);

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

        viewportSetter (jobsAndLocData);

        const location1 = jobsAndLocData[0][1].results[0].geometry.location;
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

        console.log('This is the Map Lat/Long... Object?', GMLL);

        // Need to make the map keep the two locations in bound somehow -------!!!!!!!!!!

        // determine lat/lng bounds NE/SW before creating bounds



    //     const latLngBounds = new google.maps.LatLngBounds(loc2LatLng, loc1LatLng);

    //     const padding = {
    //         right: 75,
    //         left: 75,
    //         top: 75,
    //         bottom: 75,
    //     };

    //     map.fitBounds(latLngBounds, padding);
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


    async function biggerThanCalculator (num1, num2) {
        if (num1 > num2) {
            return num1
        } else {
            return num2
        }
    };

    async function smallerThanCalculator (num1, num2) {
        if (num1 < num2) {
            return num1
        } else {
            return num2
        }
    }

    // NE/SW fixer

    function viewportSetter (data) {

    console.log('This is the viewport Data set', data);

    let newNEBound = [];
    let newSWBound = [];

    const loc1NELat = data[0][1].results[0].geometry.bounds.northeast.lat;
    const loc1NELng = data[0][1].results[0].geometry.bounds.northeast.lng;

    console.log('This is the obtained Location 1 NorthEast Lat Bound:', loc1NELat);
    console.log('This is the obtained Location 1 NorthEast Lng Bound:', loc1NELng);


    const loc1SWLat = data[0][1].results[0].geometry.bounds.southwest.lat;
    const loc1SWLng = data[0][1].results[0].geometry.bounds.southwest.lng;

    console.log('This is the obtained Location 1 SouthWest Lat Bound', loc1SWLat);
    console.log('This is the obtained Location 1 SouthWest Lng Bound', loc1SWLng);


    const loc2NELat = data[1][1].results[0].geometry.bounds.northeast.lat;
    const loc2NELng = data[1][1].results[0].geometry.bounds.northeast.lng;

    console.log('This is the obtained Location 2 NorthEast Lat Bound', loc2NELat);
    console.log('This is the obtained Location 2 NorthEast Lng Bound', loc2NELng);

    const loc2SWLat = data[1][1].results[0].geometry.bounds.southwest.lat;
    const loc2SWLng = data[1][1].results[0].geometry.bounds.southwest.lng;

    console.log('This is the obtained Location 2 SouthWest Lat Bound', loc2SWLat);
    console.log('This is the obtained Location 2 SouthWest Lng Bound', loc2SWLng);


    neLatBound = 
                biggerThanCalculator(loc1NELat, loc2NELat)
                .then (biggestNELat => {
                    let newNELat = biggestNELat
                    return newNELat
                });

                console.log('This is the returned promise value for New NE Lat Bound',neLatBound)

    neLngBound = 
                biggerThanCalculator(loc1NELng, loc2NELng)
                .then (biggestNELng => {
                    let newNELng = biggestNELng
                    return newNELng
                });

    console.log('This is the returned promise value for New NE Lng Bound',neLngBound)
    
    swLatBound = 
                smallerThanCalculator(loc1SWLat, loc2SWLat)
                .then (smallestSWLat => {
                    let newSWLat = smallestSWLat
                    return newSWLat
                })
    

    swLngBound = 
                smallerThanCalculator(loc1SWLng, loc2SWLng)
                .then (smallestSWLng => {
                    let newSWLng = smallestSWLng
                    return newSWLng
                })

    // let newNEBound = Promise.all(newNEBound.concat(newNELat,newNELng))
    // let newSWBound = Promise.all(newSWBound.concat(newSWLat, newSWLng))

    // console.log('This is the new NE Lat bound', neLatBound);
    // console.log('This is the new NE Lng bound', neLngBound);

    newNEBound = Promise.all([neLatBound, neLngBound])
    // .then (data => data)
    console.log('This is the New NE Bound:', newNEBound);

    newSWBound = Promise.all([swLatBound, swLngBound])
    // .then (data => data)
    console.log('This is the New SW Bound:', newSWBound)

    const latLngBounds = new google.maps.LatLngBounds(newSWBound.PromiseValue, newNEBound.PromiseValue);

    console.log('This is the Lat/Lng Bounds Object:', latLngBounds);

    console.log('This is suppose to be the NE corner of the Lat/Lng bound:', latLngBounds.getNorthEast())

    const padding = {
        right: 75,
        left: 75,
        top: 75,
        bottom: 75,
    };

    return map.fitBounds(latLngBounds, padding);




    // REFACTORED - SHOULD BE ABLE TO DELETE
    // // Finds correct NE Lat bound
    //  if (loc1NELat > loc2NELat) {
    //     let newNELat = loc1NELat;
    // } else {
    //     let newNELat = loc2NELat;
    // }

    // // Finds correct NE Lng bound
    // if (loc1NELng > loc2NELng) {
    //     let newNELng = loc1NELng
    // } else {
    //     let newNELng = loc2NELng
    // }


    // // Finds correct SW Lat bound
    // if (loc1SWLat > loc2SWLat) {
    //     let newSWLat = loc1SWLat
    // } else {
    //     let newSWLat = loc2SWLat
    // }

    // // Finds correct SW Lng bound
    // if (loc1SWLng > loc2SWLng) {
    //     let newSWLng = loc1SWLng
    // } else {
    //     let newSWLng = loc2SWLng
    // }

}













    function addCirclesToMap(jobsAndLocData) {
        console.log('This is the data being passed to add the circles:', jobsAndLocData);



        // Construct the circle for each loc in locationsArr.
        // Note: We scale the area of the circle based on the Job Count.
        return jobsAndLocData.map((location) => {
          // Add the circle for this location to the map.

            const jobCount = location[0].count;
            console.log('This is the obtained job Count:', jobCount);

            const loc = location[1].results[0].geometry.location;
            console.log('This is the obtained lat/lng of the location:', loc);


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
                    center: loc,
                    radius: jobCount * 100,
                  });
            }
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
            .then (data => {
                // centerMap(data)
                viewportSetter(data);

            let newCircles = addCirclesToMap (data);
            circles.concat(newCircles);
            })
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
// eslint-disable-next-line no-unused-vars
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 37.77439, lng: -122.419416 },
        zoom: 9,
        mapTypeId: 'roadmap',
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
