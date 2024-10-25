# Weather Monitoring System

A comprehensive weather monitoring system that collects, processes, and stores weather data. The system provides real-time weather readings and daily statistics for different cities, along with alert functionality for extreme weather conditions.

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Setup](#setup)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Usage](#usage)
- [License](#license)

## Features
- Collects weather readings (temperature, humidity, wind speed, and weather condition) for various cities
- Calculates daily statistics including average, maximum, and minimum values
- Sends alerts for extreme weather conditions (e.g., high temperature, low humidity)
- Provides an API to retrieve current weather readings and daily statistics
- Stores data in a MySQL database

## Technologies Used
- **Frontend**: Next.js (React framework)
- **Backend**: Node.js with MySQL
- **Database**: MySQL
- **Date Manipulation**: date-fns

## Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/yourusername/weather-monitoring-system.git
   cd weather-monitoring-system
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your database configuration:
   ```
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=password
   DB_NAME=weather_monitoring
   ```

4. **Set Up the Database**
   - Create a MySQL database with the name specified in your `.env` file
   - Run the necessary SQL scripts to create the required tables (`WeatherReading`, `DailyStat`, etc.)

5. **Run the Application**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:3000`.

## API Endpoints

### GET `/api/daily-stats`
Fetches daily weather statistics for all cities.

**Response:**
- JSON array of daily statistics, including:
  - City
  - Date
  - Maximum Temperature
  - Minimum Temperature
  - Average Temperature
  - Maximum Humidity
  - Minimum Humidity
  - Average Humidity
  - Maximum Wind Speed
  - Minimum Wind Speed
  - Average Wind Speed
  - Dominant Condition

### GET `/api/weather-readings`
Fetches the latest weather readings for all cities.

**Response:**
- JSON array of weather readings, including:
  - City
  - Temperature
  - Humidity
  - Wind Speed
  - Weather Condition
  - Created At Timestamp

### GET `/api/alerts`
Fetches alerts for extreme weather conditions.

**Response:**
- JSON array of alerts, including:
  - City
  - Alert Type (e.g., High Temperature, Low Humidity)
  - Threshold Value
  - Current Value
  - Message

## Database Schema

### WeatherReading
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary Key |
| city | VARCHAR(255) | Name of the city |
| temperature | FLOAT | Temperature reading |
| humidity | FLOAT | Humidity reading |
| windSpeed | FLOAT | Wind speed reading |
| condition | VARCHAR(255) | Weather condition (e.g., sunny, rainy) |
| createdAt | DATETIME | Timestamp of the reading |

### DailyStat
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary Key |
| city | VARCHAR(255) | Name of the city |
| date | DATE | Date of the statistics |
| maxTemp | FLOAT | Maximum temperature |
| minTemp | FLOAT | Minimum temperature |
| avgTemp | FLOAT | Average temperature |
| maxHumidity | FLOAT | Maximum humidity |
| minHumidity | FLOAT | Minimum humidity |
| avgHumidity | FLOAT | Average humidity |
| maxWindSpeed | FLOAT | Maximum wind speed |
| minWindSpeed | FLOAT | Minimum wind speed |
| avgWindSpeed | FLOAT | Average wind speed |
| dominantCondition | VARCHAR(255) | Dominant weather condition |

### Alerts
| Column | Type | Description |
|--------|------|-------------|
| id | INT | Primary Key |
| city | VARCHAR(255) | Name of the city |
| alertType | VARCHAR(255) | Type of alert (e.g., High Temperature) |
| thresholdValue | FLOAT | The value that triggers the alert |
| currentValue | FLOAT | The current value of the parameter |
| message | TEXT | Alert message |
| createdAt | DATETIME | Timestamp of the alert |

## Usage
- Monitor weather conditions in real-time and analyze daily statistics
- Receive alerts for extreme weather conditions to take timely actions
- Extend the system by integrating additional data sources or front-end features
