const Kelvin = 273;
const key = '52b6d75929b03ed3144cc6e333f2de81';

$(document).ready(function(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(function(pos){
            var latitude = pos.coords.latitude;
            var longtitude = pos.coords.longitude;
           setData(longtitude, latitude);
        })
    }else{
        alert('No info for you!')
    }

    async function getData(inpVal) {
        let response = await fetch(`https://api.teleport.org/api/cities/?search=${inpVal}`);
        // throw new Error();
        return await response.json();
     };
 
     $('#search-field').on('keyup', function() {
         const $container = $('.list-group > ul');
 
         if (!this.value.length) {
             $container.html('');		
 
             $('.loader').removeClass('loader--active');
 
             return;
         }
 
         $('.loader').addClass('loader--active');
 
         getData(this.value)
             .then(data => {
                 const resultFromSearch = data._embedded[`city:search-results`];
 
                 if (!resultFromSearch.length) {
                     $container.html(`<li class="error">No cities found</li>`);
 
                     return;
                 }
 
                 $container.html(
                     resultFromSearch.map(element => `<li class="option">${element[`matching_full_name`]}</li>`).join('')
                 );
                 
             })
             .finally(() => {
                 $('.loader').removeClass('loader--active');    			
             })
             .catch(() => {
                 $container.html(`<li class="error">An error ocurred</li>`)
             });
             
     });
 
     $('.list-group').on('click', '.option', function() {
         const $this = $(this);
 
         $('#search-field').val($this.text());
 
         $this.parent().html('');		
     });
})
$('.temperature-value').click(function(){
    if($('.temperature-value p > span').text()=="C"){
        $('.temperature-value p > span').text("F");
        let newValue = celsiusToFarenhait($('.temperature-value p > strong').text());
        $('.temperature-value p > strong').text(newValue);
    }
    else{
        $('.temperature-value p > span').text("C");
        let newValue = farenahitToCelsius($('.temperature-value p > strong').text());
        $('.temperature-value p > strong').text(newValue);
    }
})

$('.address').keyup(function(e){
    var code = (e.keyCode ? e.keyCode : e.which);
    if (code==13) {
        let address = $('.address').val();
        $.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=AIzaSyBIBNoGVJL-a3PHI_ACOYK6ErzxGXrhyvg`, (data) =>{
            latitude = data.results[0].geometry.location.lat;
            longitude =data.results[0].geometry.location.lng;
            setData(longitude, latitude)
        })
    }
})

function celsiusToFarenhait(temp){
    return Math.round(temp*1.8+32);
}
function farenahitToCelsius(temp){
    return Math.round((temp-32)/1.8);
}
function setData(longtitude, latitude){
    $.get(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longtitude}&appid=${key}`, (data) => {
        console.log(data);
        $('.notification').text("Weather in "+data.name);
        $('.temperature-value p > strong').text(Math.round(data.main.temp - Kelvin));
        $('.temperature-value p > span').html('C');
        $('.temperature-description p').text(data.weather[0].main);
        $('.location').text(`${data.sys.country}, ${data.name}`);
        $('.weather-icon img').attr("src",`icons/${data.weather[0].icon}.png` );
    });
}



