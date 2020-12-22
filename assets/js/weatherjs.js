var cityNameEl = document.querySelector("#city-name");
var submitBtnEl = document.querySelector("#submit");

var weatherIconEl = document.querySelector("#weather-icon");
var currentCityEl = document.querySelector("#current-city");
var uvIndexEl = document.querySelector("#uv-index");
var windSpeedEl = document.querySelector("#wind-speed");
var humidityEl = document.querySelector("#humidity");
var temperatureEl = document.querySelector("#temperature");

var futureEl = document.querySelector("#future-forecast");

var apiKey = "3ae9d49bbb3c0b44a518fccbf10f8e1a"
var cities =[];



//List out cities saved in local Storage and append to page
cities =JSON.parse(localStorage.getItem("cities")) || [];
citiesMakeList(cities);


//Multiple Cities list out
function citiesMakeList(cities) {
     // create the list item and add the new city to cities
    //append to front end
    for (var i = 0; i < cities.length; i++) {

        var citiesList = $("<li>").addClass("list-group-item").text(cities[i]);
        $("#list-of-cities").append(citiesList);
    }
};

var cityMakeList = function (city){
    var citiesList = $("<li>").addClass("list-group-item").text(city);
    $("#list-of-cities").append(citiesList);
};



$("#list-of-cities").on("click", "li", function() { //.on is addEvent Listener with jquery
    var clickedCity = $(this).text(); //.val is value for jquery
    console.log(clickedCity);
    
    getCurrentDayInfo(clickedCity);

});
    


submitBtnEl.addEventListener("click", function(){
    // console.log(cities);
    var city = cityNameEl.value;

    //hide previous cards
    // $(".five-day").hide();

    // console.log(city);
    var cityLowerCase = city.toLowerCase();
    //Two ways to do same thing .includesOf
    // if (cities.indexOf(cityLowerCase) === -1){ //since it starts at 0, then it def won't be in there, so then add //indexOf is array method so goes through whole array
    //     cityMakeList(city);
        
    //     //add new city to array then reset localStorage
    //     cities.push(cityLowerCase;
    //     // console.log(cities);
    //     var cityString = JSON.stringify(cities);
    //     localStorage.setItem("cities", cityString);
    // }; 

    if(!cities.includes(cityLowerCase)){ //if inside my cities it does not(!) includes city, then add city to list //includes is array method so goes through whole array
        cityMakeList(city);
        //add new city to array then reset localStorage
        cities.push(cityLowerCase);
        // console.log(cities);
        var cityString = JSON.stringify(cities);
        localStorage.setItem("cities", cityString);
    };
    
    
    getCurrentDayInfo(city);
    
  

});

var getCurrentDayInfo = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";
    fetch(apiUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data) { //use data since we used reponse above
            // console.log(data);
            //grab information from the data spot for city, date, and icon for weather description
            currentCityEl.textContent = city;
            $("#current-day").text(moment().format("DD/MM/YYYY"));
            // console.log(data);
            var weatherType = data.weather[0].icon;
            weatherIconEl.setAttribute("src", "https://openweathermap.org/img/w/" + weatherType + ".png"); 

            //grab information from the data spot for temp, humid, and wind and add to front end
            var temperature = data.main.temp;
            temperatureEl.textContent = temperature + " °F";
            var humidity = data.main.humidity;
            humidityEl.textContent = humidity + "%";
            var windSpeed = data.wind.speed;
            windSpeedEl.textContent = windSpeed + " MPH";

            //look in the data to get the coordinates since the UV index api needs the lat and lon coordinates
            getUvIndex(data.coord.lat, data.coord.lon); 
            getfiveDayWeather(city);
        });
};

var getUvIndex = function(lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial";
    fetch(apiUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data) {
            //empty out BEFORE you repopulate to make sure you are starting with a blank state
            uvIndexEl.textContent ="";
            //remove border colors
            $(uvIndexEl).removeClass("border-pink border-green border-yellow border-orange border-red");
            // console.log(data);
            var uvIndex = data.value;
            uvIndexEl.textContent = uvIndex; 
            // console.log(uvIndex);
            if (uvIndex < 3 ){
                uvIndexEl.classList.add("border-green");
            }
            else if (uvIndex < 6 && uvIndex > 3){
                uvIndexEl.classList.add("border-yellow");
            }
            else if (uvIndex > 6 && uvIndex < 8 ){
                uvIndexEl.classList.add("border-orange");
            }
            else if (uvIndex > 8 && uvIndex < 10 ){
                uvIndexEl.classList.add("border-red");
            }
            else if (uvIndex > 11){
                uvIndexEl.classList.add("border-pink");
            }
        })
    ; 
};

var getfiveDayWeather = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city+ "&appid=" + apiKey + "&units=imperial";
    fetch(apiUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data){
            $("#future-forecast").empty(); //.empty is  = javascript's .innerHTML = "";
            // console.log(data);
            //.filter through the list of 40 ---- .includes picks the time from the list
            const dailyData = data.list.filter(day => {  
                return day.dt_txt.includes("12:00:00")
            });
            // console.log(dailyData);
            
            for(var i= 0; i < dailyData.length; i++) {
                //create a div with class of column, then card,  then put the card inside column, and put the data inside the card

                //create card
                var cardFiveDay = document.createElement("div");
                cardFiveDay.classList.add("card", "blue-background", "five-day");
                    
                //header-date-create h2 element
                var cardHeader = document.createElement("h2");
                cardHeader.classList.add("five-card-header");
                var dateFiveDay = dailyData[i].dt_txt.split(" ")[0];
                cardHeader.textContent = dateFiveDay;

                //icon-img
                var cardIconFiveDay = document.createElement("img");
                var weatherTypeFiveDay = dailyData[i].weather[0].icon;
                cardIconFiveDay.setAttribute("src", "https://openweathermap.org/img/w/" + weatherTypeFiveDay + ".png" );
                
                //append icon to header so they are in same row and append to card
                cardHeader.appendChild(cardIconFiveDay);
                cardFiveDay.appendChild(cardHeader);

                // temperature
                var cardText = document.createElement("p");
                cardText.classList.add("five-card-text");
                var cardTemp = dailyData[i].main.temp;
                cardText.textContent = "Temperature: " + cardTemp  + " °F";;
                cardFiveDay.appendChild(cardText);

                // humidity
                var cardTextTwo = document.createElement("p");
                cardTextTwo.classList.add("five-card-text");
                var cardHumidity = dailyData[i].main.humidity;
                cardTextTwo.textContent = "Humidity: " + cardHumidity  + "%";;
                cardFiveDay.appendChild(cardTextTwo);
                
                //append card to page
                futureEl.appendChild(cardFiveDay);

            }
        });
};

