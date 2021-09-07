
const Kelvin = 273;
const key = '52b6d75929b03ed3144cc6e333f2de81';

var lat, lon;
if(navigator.geolocation){
    navigator.geolocation.getCurrentPosition(function(pos){
        $.get(`http://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${key}`, (data) => {
            console.log(data);
            $('.notification').text("Weather in "+data.name);
            $('.temperature-value').text(Math.round(data.main.temp - Kelvin) + "°C");
            $('.temperature-description p').text(data.weather[0].main);
            $('.location').text(`${data.sys.country}, ${data.name}`);
            $('.weather-icon img').attr("src",`icons/${data.weather[0].icon}.png` );
        });
    })
}else{
    $('.notification').text("Weather in "+data.name);
}



