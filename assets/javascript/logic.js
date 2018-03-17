$(document).ready(function(){

    // SET UP DATABASE

    // Initialize Firebase
    // var config = {
    // };
    // firebase.initializeApp(config);

    // Assign reference to database to var 'database'
    // var database = firebase.database();

    // });



    // USER INFO
    // Get user info on 'Submit'
    $("#find-beer").on("click", function(event) {
      event.preventDefault();

      // Go ahead as long as inputs are validated.
      if(getInputValues()){

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

    // CALCULATE CALORIES
    // Calculate calories burned using MET
    // MET values from https://epi.grants.cancer.gov/atus-met/met.php
    var caloriesBurned = 0;

    function calories(MET, lbWeight) {

        var kgWeight = lbWeight/2.2;
        caloriesBurned = MET * kgWeight;
        console.log('Calories burned: ' + caloriesBurned);
    }

    // BREWERY DB
    // Global variables
    var beerLogo; // <-- Not working properly ***
    var beerName;
    var beerStyle;
    var abv;
    var beerCompany;
    var breweryLocality;
    var breweryRegion;
    var breweryLocation;
    var beerDescription;

    // Div to hold beer item for list results
    var beerListItemDiv = $('<div class="beer-list-item">');

    // AJAX call to get beer info
    function searchBreweryDb(beerPreference) {

        var myURL = "http://api.brewerydb.com/v2/search/?key=2d763c46c3991fbfd625ffaea69e88f6&q=" + beerPreference + "&withBreweries=Y";
        $.ajax( {
            url: 'https://corsbridge.herokuapp.com/' + encodeURIComponent(myURL),
            method: "GET"
        }).then(function (response) {

            console.log(response);

            for (var i=0; i<12; i++) {

            //beerLogo = $('<img>').attr("src", response.data[i].labels.medium);

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

    // CALORIES/12 OZ
    var caloriesEstPer12oz;

    // Estimate calories per 12 oz beer
    function estimateCalories(abv) {
        caloriesEstPer12oz = parseInt(abv) * 2.5 * 12;
        console.log('Calories estimate per 12oz: ' + caloriesEstPer12oz);

        estimateWorkoutWorth(caloriesBurned, caloriesEstPer12oz);
    }

    // # OF BEERS ALLOWED
    // Estimate amount of beer type allowed
    function estimateWorkoutWorth(caloriesBurned, caloriesEstPer12oz) {
        var amountBeersAllowed = caloriesBurned/caloriesEstPer12oz;
        console.log('Amount of beers allowed: ' + amountBeersAllowed);

        displayResults();
    }

    // ADD TO RESULTS
    function displayResults() {

        var row = $('<tr>')
        // Append image here
        //.append('<td>' + beerLogo + '<td>')
        .append('<td>' + '<strong>' + beerName + '</strong>' + ', ' + beerStyle + ', ' + abv + '<br>' + beerCompany + '<br>' + beerDescription + '<br>' + '<br>' + '</td>');

        $('#beer-table > tbody').append(row);
    }
});
// ================================================================== //
  // RECIPE BACKUP STUFF
  //   var keyword;
  //   var minCal = 0;
  //   var maxCal = 0;
  //   var minResults = 0;
  //   var maxResults = 10;

  //   // AJAX call to get nutrient info
  //   function searchRecipes() {

  //       var queryURL = "https://api.edamam.com/search?q=chicken&app_id=6531ba09&app_key=e758518e6f7c22b5c2cdfc78272e0252&from=0&to=12&calories=000-500";

  //       $.ajax( {
  //           url: queryURL,
  //           method: "GET"
  //       }).then(function (response) {

  //           console.log(response);

  //           console.log(response.label);


  //           for (var i=0; i<response.hits.length; i++) {

  //               var recipeDiv = $('<div class="recipe">');
  //               var recipeCard = $('<figure class="item">');

  //               var image = response.hits[i].recipe.image;
  //               var recipeName = response.hits[i].recipe.label;
  //               var calories = (response.hits[i].recipe.calories).toFixed(2) + ' CALORIES';

  //               console.log(recipeName, calories);

  //               recipeDiv.append(
  //                   '<figure class="floatLeft">' + 
  //                       '<img src="' + image + '">' +
  //                       '<figcaption>' + recipeName + '<br>' + calories + '</figcaption>' +
  //                    '</figure>' + '<br>'
  //               );
  //               $('#recipe-display').append(recipeCard);

  //               recipeCard.append('<img src="' + image + '">' + '<figcaption>' + recipeName + '<br>' + calories + '</figcaption>');
  //               // $("#carousel").prepend('<figure class="mySlides">' + '<img src="' + image + '">' + '<figcaption>' + recipeName + '<br>' + calories + '</figcaption>' + '</figure>' + '<br>');
  //               $("#carousel").prepend(recipeCard);

  //               $('#recipe-table > tbody').append("<tr><td>" + '<img width="100px" src="' + image + '">' + "</td><td>" + recipeName + "</td><td>" +
  //               calories + "</td></tr>");

  //               // showDivs();
  //           }
  //           showDivs()
  //       });
  //   }

  //   function showDivs(n) {
  //     var i;
  //     var x = document.getElementByClassName("mySlides");
  //     if (n > x.length) {slideIndex = 1}
  //     if (n < 1) {slideIndex = x.length}
  //     for (i = 0; i < x.length; i++) {
  //       x[i].style.display = "none";
  //     }
  //     x[slideIndex-1].style.display = "block";
  //   }

  //   searchRecipes();

  // Form Validation to prevent user from leaving inputs empty
  // #weight, #activity-length, #beer-search
  function getInputValues() {

    weight = $('#weight').val().trim();
    workoutLength = $('#activity-length').val().trim();
    beerPreference = $('#beer-search').val().trim();

    // Tests if 'Weight' input exists.
    if(weight === "") {
        //alert("Please enter your weight");
        $("#weight").val("").focus();
        return false;
    // Tests if 'Workout Length' exists.
    } else if (workoutLength === "") {
        //alert("Please enter the time of your workout");
        $("#activity-length").val("").focus();
        return false;
    // Tests if 'Beer Preference' exists.
    } else if (beerPreference === "") {
        //alert("Please enter a beer preference");
        $("#beer-search").val("").focus();
        return false;
    // If all fields are complete, go ahead.
    } else {
        //$('#weight').val("");
        //$('#activity-length').val("");
        //$('#beer-search').val("");
        return true;
    }
  }// End of getInputValues()
