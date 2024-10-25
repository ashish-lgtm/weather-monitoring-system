// src/components/WeatherCharts.js
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const WeatherCharts = ({ data }) => {
  const formatChartData = (data) => {
    return data.map(item => ({
      name: item.city,
      temperature: item.temp,
      humidity: item.humidity,
      windSpeed: item.windSpeed
    }));
  };

  const chartData = formatChartData(data);

  const ChartCard = ({ title, dataKey, stroke, unit }) => (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart 
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="name" 
              angle={-45}
              textAnchor="end"
              height={60}
              interval={0}
            />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line 
              type="monotone" 
              dataKey={dataKey} 
              stroke={stroke} 
              name={`${title} (${unit})`} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Weather Trends</h2>
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
        <ChartCard 
          title="Temperature" 
          dataKey="temperature" 
          stroke="#8884d8" 
          unit="°C" 
        />
        <ChartCard 
          title="Humidity" 
          dataKey="humidity" 
          stroke="#82ca9d" 
          unit="%" 
        />
        <ChartCard 
          title="Wind Speed" 
          dataKey="windSpeed" 
          stroke="#ffc658" 
          unit="km/h" 
        />
      </div>
    </div>
  );
};