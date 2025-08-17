const apikey = "YOUR_API"; // Replace with your actual API key!
const main = document.getElementById("main");
const form = document.getElementById("form");
const search = document.getElementById("search");
const loader = document.getElementById("loader");
const rainDiv = document.getElementById("rainAnim");
const sunGlowDiv = document.getElementById("sunGlowAnim");

const url = (city) =>
  `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apikey}&units=metric`;

async function getWeatherByLocation(city) {
  loader.style.display = "block";
  main.innerHTML = "";

  try {
    const resp = await fetch(url(city));
    const respData = await resp.json();

    if (respData.cod == 200) {
      addWeatherToPage(respData);
    } else {
      showError(respData.message || "City not found. Try again!");
    }
  } catch (e) {
    showError("Error fetching data. Please try later.");
  }
  loader.style.display = "none";
}

function setBackgroundByWeather(data) {
  const weatherMain = data.weather[0].main;
  const temp = data.main.temp;

  let imgUrl = "";

  showRainAnimation(false);
  showSunGlow(false);

  if (
    weatherMain === "Rain" ||
    weatherMain === "Drizzle" ||
    weatherMain === "Thunderstorm"
  ) {
    imgUrl = "rain.jpg"; // Rain
    showRainAnimation(true);
  } else if (weatherMain === "Snow" || temp < 12) {
    imgUrl = "winter.jpg"; // Winter
  } else if (weatherMain === "Clear" && temp >= 28) {
    imgUrl = "summer.jpg"; // Summer
    showSunGlow(true);
  } else if (weatherMain === "Clear" && temp < 28) {
    imgUrl = "moderate.jpg"; // Moderate
  } else if (weatherMain === "Clouds") {
    imgUrl = "moderate.jpg"; // Moderate
  } else {
    imgUrl =
      "summer landscape with grass and sky_ Seamless looping video animation.jpg"; // Default moderate
  }

  document.body.style.backgroundImage = `url('${imgUrl}')`;
}

function showRainAnimation(show) {
  if (!rainDiv) return;
  rainDiv.innerHTML = "";
  rainDiv.style.display = show ? "block" : "none";
  if (show) {
    for (let i = 0; i < 60; i++) {
      const drop = document.createElement("div");
      drop.className = "raindrop";
      drop.style.left = Math.random() * 100 + "vw";
      drop.style.animationDelay = Math.random() + "s";
      drop.style.opacity = Math.random();
      rainDiv.appendChild(drop);
    }
  }
}

function showSunGlow(show) {
  if (!sunGlowDiv) return;
  sunGlowDiv.style.display = show ? "block" : "none";
}

function addWeatherToPage(data) {
  setBackgroundByWeather(data);

  const temp = Math.round(data.main.temp);
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  const weather = document.createElement("div");
  weather.classList.add("weather");
  weather.innerHTML = `
    <h2>
      <img class="weather-img" src="${iconUrl}" alt="weather icon"/>
      ${data.name}
    </h2>
    <div class="more-info">
      <p>${temp}°C</p>
      <p>${data.weather.description}</p>
      <p>Humidity: <span>${humidity}%</span></p>
      <p>Wind speed: <span>${Math.round(windSpeed)}km/h</span></p>
    </div>
  `;
  main.innerHTML = "";
  main.appendChild(weather);
}

function showError(message) {
  main.innerHTML = `<div class='weather'>${message}</div>`;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const city = search.value.trim();
  if (city) {
    getWeatherByLocation(city);
  }
});

