"use strict";
let searchInput = document.querySelector("#search");
let WheatherData;


searchInput.addEventListener("input", () =>
  {
    if(searchInput.value.length > 2){
    startApp(searchInput.value)}});


async function startApp(location){
  WheatherData = await connectWithAPI(location);
  getTodayData();
  getNextDaysData();
  console.log(WheatherData);
  
};
async function connectWithAPI(location){
  try{
    let response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=13aa0ab4db5c4e89905225700251904&q=${location}&days=3`);
    let data = await response.json();
    return data;
  }
  catch(error){
    console.error("Weather fetch failed:", error);
  }
};

function getTodayData(){

  let date = new Date(WheatherData.location.localtime);


  document.querySelector("#t-day .wheather-header .day").innerHTML = date.toLocaleString("en-US", {weekday: "long"});
  document.querySelector("#t-day .wheather-header .date").innerHTML = date.toLocaleString("en-US", {day: "numeric", month: "short"});
  document.querySelector("#t-day .wheather-content .location").innerHTML = WheatherData.location.name;
  document.querySelector("#t-day .wheather-content .num").innerHTML = WheatherData.current.temp_c + "<sup>o</sup>C";
  document.querySelector("#t-day .wheather-content .forecast-icon img").setAttribute("src", `https:${WheatherData.current.condition.icon}`); 
  document.querySelector("#t-day .wheather-content .custom").innerHTML = WheatherData.current.condition.text;
  document.querySelector("#t-day .wheather-content .humidity").innerHTML = WheatherData.current.humidity + "%";
  document.querySelector("#t-day .wheather-content .winds").innerHTML = WheatherData.current.wind_mph + "km/h";
  document.querySelector("#t-day .wheather-content .weatherTrend").innerHTML = WheatherData.current.wind_dir;
};

function getNextDaysData(){

  for (let i = 1; i <= 2; i++) {

    let date = new Date(WheatherData.forecast.forecastday[i].date);
    
    document.querySelector(`#day-${i} .day`).innerHTML = date.toLocaleString("en-US", { weekday: "long" });
    document.querySelector(`#day-${i} .forecast-icon img`).src = `https:${WheatherData.forecast.forecastday[i].day.condition.icon}`;
    document.querySelector(`#day-${i} .degree`).innerHTML = WheatherData.forecast.forecastday[i].day.maxtemp_c + "<sup>o</sup>C";
    document.querySelector(`#day-${i} small`).innerHTML = WheatherData.forecast.forecastday[i].day.mintemp_c + "<sup>o</sup>";
    document.querySelector(`#day-${i} .custom`).innerHTML = WheatherData.forecast.forecastday[i].day.condition.text;
  }
}


startApp("cairo");

navigator.geolocation.getCurrentPosition((position)=>{
  let liveLocation = `${position.coords.latitude},${position.coords.longitude}`;
  startApp(liveLocation);
});