// src/services/weatherService.js
const CITIES = ['Delhi', 'Mumbai', 'Chennai', 'Bangalore', 'Kolkata', 'Hyderabad'];
const API_KEY = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY;

export class WeatherService {
  static async fetchWeatherData() {
    try {
      const promises = CITIES.map(city =>
        fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`)
          .then(res => res.json())
      );

      const results = await Promise.all(promises);
      return results.map(data => ({
        city: data.name,
        temp: data.main.temp,
        feelsLike: data.main.feels_like,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
        condition: data.weather[0].main,
      }));
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  static async saveReading(reading) {
    try {
      const response = await fetch('/api/weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reading),
      });
      return response.json();
    } catch (error) {
      console.error('Error saving reading:', error);
      throw error;
    }
  }

  static async createAlert(alert) {
    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alert),
      });
      return response.json();
    } catch (error) {
      console.error('Error creating alert:', error);
      throw error;
    }
  }
}
