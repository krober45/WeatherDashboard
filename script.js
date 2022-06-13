
var citySearchForm = document.querySelector('#citySearch');
var citySearchBtn = document.querySelector('#citySearchBtn');
var clearHistory = document.querySelector('#clearHistory');

var cWeather = document.querySelector('#currentWeather');
var cCity = document.querySelector('#currentCity');
var forecast = document.querySelector('fiveDays');

var apiKey = "0b3a50f5b7b11193f263b2162781fb2b";
var searchHistoryLi = [];

//document ready
$(document).ready(function() {

    var recentSearch = localStorage.getItem('cities');
    recentSearch = JSON.parse(recentSearch);

    if (recentSearch !== null) {
        for (var i = 0; i < recentSearch.length; i++) {
            var createHistory = document.createElement('li');
            createHistory.classList = 'list-group-item citySearch';
            createHistory.textContent = recentSearch[i];

            $('#searchHistory').append(createHistory);

            $(createHistory).on('click', function(event) {
                event.preventDefault();

                var oldCityH = createHistory.textContent;
                currentWeather(oldCityH);
                nextFiveDaysCall(oldCityH);
            })
        }
    }
    //on click clear history (incomplete)
})

//search for city
$('#citySearchBtn').on('click', function(event) {
    event.preventDefault();

    var city = $('#citySearch').val().trim();
    currentWeather(city);
    nextFiveDaysCall(city);

    if (!searchHistoryLi.includes(city)) {
        searchHistoryLi.push(city);
        var newSearch = document.createElement('li')
        newSearch.classList = 'list-group-item citySearch';
        newSearch.innerText = city;

        $(newSearch).on('click', function(event) {
            event.preventDefault();

            var oldCity = newSearch.textContent;
            currentWeather(oldCity);
            nextFiveDaysCall(oldCity);
        })

        $('#searchHistory').append(newSearch);
    };

    localStorage.setItem('cities', JSON.stringify(searchHistoryLi));
    console.log(searchHistoryLi);
})

//clear history
$('#clearHistory').on('click', function(event) {
    event.preventDefault();

    localStorage.clear();
    location.reload();
})


//function for getting api
function currentWeather(city) {

    var openWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

    fetch(openWeatherUrl)
        .then(function(response) {
            response.json()
        .then(function(data) {
            getWeather(data, city);
            
        });
    });
   
}

function getWeather(weather, city) {
    //clear
    $('#currentWeather').text('');
    $('#currentCity').text(city);
    

    console.log(weather);

    //date
    var currentDate = document.createElement('span');
    currentDate.textContent = ' ( ' + moment(weather.dt.value).format('MMM D, YYYY') + ' ) ';
    $('#currentCity').append(currentDate);

    //icon
    var icon = document.createElement('img');
    icon.setAttribute('src', `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`);
    icon.setAttribute('alt', 'weatherIcon');
    $('#currentCity').append(icon);

    //temperature
    var tempV = document.createElement('li');
    tempV.textContent = 'Temperature today is: ' + weather.main.temp + ' °K';
    tempV.classList = 'list-group-item';
    $('#currentWeather').append(tempV);

    //humidity
    var humidityV = document.createElement('li');
    humidityV.textContent = 'Humidity: ' + weather.main.humidity + '%';
    humidityV.classList = 'list-group-item';
    $('#currentWeather').append(humidityV);

    //windspeed
    var windV = document.createElement('li');
    windV.textContent = 'Wind Speed: ' + weather.wind.speed + ' MPH';
    windV.classList = 'list-group-item';
    $('#currentWeather').append(windV);

//UV finds the latitude and longitude of the given city and plugs it into seperate function
    var lat = weather.coord.lat;
    var lon = weather.coord.lon;

    uvIndex(lat, lon);
}

//UV index api call
function uvIndex(lat, lon) {
    var openWeatherUrlLatLon = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey}&lat=${lat}&lon=${lon}`;

    fetch(openWeatherUrlLatLon)
    .then(function(response) {
        response.json().then(function(data) {
            displayUvIndex(data);
        })
    })
}

function displayUvIndex(index) {
    var uvIndexV = document.createElement('div');
    uvIndexV.textContent = 'UV Index: ';
    uvIndexV.classList = 'list-group-item uvIndex';

    var uvIndexValue = document.createElement('li');
    uvIndexValue.textContent = index.value;

    if (index.value <= 2) {
        uvIndexValue.classList = 'favorable';
    } else if (index.value > 2 && index.value <= 8) {
        uvIndexValue.classList = 'moderate';
    } else {
        uvIndexValue.classList = 'severe';
    }

    uvIndexV.appendChild(uvIndexValue);

    $('#currentWeather').append(uvIndexV);
}

//forecast api call

function nextFiveDaysCall(city) {
    var openWeatherUrlForecast = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

    fetch(openWeatherUrlForecast)
    .then(function(response) {
        response.json().then(function(data) {
            fiveDays(data);
        })
    })
}

function fiveDays(weather) {
    $('#fiveDays').text('');

    var weatherForecast = weather.list;

        for (i = 5; i < weatherForecast.length; i = i + 8) {
            var daily = weatherForecast[i];

            var forecastV = document.createElement('div');
            forecastV.classList = 'card bg-primary text-light m-2';

            //date
            var forecastDate = document.createElement('h5');
            forecastDate.textContent = moment.unix(daily.dt).format('MMM D, YYYY');
            forecastDate.classList = 'car-header text-center'
            forecastV.appendChild(forecastDate);

            //icon
            var forecastIcon = document.createElement('img');
            forecastIcon.classList = 'card-body text-center forecastIcon';
            forecastIcon.setAttribute('src', `https://openweathermap.org/img/wn/${daily.weather[0].icon}@2x.png`);
            forecastIcon.setAttribute('alt', 'forecastIcon');
            forecastV.appendChild(forecastIcon);

            //temperature
            var forecastTemp = document.createElement('li');
            forecastTemp.classList = 'card-body text-center cardLi';
            forecastTemp.textContent = 'Temperature: ' + daily.main.temp + ' °K';
            forecastV.appendChild(forecastTemp);

            //windspeed
            var forecastWindSpeed = document.createElement('li')
            forecastWindSpeed.classList = 'card-body text-center cardLi';
            forecastWindSpeed.textContent = 'Wind Speed: ' + daily.wind.speed + ' MPH';
            forecastV.appendChild(forecastWindSpeed);

            //humidity
            var forecastHumidity = document.createElement('li');
            forecastHumidity.classList = 'card-body text-center cardLi';
            forecastHumidity.textContent = 'Humidity: ' + daily.main.humidity + ' %';
            forecastV.appendChild(forecastHumidity);

            $('#fiveDays').append(forecastV);
        }
}