'use client';

import { useEffect, useState } from 'react';
import { WeatherDashboard } from '@/components/WeatherDashboard';
import { WeatherService } from '@/services/weatherService';
import { Loader2 } from 'lucide-react';

export default function Home() {
  const [weatherData, setWeatherData] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [dailyStats, setDailyStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch weather data
        const data = await WeatherService.fetchWeatherData();
        setWeatherData(data);

        // Save readings to database
        await Promise.all(data.map(reading => WeatherService.saveReading(reading)));

        // Fetch alerts
        const response = await fetch('/api/alerts');
        const alertsData = await response.json();
        setAlerts(alertsData);

        // Fetch daily stats
        const statsResponse = await fetch('/api/daily-stats');
        if (!statsResponse.ok) {
          throw new Error('Failed to fetch daily stats');
        }
        const statsData = await statsResponse.json();
        setDailyStats(statsData);

      } catch (error) {
        console.error('Error updating data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000); // 5 minutes

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        Error loading data: {error}
      </div>
    );
  }

  return (
    <WeatherDashboard
      weatherData={weatherData}
      alerts={alerts}
      dailyStats={dailyStats}
    />
  );
}