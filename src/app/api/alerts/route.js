// app/api/alerts/route.js
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';

export async function GET() {
  const connection = await connectDB();
  try {
    const [rows] = await connection.query(
      'SELECT * FROM alerts ORDER BY createdAt DESC LIMIT 10'
    );
    return NextResponse.json(rows);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
}

export async function POST(request) {
  const connection = await connectDB();
  try {
    const data = await request.json();
    
    // If the request is to update threshold
    if (data.type === 'threshold') {
      const threshold = Number(data.threshold);
      if (isNaN(threshold)) {
        return NextResponse.json(
          { error: 'Invalid threshold value' },
          { status: 400 }
        );
      }
      
      // Update threshold in settings table
      await connection.execute(
        'INSERT INTO settings (name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?',
        ['temperature_threshold', threshold.toString(), threshold.toString()]
      );
      
      return NextResponse.json({ success: true, threshold });
    }
    
    // Regular alert creation
    const [result] = await connection.execute(
      'INSERT INTO alerts (city, message, severity, createdAt) VALUES (?, ?, ?, NOW())',
      [data.city, data.message, data.severity]
    );
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Operation failed' },
      { status: 500 }
    );
  } finally {
    await connection.end();
  }
}

// Function to get current threshold
export async function getThreshold(connection) {
  try {
    const [rows] = await connection.query(
      'SELECT value FROM settings WHERE name = ?',
      ['temperature_threshold']
    );
    return rows.length > 0 ? Number(rows[0].value) : 30; // Default to 30 if not set
  } catch (error) {
    console.error('Error getting threshold:', error);
    return 30; // Default to 30 if error
  }
}

// Function to check temperature and create alert if needed
export async function checkTemperatureAndCreateAlert(city, temperature, connection) {
  try {
    const threshold = await getThreshold(connection);
    if (temperature > threshold) {
      await connection.execute(
        'INSERT INTO alerts (city, message, severity, createdAt) VALUES (?, ?, ?, NOW())',
        [
          city,
          `High temperature alert: ${temperature}°C`,
          'high'
        ]
      );
    }
  } catch (error) {
    console.error('Error creating temperature alert:', error);
    throw error;
  }
}