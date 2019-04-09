$(function() {
    console.log("Get funky");

    const GMAPS_GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?'
    const GMAPS_API_KEY = 'AIzaSyDugko09xbH7YY4avMUTZJNsA3uKHcuTeI';
    var map;

// Working with the Adzuna API

    const ADZUNA_BASE_URL = 'http://api.adzuna.com/v1/api/';
    const ADZUNA_KEY = 'b22271cad1b74c76f8c6ec3587c34e86';
    const ADZUNA_APP_ID = 'e76d0c45';
    
    // https://api.adzuna.com/v1/api/jobs/us/history?app_id=e76d0c45&app_key=b22271cad1b74c76f8c6ec3587c34e86&location0=UK&location1=london&category=it-jobs&content-type=application/json

    // http://api.adzuna.com/v1/api/property/gb/search/1?app_id={YOUR_APP_ID}&app_key={YOUR_APP_KEY}


    function getAdzunaJobHistory (userInputCountry, userInputCity, jobCategory) {
        
        let adzunaHistoryResponse = ADZUNA_BASE_URL + `jobs/gb/history?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_KEY}&location0=${userInputCountry}&location1=${userInputCity}&category=${jobCategory}&content-type=application/json`;

        console.log(adzunaHistoryResponse);

         return fetch (adzunaHistoryResponse, {
             headers: {
                 Accept: 'application/json'
             }
        })
        .then (response => /*Error Handler*/ response.json())   
        .then(data => console.log(data))
        .then(data => displayResults(data));
    }

    function displayResults (data) {
        let historyHTML = data.month.map(displayHistory).join(`\n`);
        $('#results').html(historyHTML);

    }

    function displayHistory (data) {
        return `History: ${data.month}`
    }


    // Initializes Map 
    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 34.052234, lng: -118.243685},
        zoom: 9
      });
    }


    function submitHandler () {

        $('form').submit(function (e) {
            
            e.preventDefault();

            // Gets User Input

            let userInputCountry = $('#userInputCountry').val().trim();
            let userInputCity = $('#userInputCity').val().trim();
            let jobCategory = $('#userInputJobCategory').val().trim();

            // Logs User Input
        
            console.log('Submit Button was clicked');
            console.log('This is the captured User Input for the COUNTRY:', userInputCountry);
            console.log('This is the captured User Input for the CITY:', userInputCity);
            console.log('This is the captured User Input for the JOB CATEGORY:', jobCategory);

            // Does the things

            getAdzunaJobHistory (userInputCountry, userInputCity, jobCategory);

            displayResults(data);

        });
        

    }

 



    getAdzunaJobHistory();

    submitHandler();

    initMap ();
});