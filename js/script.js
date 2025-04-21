async function search(location) {
  try {
    var response = await fetch(`https://api.weatherapi.com/v1/forecast.json?key=13aa0ab4db5c4e89905225700251904&q=${location}&days=3`);
    if (!response.ok) throw new Error("HTTP Error " + response.status);
  
    var data = await response.json();
    displayCurrent(data.location, data.current);
    displayAnother(data.forecast.forecastday);
  } catch (error) {
    console.error("Weather fetch failed:", error);
  }
}

document.getElementById("search").addEventListener("keyup", function(e) {
  search(e.target.value);
});

var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

var monthNames = ["January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"];

function displayCurrent(location, current) {
  if (current != null) {
    var date = new Date(current.last_updated.replace(" ", "T"));
    var todayWheather = `
      <div class="wheather-header" id="today">
        <div class="day">${days[date.getDay()]}</div>
        <div class="date">${date.getDate()} ${monthNames[date.getMonth()]}</div>
      </div>

      <div class="wheather-content p-3" id="current">
        <div class="location">${location.name}</div>
        <div class="degree">
          <div class="num">${current.temp_c}<sup>o</sup>C</div>
          <div class="forecast-icon">
            <img src="https:${current.condition.icon}" alt="" width="90">
          </div>	
        </div>
        <div class="custom">${current.condition.text}</div>
        <div class="d-flex align-items-center gap-4">
          <span><img src="img/icon-umberella.png" alt=""> 20%</span>
          <span><img src="img/icon-wind.png" alt=""> 18km/h</span>
          <span><img src="img/icon-compass.png" alt=""> East</span>
        </div>
      </div>
    `;

    document.getElementById("t-day").innerHTML = todayWheather;
  }
}
function displayAnother(forecastDays) {
  for (var i = 1; i < forecastDays.length; i++) {
    var day = new Date(forecastDays[i].date.replace(" ", "T"));
    var anotherDays = `
      <div class="wheather-header d-flex align-items-center justify-content-center">
        <div class="day">${days[day.getDay()]}</div>
      </div>
      <div class="wheather-content p-5 d-flex align-items-center justify-content-center flex-column gap-2">
        <div class="forecast-icon">
          <img src="https:${forecastDays[i].day.condition.icon}" alt="" width="48">
        </div>
        <div class="degree">${forecastDays[i].day.maxtemp_c}<sup>o</sup>C</div>
        <small>${forecastDays[i].day.mintemp_c}<sup>o</sup></small>
        <div class="custom">${forecastDays[i].day.condition.text}</div>
      </div>
    `;
    document.getElementById(`day-${i}`).innerHTML = anotherDays;
  }
}

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      let lat = position.coords.latitude;
      let lon = position.coords.longitude;
      search(`${lat},${lon}`);
    },
    (error) => {
      console.log("Location error, showing Cairo as default");
      search("Cairo");
    }
  );
} else {
  search("Cairo");
}