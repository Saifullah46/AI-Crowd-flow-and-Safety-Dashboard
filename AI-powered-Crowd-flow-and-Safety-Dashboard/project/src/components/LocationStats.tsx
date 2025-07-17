import React from 'react';
import { Location, CrowdData } from '../types/dashboard';
import { Users, TrendingUp, AlertTriangle, Cloud, MapPin, Clock } from 'lucide-react';

interface LocationStatsProps {
  location: Location | null;
  data: CrowdData | null;
  locations: Location[];
  crowdData: Map<string, CrowdData>;
  onLocationSelect: (locationId: string) => void;
}

export const LocationStats: React.FC<LocationStatsProps> = ({ 
  location, 
  data, 
  locations, 
  crowdData, 
  onLocationSelect 
}) => {
  if (!location || !data) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Location Details</h3>
        <div className="text-gray-500 text-center py-4">
          <MapPin className="h-12 w-12 mx-auto mb-3 text-gray-300" />
          <p className="mb-4">Select a location to view details</p>
          
          {/* Quick Location Selector */}
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Quick Select:</p>
            <div className="grid grid-cols-1 gap-2">
              {locations.slice(0, 6).map(loc => {
                const locData = crowdData.get(loc.id);
                const getRiskColor = (riskLevel: string) => {
                  switch (riskLevel) {
                    case 'safe': return 'border-green-200 bg-green-50 hover:bg-green-100';
                    case 'warning': return 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100';
                    case 'critical': return 'border-red-200 bg-red-50 hover:bg-red-100';
                    default: return 'border-gray-200 bg-gray-50 hover:bg-gray-100';
                  }
                };
                
                return (
                  <button
                    key={loc.id}
                    onClick={() => onLocationSelect(loc.id)}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      locData ? getRiskColor(locData.riskLevel) : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-sm text-gray-900">{loc.name}</p>
                        <p className="text-xs text-gray-600 capitalize">{loc.type.replace('_', ' ')}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-gray-900">
                          {locData ? locData.currentCount.toLocaleString() : '---'}
                        </p>
                        <p className="text-xs text-gray-600">people</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
            
            {locations.length > 6 && (
              <div className="pt-2">
                <select
                  onChange={(e) => e.target.value && onLocationSelect(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue=""
                >
                  <option value="">More locations...</option>
                  {locations.slice(6).map(loc => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} ({loc.type.replace('_', ' ')})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const utilizationPercent = Math.round((data.currentCount / location.capacity) * 100);
  const predictedUtilization = Math.round((data.predictedCount / location.capacity) * 100);

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'safe': return 'text-green-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getDensityColor = (density: string) => {
    switch (density) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getWeatherIcon = (weather: string) => {
    switch (weather) {
      case 'sunny': return '☀️';
      case 'cloudy': return '☁️';
      case 'rainy': return '🌧️';
      default: return '☁️';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          <span>Location Details</span>
        </h3>
        <div className="text-right">
          <span className="text-sm text-gray-500 capitalize">{location.type.replace('_', ' ')}</span>
          <div className="flex items-center space-x-1 text-xs text-gray-400">
            <Clock className="h-3 w-3" />
            <span>Live</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-2">{location.name}</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{data.currentCount.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Current Count</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{location.capacity.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Capacity</div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Utilization</span>
              </div>
              <span className="font-medium">{utilizationPercent}%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Predicted</span>
              </div>
              <span className="font-medium">{predictedUtilization}%</span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className={`w-3 h-3 rounded-full ${getDensityColor(data.density) === 'text-green-600' ? 'bg-green-500' : getDensityColor(data.density) === 'text-yellow-600' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                <span className="text-sm text-gray-600">Density</span>
              </div>
              <span className={`font-medium capitalize ${getDensityColor(data.density)}`}>
                {data.density}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Risk Level</span>
              </div>
              <span className={`font-medium capitalize ${getRiskColor(data.riskLevel)}`}>
                {data.riskLevel}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cloud className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">Weather</span>
              </div>
              <span className="font-medium capitalize flex items-center space-x-1">
                <span>{getWeatherIcon(data.weather)}</span>
                <span>{data.weather}</span>
              </span>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="text-xs text-gray-500">
            Last updated: {data.timestamp.toLocaleTimeString()}
            <br />
            Capacity utilization: {utilizationPercent}% of {location.capacity.toLocaleString()}
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="border-t pt-4">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onLocationSelect('')}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Clear Selection
            </button>
            <button
              className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => {
                const message = `Alert: ${location.name} currently has ${data.currentCount} people (${data.riskLevel} risk level)`;
                navigator.clipboard.writeText(message);
              }}
            >
              Copy Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};