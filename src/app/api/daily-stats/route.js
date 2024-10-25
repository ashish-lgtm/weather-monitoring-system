// app/api/daily-stats/route.js
import { NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { subMinutes } from 'date-fns';

const connectionConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'weather_monitoring',
};

let programStartTime = new Date();

// Helper function to handle NaN and null values
const sanitizeValue = (value) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return null;
  }
  return value;
};

export async function GET() {
  const connection = await mysql.createConnection(connectionConfig);
  try {
    const currentTime = new Date();
    const fiveMinutesAgo = subMinutes(currentTime, 5);

    // Get readings from the last 5 minutes
    const [readings] = await connection.query(
      `SELECT * FROM WeatherReading 
       WHERE createdAt BETWEEN ? AND ?
       AND createdAt >= ?`,
      [fiveMinutesAgo, currentTime, programStartTime]
    );

    // Group readings by city
    const citiesData = readings.reduce((acc, reading) => {
      if (!acc[reading.city]) acc[reading.city] = [];
      acc[reading.city].push(reading);
      return acc;
    }, {});

    // Process each city's data
    await Promise.all(
      Object.entries(citiesData).map(async ([city, cityReadings]) => {
        // Extract and filter valid readings
        const temperatures = cityReadings.map(r => r.temperature).filter(t => t !== null && !Number.isNaN(t));
        const humidities = cityReadings.map(r => r.humidity).filter(h => h !== null && !Number.isNaN(h));
        const windSpeeds = cityReadings.map(r => r.windSpeed).filter(w => w !== null && !Number.isNaN(w));

        // Calculate statistics
        const stats = {
          maxTemp: temperatures.length ? sanitizeValue(Math.max(...temperatures)) : null,
          minTemp: temperatures.length ? sanitizeValue(Math.min(...temperatures)) : null,
          avgTemp: temperatures.length ? 
            sanitizeValue(temperatures.reduce((a, b) => a + b, 0) / temperatures.length) : null,
          maxHumidity: humidities.length ? sanitizeValue(Math.max(...humidities)) : null,
          minHumidity: humidities.length ? sanitizeValue(Math.min(...humidities)) : null,
          avgHumidity: humidities.length ? 
            sanitizeValue(humidities.reduce((a, b) => a + b, 0) / humidities.length) : null,
          maxWindSpeed: windSpeeds.length ? sanitizeValue(Math.max(...windSpeeds)) : null,
          minWindSpeed: windSpeeds.length ? sanitizeValue(Math.min(...windSpeeds)) : null,
          avgWindSpeed: windSpeeds.length ? 
            sanitizeValue(windSpeeds.reduce((a, b) => a + b, 0) / windSpeeds.length) : null
        };

        // Calculate dominant condition
        const conditions = cityReadings.reduce((acc, r) => {
          if (r.condition) {
            acc[r.condition] = (acc[r.condition] || 0) + 1;
          }
          return acc;
        }, {});
        const dominantCondition = Object.entries(conditions)
          .sort((a, b) => b[1] - a[1])[0]?.[0] || null;

        // Build the query with proper NULL handling
        await connection.query(
          `INSERT INTO DailyStat 
           (city, date, maxTemp, minTemp, avgTemp, 
            maxHumidity, minHumidity, avgHumidity,
            maxWindSpeed, minWindSpeed, avgWindSpeed, 
            dominantCondition)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
           ON DUPLICATE KEY UPDATE
           maxTemp = CASE 
             WHEN ? IS NULL THEN maxTemp 
             ELSE COALESCE(GREATEST(COALESCE(maxTemp, -999), ?), ?)
           END,
           minTemp = CASE 
             WHEN ? IS NULL THEN minTemp 
             ELSE COALESCE(LEAST(COALESCE(minTemp, 999), ?), ?)
           END,
           avgTemp = CASE WHEN ? IS NULL THEN avgTemp ELSE ? END,
           maxHumidity = CASE 
             WHEN ? IS NULL THEN maxHumidity 
             ELSE COALESCE(GREATEST(COALESCE(maxHumidity, -999), ?), ?)
           END,
           minHumidity = CASE 
             WHEN ? IS NULL THEN minHumidity 
             ELSE COALESCE(LEAST(COALESCE(minHumidity, 999), ?), ?)
           END,
           avgHumidity = CASE WHEN ? IS NULL THEN avgHumidity ELSE ? END,
           maxWindSpeed = CASE 
             WHEN ? IS NULL THEN maxWindSpeed 
             ELSE COALESCE(GREATEST(COALESCE(maxWindSpeed, -999), ?), ?)
           END,
           minWindSpeed = CASE 
             WHEN ? IS NULL THEN minWindSpeed 
             ELSE COALESCE(LEAST(COALESCE(minWindSpeed, 999), ?), ?)
           END,
           avgWindSpeed = CASE WHEN ? IS NULL THEN avgWindSpeed ELSE ? END,
           dominantCondition = COALESCE(?, dominantCondition)`,
          [
            // INSERT values
            city, currentTime, 
            stats.maxTemp, stats.minTemp, stats.avgTemp,
            stats.maxHumidity, stats.minHumidity, stats.avgHumidity,
            stats.maxWindSpeed, stats.minWindSpeed, stats.avgWindSpeed,
            dominantCondition,
            // UPDATE values
            stats.maxTemp, stats.maxTemp, stats.maxTemp,
            stats.minTemp, stats.minTemp, stats.minTemp,
            stats.avgTemp, stats.avgTemp,
            stats.maxHumidity, stats.maxHumidity, stats.maxHumidity,
            stats.minHumidity, stats.minHumidity, stats.minHumidity,
            stats.avgHumidity, stats.avgHumidity,
            stats.maxWindSpeed, stats.maxWindSpeed, stats.maxWindSpeed,
            stats.minWindSpeed, stats.minWindSpeed, stats.minWindSpeed,
            stats.avgWindSpeed, stats.avgWindSpeed,
            dominantCondition
          ]
        );
      })
    );

    // Return latest stats
    const [stats] = await connection.query(
      `SELECT * FROM DailyStat 
       WHERE date >= ? 
       ORDER BY lastUpdated DESC`,
      [programStartTime]
    );

    return NextResponse.json(stats);

  } catch (error) {
    console.error('Error processing daily stats:', error);
    return NextResponse.json(
      { error: 'Failed to process daily stats' },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
}