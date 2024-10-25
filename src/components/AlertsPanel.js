// src/components/AlertsPanel.js
import { useState, useEffect } from 'react';

export const AlertsPanel = ({ alerts }) => {
  // Ensure alerts is an array and handle null/undefined
  const validAlerts = Array.isArray(alerts) ? alerts : [];
  
  // State to manage threshold temperature and loading state
  const [threshold, setThreshold] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  // Fetch current threshold on component mount
  useEffect(() => {
    const fetchThreshold = async () => {
      try {
        const response = await fetch('/api/alerts/threshold');
        if (response.ok) {
          const data = await response.json();
          setThreshold(data.threshold);
        }
      } catch (error) {
        console.error('Error fetching threshold:', error);
      }
    };
    
    fetchThreshold();
  }, []);
  
  // Function to handle threshold change
  const handleChangeThreshold = async () => {
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'threshold',
          threshold: Number(threshold)
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Threshold updated successfully');
      } else {
        setMessage(data.error || 'Failed to update threshold');
      }
    } catch (error) {
      console.error('Error updating threshold:', error);
      setMessage('Failed to update threshold');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Weather Alerts</h2>
      
      {/* Threshold Temperature Section */}
      <div className="mb-4">
        <label htmlFor="threshold" className="block text-gray-700">
          Set Alert Threshold Temperature (°C):
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            id="threshold"
            value={threshold}
            onChange={(e) => setThreshold(e.target.value)}
            className="mt-1 block flex-1 border border-gray-300 rounded-md p-2"
            placeholder="Enter threshold temperature"
          />
          <button
            onClick={handleChangeThreshold}
            disabled={isLoading}
            className={`mt-1 px-4 py-2 rounded-md text-white ${
              isLoading 
                ? 'bg-blue-300 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isLoading ? 'Updating...' : 'Set Threshold'}
          </button>
        </div>
        {message && (
          <p className={`mt-2 text-sm ${
            message.includes('success') 
              ? 'text-green-600' 
              : 'text-red-600'
          }`}>
            {message}
          </p>
        )}
      </div>

      {/* Alerts Display Section */}
      <div className="space-y-4">
        {validAlerts.length === 0 ? (
          <p className="text-gray-500">No active alerts</p>
        ) : (
          validAlerts.map((alert, index) => (
            <div
              key={alert.id || index}
              className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded"
            >
              <div className="flex">
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-yellow-800">
                    Alert for {alert.city || 'Unknown Location'}
                  </h3>
                  <p className="text-sm text-yellow-700 mt-2">
                    {alert.message || 'No message available'}
                  </p>
                  {alert.createdAt && (
                    <p className="text-xs text-yellow-600 mt-1">
                      {new Date(alert.createdAt).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};