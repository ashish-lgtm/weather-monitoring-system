// app/api/weather/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { checkTemperatureAndCreateAlert } from '../alerts/route';

export async function POST(request) {
  const connection = await connectDB();
  try {
    const reading = await request.json();
    
    // Log the received data for debugging
    console.log('Received weather reading:', reading);
    
    // Validate required fields
    if (!reading.city || reading.temp === undefined) {
      console.log('Validation failed:', { city: reading.city, temperature: reading.temp });
      return NextResponse.json(
        { error: 'Missing required fields: city and temperature' },
        { status: 400 }
      );
    }

    // Ensure numeric fields are actually numbers
    const temperature = Number(reading.temp);
    const feelsLike = reading.feelsLike ? Number(reading.feelsLike) : null;
    const humidity = reading.humidity ? Number(reading.humidity) : null;
    const windSpeed = reading.windSpeed ? Number(reading.windSpeed) : null;

    if (isNaN(temperature)) {
      return NextResponse.json(
        { error: 'Temperature must be a valid number' },
        { status: 400 }
      );
    }

    // Check if there's already a recent reading for this city
    const [existingReadings] = await connection.execute(
      `SELECT createdAt FROM WeatherReading 
       WHERE city = ? 
       AND createdAt > DATE_SUB(NOW(), INTERVAL 5 MINUTE)
       ORDER BY createdAt DESC 
       LIMIT 1`,
      [reading.city]
    );

    if (existingReadings.length > 0) {
      return NextResponse.json({
        success: false,
        message: 'Skipping duplicate reading - too soon after last reading'
      });
    }

    // If no recent reading exists, insert the new one
    const [result] = await connection.execute(
      `INSERT INTO WeatherReading (
        city, temperature, feelsLike, humidity, windSpeed, \`condition\`, createdAt
      ) VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        reading.city,
        temperature,
        feelsLike,
        humidity,
        windSpeed,
        reading.condition
      ]
    );

    // Check temperature and create alert if needed
    await checkTemperatureAndCreateAlert(reading.city, temperature, connection);

    return NextResponse.json({ success: true, id: result.insertId });
  } catch (error) {
    console.error('Error saving weather reading:', error);
    return NextResponse.json(
      { error: 'Failed to save reading', details: error.message },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
}