const API_KEY = "74effe3e434842d64544f88ecd143313";

// 🌍 GET WEATHER BY CITY
async function getWeather(city) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
    );
    const data = await res.json();

    const forecastRes = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`
    );
    const forecast = await forecastRes.json();

    if (data.cod !== 200) {
      alert("City not found ❌");
      return;
    }

    updateUI(data, forecast);

  } catch (err) {
    alert("Error fetching data ⚠️");
  }
}

// 📍 GET WEATHER BY LOCATION
function getLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(async position => {

      const lat = position.coords.latitude;
      const lon = position.coords.longitude;

      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const data = await res.json();

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      const forecast = await forecastRes.json();

      updateUI(data, forecast);

    }, () => {
      // fallback
      getWeather("Kolkata");
    });
  } else {
    getWeather("Kolkata");
  }
}

// 🎯 UPDATE UI
function updateUI(data, forecast) {

  // BASIC INFO
  document.getElementById("city").innerText = data.name;
  document.getElementById("temp").innerText = Math.round(data.main.temp) + "°";
  document.getElementById("desc").innerText = data.weather[0].description;
  document.getElementById("wind").innerText = data.wind.speed + " km/h";
  document.getElementById("humidity").innerText = data.main.humidity + "%";

  // 🌦️ ICON FROM API
  const iconCode = data.weather[0].icon;
  document.getElementById("weatherIcon").src =
    `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

  // ☀️ SUNLIGHT HOURS (FIXED 🔥)
  const sunrise = data.sys.sunrise;
  const sunset = data.sys.sunset;

  const daylightHours = (sunset - sunrise) / 3600;
  const sunHours = daylightHours.toFixed(1);

  document.getElementById("sun").innerText = sunHours + " hr";

  // ⏱️ HOURLY (ONLY 3 CARDS)
  const hourly = document.getElementById("hourly");
  hourly.innerHTML = "";

  const hourlyData = forecast.list.slice(0, 3);

  hourlyData.forEach(item => {
    const time = new Date(item.dt * 1000)
      .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const temp = Math.round(item.main.temp);

    const card = document.createElement("div");
    card.classList.add("hour-card");

    card.innerHTML = `
      <p>${time}</p>
      <h4>${temp}°</h4>
    `;

    hourly.appendChild(card);
  });
}

// 🔍 SEARCH
const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    const city = this.value.trim();
    if (city) {
      getWeather(city);
      this.value = "";
    }
  }
});

// 🚀 DEFAULT LOAD = DEVICE LOCATION
getLocationWeather();
