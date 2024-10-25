//src/lib/api.js

export const fetchWeatherData = async (cities) => {
    const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;
    const API_URL = process.env.NEXT_PUBLIC_OPENWEATHER_API_URL;
  
    try {
      const promises = cities.map(city =>
        fetch(`${API_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`)
          .then(res => {
            if (!res.ok) throw new Error(`Error fetching data for ${city}`);
            return res.json();
          })
      );
  
      const results = await Promise.all(promises);
      return results.map(data => ({
        city: data.name,
        temp: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        condition: data.weather[0].main,
        time: new Date().toISOString()
      }));
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  };