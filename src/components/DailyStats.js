import React from 'react';

export const DailyStats = ({ data }) => {
  // Data is already processed from the API, so we don't need to calculate stats
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Daily Statistics</h2>
      <div className="space-y-6">
        {data.map((cityData) => (
          <div key={cityData.city} className="border rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">{cityData.city}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-blue-800">Temperature</h4>
                <p className="mt-2 text-blue-900">Max: {cityData.maxTemp}°C</p>
                <p className="text-blue-900">Min: {cityData.minTemp}°C</p>
                <p className="text-blue-900">Avg: {cityData.avgTemp}°C</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-green-800">Humidity</h4>
                <p className="mt-2 text-green-900">Max: {cityData.maxHumidity}%</p>
                <p className="text-green-900">Min: {cityData.minHumidity}%</p>
                <p className="text-green-900">Avg: {cityData.avgHumidity}%</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-purple-800">Wind Speed</h4>
                <p className="mt-2 text-purple-900">Max: {cityData.maxWindSpeed} km/h</p>
                <p className="text-purple-900">Min: {cityData.minWindSpeed} km/h</p>
                <p className="text-purple-900">Avg: {cityData.avgWindSpeed} km/h</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};