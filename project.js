$(function() {
    console.log("Get funky");

    const GMAPS_GEOCODE_URL = 'https://maps.googleapis.com/maps/api/geocode/json?'
    const GMAPS_API_KEY = 'AIzaSyDugko09xbH7YY4avMUTZJNsA3uKHcuTeI';
    var map;

    const ADZUNA_BASE_URL = 'http://api.adzuna.com/v1/api/';
    const ADZUNA_KEY = 'b22271cad1b74c76f8c6ec3587c34e86';
    const ADZUNA_APP_ID = 'e76d0c45';


    // https://api.adzuna.com/v1/api/jobs/us/history?app_id=e76d0c45&app_key=b22271cad1b74c76f8c6ec3587c34e86&location0=UK&location1=london&category=it-jobs&content-type=application/json

    // http://api.adzuna.com/v1/api/property/gb/search/1?app_id={YOUR_APP_ID}&app_key={YOUR_APP_KEY}

    // https://api.adzuna.com:443/v1/api/jobs/gb/history?app_id=e76d0c45&app_key=b22271cad1b74c76f8c6ec3587c34e86&where=london&category=engineering-jobs

    // https://api.adzuna.com:443/v1/api/jobs/us/search/1?app_id=e76d0c45&app_key=b22271cad1b74c76f8c6ec3587c34e86&where=san%20francisco&category=it-jobs




    // Gets general Job Search Data
    function AdzunaJobSearch (userInputCountry, userInputCity, jobCategory){
        let AdzunaJobSearchResponse = ADZUNA_BASE_URL + `jobs/${userInputCountry}/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_KEY}&where=${userInputCity}&category=${jobCategory}&content-type=application/json`;

        console.log('The Job Search Response is:', AdzunaJobSearchResponse);

        return fetch (AdzunaJobSearchResponse, {
            headers: {
                Accept: 'application/json'
            }
        })
        .then (response => /*Error Handler*/ response.json())
    }


    // Gets Total Job Count and Salary mean from search
    function AdzunaJobSearchCountnSalary (data) {                
        
        let jobCount = data.count;
        let jobSalaryMean = data.mean;

        console.log('Job Count is:', jobCount);
        console.log('Job Salary Mean is:', jobSalaryMean);

        let jobCountnSalaryData = [jobCount, jobSalaryMean];

        return jobCountnSalaryData;
    }


    // Converts Total Count and Salary Mean response into HTML
    function jobCountnSalaryHTML (jobCountnSalaryData) {
        let jobCountSalaryHTML = Object.keys(jobCountnSalaryData);

        return `<div>${jobCountSalaryHTML}</div>`
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
    function displayResults (data) {        
        $('#results').html(historyHTML(data.month)).append(jobCountnSalaryHTML(jobCountnSalaryData));
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



    // Initializes Map 
    function initMap() {
      map = new google.maps.Map(document.getElementById('map'), {
        // center: {lat: 34.052234, lng: -118.243685},
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


            // Does the things
            getAdzunaJobHistory (userInputCountry, userInputCity, jobCategory)
            AdzunaJobSearch (userInputCountry, userInputCity, jobCategory)
            .then(data => displayResults(data));
        });
    }



    getAdzunaJobHistory();
    AdzunaJobSearch();
    AdzunaJobSearchCount();

    AdzunaJobSearchCountnSalary();

    jobCountnSalaryHTML();
    submitHandler();

    initMap ();
});