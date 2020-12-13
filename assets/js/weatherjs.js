var cityNameEl = document.querySelector("#city-name");
var submitBtnEl = document.querySelector("#submit");

var weatherIconEl = document.querySelector("#weather-icon");
var currentCityEl = document.querySelector("#current-city");
var uvIndexEl = document.querySelector("#uv-index");
var windSpeedEl = document.querySelector("#wind-speed");
var humidityEl = document.querySelector("#humidity");
var temperatureEl = document.querySelector("#temperature");

var apiKey = "3ae9d49bbb3c0b44a518fccbf10f8e1a"
var cities =[];




//Multiple Cities list out
var citiesMakeList = function (cities) {
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

//List out cities saved in local Storage and append to page
cities =JSON.parse(localStorage.getItem("cities")) || [];;
citiesMakeList(cities);
    

submitBtnEl.addEventListener("click", function(){
    // console.log(cities);
    var city = cityNameEl.value;
    // console.log(city);
    cities =JSON.parse(localStorage.getItem("cities")) || [];;
    cityMakeList(city);
    getTemperature(city);
    
    //add new city to array then reset localStorage
    cities.push(city);
    // console.log(cities);
    var cityString = JSON.stringify(cities);
    localStorage.setItem("cities", cityString);
    // console.log(cities);

});

var getTemperature = function(city) {
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
            fiveDayWeather(city);
        });
};

var getUvIndex = function(lat, lon) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + apiKey + "&units=imperial";
    fetch(apiUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data) {
            // console.log(data);
            var uvIndex = data.value;
            uvIndexEl.textContent = uvIndex; 
            // console.log(uvIndex);
            if (uvIndex < 3 ){
                uvIndexEl.classList.add("border-green");
            }
            else if (uvIndex > 3 && uvIndex < 6 ){
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

var fiveDayWeather = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + city+ "&appid=" + apiKey + "&units=imperial";
    fetch(apiUrl)
        .then(function(response) {
            return response.json();
        })
        .then(function(data){
            // console.log(data);
            //.filter through the list of 40 ---- .includes picks the time from the list
            const dailyData = data.list.filter(day => {  
                return day.dt_txt.includes("12:00:00")
            });
            console.log(dailyData);
            for(var i=0; i < dailyData.length; i++) {
                var dailyColumn = $("<div>").addClass("column");
                var dailyCard = $("<div>").addClass("card");
                var cardHeader = $("<h2>").addClass("five-card-header");
                var weatherType = dailyData.weather[i].icon;
                var cardIcon = $("img").attr("src", "https://openweathermap.org/img/w/" + weatherType + ".png");
                var cardTextEl = $("<p>").addClass("five-card-text");
                var cardTemp = [i].main.temp;
                $cardTemp.textContent = temperature + " °F";

                 
                dailyColumn.append(dailyCard);
                //create a div with class of column, then card,  then put the card inside column, and put the data insde the card
                //create variables first
                //then append info to card
                //append card to column
                //append column to page

                var citiesList = $("<li>").addClass("list-group-item").text(cities[i]);
                $("#list-of-cities").append(citiesList);
            }
            }
        });
}

// make different functions for each call, uv index (latitude and longitude- get from main weather), temperature