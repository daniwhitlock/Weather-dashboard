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

//function for listItem for all cities
    // create the list item and add the new city to cities
    //append to front end


submitBtnEl.addEventListener("click", function(){
    var city = cityNameEl.value;
    // console.log(city);
    getTemperature(city);
    
    //add new city to array then reset localStorage
    
    console.log(cities);
    localStorage.setItem(cities, city);
    $("#list-of-cities").val(localStorage.getItem());

});

var getTemperature = function(city) {
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey + "&units=imperial";
    fetch(apiUrl)
        .then(function(response){
            return response.json();
        })
        .then(function(data) { //use data since we used reponse above
            console.log(data);
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
        });
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
            // console.log(dailyData);
            for(var i=0; i < dailyData.length; i++) {
                //create a div with class of column, then card,  then put the card inside column, and put the data insde the card
                //create variables first
                //then append info to card
                //append card to column
                //append column to page
            }
        });
}

// make different functions for each call, uv index (latitude and longitude- get from main weather), temperature