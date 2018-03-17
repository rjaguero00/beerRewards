$(document).ready(function(){

    // USER INFO
    // Get user info on 'Submit'
    $("#find-event").on("click", function(event) {
      event.preventDefault();

      // Go ahead as long as inputs are validated.
      if(getEventInputValues()){

        // Capture weight input
        var weight = $('#weight').val().trim();
        $('#weight').val('');
        console.log('Weight: ' + weight);

        // Capture MET number from exercise input
        var workoutMetValue = $('#workout').val();
        $('#workout').val('');
        console.log('MET: ' + workoutMetValue);

        // Capture length of workout
        var workoutLength = $('#activity-length').val().trim();
        $('#activity-length').val('');
        console.log('Workout: ' + workoutLength + 'hrs');

        // Capture beer preference
        var beerPreference = $('#beer-search').val().trim();
        $('#beer-search').val('');
        console.log('Beer preference: ' + beerPreference);

        calories(workoutMetValue, weight);
        searchBreweryDb(beerPreference);

        // Redirect to results page
        // location.href = "results.html";
      } else {
        $("#myModal").modal();
      }
    });

    // Eventful API
    // Global variables
    var eventType;
    var location;

    // Div to hold beer item for list results
    var eventListDiv = $('<div class="event-list-item">');

    // AJAX call to get beer info
    function searchEventful(eventType) {

        var myURL = "http://api.brewerydb.com/v2/search/?key=2d763c46c3991fbfd625ffaea69e88f6&q=" + beerPreference + "&withBreweries=Y";
        $.ajax( {
            url: 'https://corsbridge.herokuapp.com/' + encodeURIComponent(myURL),
            method: "GET"
        }).then(function (response) {

            console.log(response);

            for (var i=0; i<12; i++) {

                beerName = response.data[i].nameDisplay;
                console.log('Beer name: ' + beerName);

                beerStyle = response.data[i].style.name;
                console.log('Beer style: ' + beerStyle);

                abv = response.data[i].abv;
                abv = abv + ' ABV';
                console.log('ABV: ' + abv);

                beerCompany = response.data[i].breweries[0].name;
                beerCompany = 'Brewed by ' + beerCompany;
                console.log(beerCompany);

                breweryLocality = response.data[i].breweries[0].locations[0].locality;
                breweryRegion = response.data[i].breweries[0].locations[0].region;
                breweryLocation = breweryLocality + ', ' + breweryRegion;
                console.log('Location: ' + breweryLocation);

                beerDescription = response.data[i].description;
                console.log('Beer description: ' + beerDescription);

                estimateCalories(abv);

                // Hide instructions
                $('#start-message').hide();

                // Display on results page
                $('#beer-display').append(beerListItemDiv);

            }
        })
    };

    // ADD TO RESULTS
    function displayResults() {

        var row = $('<tr>')
        // Append image here
        //.append('<td>' + beerLogo + '<td>')
        .append('<td>' + '<strong>' + beerName + '</strong>' + ', ' + beerStyle + ', ' + abv + '<br>' + beerCompany + '<br>' + beerDescription + '<br>' + '<br>' + '</td>');

        $('#beer-table > tbody').append(row);
    }
});

  // Form Validation to prevent user from leaving inputs empty
  // #weight, #activity-length, #beer-search
//   function getEventInputValues() {

//     myLocation = $('#weight').val().trim();
//     myEventPreference = $('#activity-length').val().trim();

//     // Tests if 'Weight' input exists.
//     if(weight === "") {
//         //alert("Please enter your weight");
//         $("#weight").val("").focus();
//         return false;
//     // Tests if 'Workout Length' exists.
//     } else if (workoutLength === "") {
//         //alert("Please enter the time of your workout");
//         $("#activity-length").val("").focus();
//         return false;
//     // Tests if 'Beer Preference' exists.
//     } else if (beerPreference === "") {
//         //alert("Please enter a beer preference");
//         $("#beer-search").val("").focus();
//         return false;
//     // If all fields are complete, go ahead.
//     } else {
//         //$('#weight').val("");
//         //$('#activity-length').val("");
//         //$('#beer-search').val("");
//         return true;
//     }
//   }// End of getInputValues()
