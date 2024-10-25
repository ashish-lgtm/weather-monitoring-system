'use client';

import { CityCard } from './CityCard';
import { WeatherCharts } from './WeatherCharts';
import { AlertsPanel } from './AlertsPanel';
import { DailyStats } from './DailyStats';

export const WeatherDashboard = ({ weatherData, alerts, dailyStats }) => {
  // Add logging to check incoming data
  console.log('WeatherDashboard render - weatherData:', weatherData);

  if (!weatherData || !weatherData.length) {
    return null;
  }

  // Deduplicate weather data based on city
  const uniqueWeatherData = weatherData.reduce((acc, current) => {
    const existingCity = acc.find(item => item.city === current.city);
    if (!existingCity) {
      acc.push(current);
    } else if (new Date(current.createdAt) > new Date(existingCity.createdAt)) {
      // Replace with newer reading if exists
      acc[acc.indexOf(existingCity)] = current;
    }
    return acc;
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-center mb-8">
        Weather Monitoring Dashboard
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {uniqueWeatherData.map(city => (
          <CityCard key={city.city} data={city} />
        ))}
      </div>
      <WeatherCharts data={uniqueWeatherData} />
      <AlertsPanel alerts={alerts} />
      {dailyStats && dailyStats.length > 0 ? (
        <DailyStats data={dailyStats} />
      ) : (
        <div className="text-gray-500 text-center p-4">
          No daily statistics available yet
        </div>
      )}
    </div>
  );
};
