$(function() {
    console.log("Get funky");

    const GMAPS_GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?'
    const GMAPS_API_KEY = 'AIzaSyDugko09xbH7YY4avMUTZJNsA3uKHcuTeI';
    

    const ADZUNA_BASE_URL = 'http://api.adzuna.com/v1/api/';
    const ADZUNA_KEY = 'b22271cad1b74c76f8c6ec3587c34e86';
    const ADZUNA_APP_ID = 'e76d0c45';


    // https://api.adzuna.com/v1/api/jobs/us/history?app_id=e76d0c45&app_key=b22271cad1b74c76f8c6ec3587c34e86&location0=UK&location1=london&category=it-jobs&content-type=application/json

    // http://api.adzuna.com/v1/api/property/gb/search/1?app_id={YOUR_APP_ID}&app_key={YOUR_APP_KEY}

    // https://api.adzuna.com:443/v1/api/jobs/gb/history?app_id=e76d0c45&app_key=b22271cad1b74c76f8c6ec3587c34e86&where=london&category=engineering-jobs

    // https://api.adzuna.com:443/v1/api/jobs/us/search/1?app_id=e76d0c45&app_key=b22271cad1b74c76f8c6ec3587c34e86&where=san%20francisco&category=it-jobs




    // Gets general Job Search Data
    function getAdzunaJobSearch (userInputCountry, userInputCity, jobCategory){
        let AdzunaJobSearchResponse = ADZUNA_BASE_URL + `jobs/${userInputCountry}/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_KEY}&where=${userInputCity}&category=${jobCategory}&content-type=application/json`;

        console.log('The Job Search Response is:', AdzunaJobSearchResponse);

        return fetch (AdzunaJobSearchResponse, {
            headers: {
                Accept: 'application/json'
            }
        })

        .then (response => /*Error Handler*/ response.json())
    }


    // Converts Total Count and Salary Mean response into HTML
    function jobCountSalaryHTML (data) {
        // let data = AdzunaJobSearchCountSalary (jobCountSalaryData);

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
        
        let adzunaHistoryResponse = ADZUNA_BASE_URL + `jobs/${userInputCountry}/history?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_KEY}&where=${userInputCity}&category=${jobCategory}&content-type=application/json`;

        console.log('The History Response is:', adzunaHistoryResponse);

         return fetch (adzunaHistoryResponse, {
             headers: {
                 Accept: 'application/json'
             }
        })
        .then (response => /*Error Handler*/ response.json())           
    }
    

    // Displays results in HTLM
    function displayAdzunaJobHistory (data) {  
        console.log('JSON results from history:', data);

        if (data && data.month) {
            $('#results').append(historyHTML(data.month));
        } 
    }

    function displayAdzunaJobSearch (data) {
        console.log('JSON results from job search:', data);
        if (data && data.mean && data.count) {
            $('#results').append(jobCountSalaryHTML(data));
        }        
        // $('#results').html(historyHTML(data.month)).append(jobCountSalaryHTML(jobCountSalaryData));
    }


    // Converts Job History Data to HTML 
    function historyHTML (months) {
        let historyHTML = Object.keys(months).map(key => historyMonthHTML (key, months[key])).join(`\n`);
        return `<div>History:<ol>${historyHTML}</ol></div>`
    }


    // Formats Job History info
    function historyMonthHTML (month, salary) {

        // ADD SORT FUNCTIONALITY 

        return `<li>${month} salary: ${salary}</li>`
    }






    // Update Map

    function updateMap () {

    }

    // Convert user input into Geo Coordinates 


    // Submit Button 

    function submitHandler () {

        $('form').submit(function (e) {
            
            e.preventDefault();

            // Gets User Input
            let userInputCountry = $('#userInputCountry').val();
            let userInputCity = $('#userInputCity').val().trim();
            let jobCategory = $('#userInputJobCategory').val();

            // Logs User Input
            console.log('Submit Button was clicked');
            console.log('This is the captured User Input for the COUNTRY:', userInputCountry);
            console.log('This is the captured User Input for the CITY:', userInputCity);
            console.log('This is the captured User Input for the JOB CATEGORY:', jobCategory);

            $('#results').html('');

            // Does the things
            getAdzunaJobHistory (userInputCountry, userInputCity, jobCategory)
            .then(data => displayAdzunaJobHistory(data));

            getAdzunaJobSearch (userInputCountry, userInputCity, jobCategory)
            .then(data => displayAdzunaJobSearch(data));
        
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