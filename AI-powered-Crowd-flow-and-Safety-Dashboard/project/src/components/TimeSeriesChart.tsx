import React, { useMemo } from 'react';
import { CrowdData } from '../types/dashboard';
import { TrendingUp, Clock, Users } from 'lucide-react';

interface TimeSeriesChartProps {
  historicalData: CrowdData[];
  currentData: CrowdData[];
  selectedLocation: string;
}

export const TimeSeriesChart: React.FC<TimeSeriesChartProps> = ({
  historicalData,
  currentData,
  selectedLocation
}) => {
  const chartData = useMemo(() => {
    const filterData = selectedLocation 
      ? historicalData.filter(d => d.locationId === selectedLocation)
      : historicalData;

    // Group by hour for the last 24 hours
    const hourlyData = new Map<string, CrowdData[]>();
    
    filterData.forEach(data => {
      const hour = data.timestamp.getHours();
      const key = `${hour}:00`;
      if (!hourlyData.has(key)) {
        hourlyData.set(key, []);
      }
      hourlyData.get(key)!.push(data);
    });

    // Calculate averages
    const chartPoints = Array.from(hourlyData.entries()).map(([hour, dataPoints]) => {
      const avgCount = dataPoints.reduce((sum, d) => sum + d.currentCount, 0) / dataPoints.length;
      const avgPredicted = dataPoints.reduce((sum, d) => sum + d.predictedCount, 0) / dataPoints.length;
      
      return {
        hour,
        actual: Math.round(avgCount),
        predicted: Math.round(avgPredicted),
        risk: dataPoints[0]?.riskLevel || 'safe'
      };
    });

    return chartPoints.sort((a, b) => parseInt(a.hour) - parseInt(b.hour));
  }, [historicalData, selectedLocation]);

  const maxValue = Math.max(...chartData.flatMap(d => [d.actual, d.predicted]));

  const getBarColor = (risk: string) => {
    switch (risk) {
      case 'safe': return 'bg-green-500';
      case 'warning': return 'bg-yellow-500';
      case 'critical': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          <span>Crowd Flow Analytics</span>
        </h3>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Actual</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 border-2 border-blue-500 rounded-full"></div>
            <span>Predicted</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span>Hourly Crowd Distribution</span>
          <span>People Count</span>
        </div>
        
        <div className="h-64 flex items-end space-x-2">
          {chartData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div className="w-full relative" style={{ height: '200px' }}>
                {/* Predicted bar (outline) */}
                <div
                  className="absolute bottom-0 w-full border-2 border-blue-500 border-dashed"
                  style={{
                    height: `${(data.predicted / maxValue) * 100}%`,
                  }}
                />
                
                {/* Actual bar */}
                <div
                  className={`absolute bottom-0 w-full ${getBarColor(data.risk)} opacity-80`}
                  style={{
                    height: `${(data.actual / maxValue) * 100}%`,
                  }}
                />
                
                <div className="absolute -top-6 left-0 right-0 text-xs text-gray-600 text-center">
                  {data.actual}
                </div>
              </div>
              
              <div className="text-xs text-gray-600 mt-2">{data.hour}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {chartData.reduce((sum, d) => sum + d.actual, 0).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Total Footfall</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {Math.round(chartData.reduce((sum, d) => sum + d.actual, 0) / chartData.length).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Average per Hour</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-900">
            {Math.max(...chartData.map(d => d.actual)).toLocaleString()}
          </div>
          <div className="text-sm text-gray-600">Peak Count</div>
        </div>
      </div>
    </div>
  );
};