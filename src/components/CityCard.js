// src/components/CityCard.js
import { Sun, Cloud, CloudRain, Wind, CloudLightning, Snowflake, Cloudy, CloudFog } from 'lucide-react';

export const CityCard = ({ data }) => {
  const getWeatherIcon = (condition) => {
    // Early return if condition is undefined
    if (!condition) return <Sun className="h-8 w-8 text-yellow-500" />;

    // Match OpenWeatherMap API weather conditions
    switch (condition.toLowerCase()) {
      case 'clear':
        return <Sun className="h-8 w-8 text-yellow-500" />;
      case 'clouds':
        return <Cloud className="h-8 w-8 text-gray-500" />;
      case 'rain':
      case 'drizzle':
        return <CloudRain className="h-8 w-8 text-blue-500" />;
      case 'thunderstorm':
        return <CloudLightning className="h-8 w-8 text-purple-500" />;
      case 'snow':
        return <Snowflake className="h-8 w-8 text-blue-200" />;
      case 'mist':
      case 'fog':
      case 'haze':
        return <CloudFog className="h-8 w-8 text-gray-400" />;
      default:
        return <Sun className="h-8 w-8 text-yellow-500" />;
    }
  };

  // Add data validation
  if (!data) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-900">{data.city}</h2>
        {getWeatherIcon(data.condition)}
      </div>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-500">Temperature</span>
          <span className="font-medium">
            {typeof data.temp === 'number' ? `${data.temp.toFixed(1)}°C` : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Feels Like</span>
          <span className="font-medium">
            {typeof data.feelsLike === 'number' ? `${data.feelsLike.toFixed(1)}°C` : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Humidity</span>
          <span className="font-medium">
            {typeof data.humidity === 'number' ? `${data.humidity}%` : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Wind Speed</span>
          <span className="font-medium">
            {typeof data.windSpeed === 'number' ? `${data.windSpeed.toFixed(1)} km/h` : 'N/A'}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Condition</span>
          <span className="font-medium">
            {data.condition ? data.condition.charAt(0).toUpperCase() + data.condition.slice(1) : 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
};
