const axios = require("axios");

const getWeather = async (city) => {
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.NEXT_PUBLIC_WEATHER_API}&units=metric`;
  var weather = "";

  await axios
    .get(url)
    .then((response) => {
      const weatherData = response.data;

      console.log(weatherData);

      weather = String(
        `It is ${weatherData.main.temp}°C in ${city} with ${weatherData.weather[0].main}.
The humidity is ${weatherData.main.humidity}%.
The wind speed is ${weatherData.wind.speed} km/h at ${weatherData.wind.deg}°.
The pressure is ${weatherData.main.pressure} hPa.
The visibility is ${weatherData.visibility} m.`
      );
    })
    .catch((error) => {
      weather = `Couldn't fetch weather of ${city} at the moment!`;
    });

  return weather;
};

export default getWeather;
