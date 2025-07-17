import React from 'react';
import { Location, CrowdData } from '../types/dashboard';
import { MapPin, AlertTriangle } from 'lucide-react';

interface HeatMapProps {
  locations: Location[];
  crowdData: Map<string, CrowdData>;
  onLocationSelect: (locationId: string) => void;
  selectedLocation: string;
}

export const HeatMap: React.FC<HeatMapProps> = ({
  locations,
  crowdData,
  onLocationSelect,
  selectedLocation
}) => {
  const getLocationColor = (locationId: string): string => {
    const data = crowdData.get(locationId);
    if (!data) return '#6B7280';
    
    switch (data.riskLevel) {
      case 'safe': return '#10B981';
      case 'warning': return '#F59E0B';
      case 'critical': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getLocationSize = (locationId: string): number => {
    const data = crowdData.get(locationId);
    if (!data) return 8;
    
    switch (data.density) {
      case 'low': return 8;
      case 'medium': return 12;
      case 'high': return 16;
      default: return 8;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'ghat': return '🏛️';
      case 'entry_gate': return '🚪';
      case 'food_stall': return '🍽️';
      case 'health_center': return '🏥';
      default: return '📍';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Ujjain Area Map</h2>
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Safe</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Warning</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Critical</span>
          </div>
        </div>
      </div>

      <div className="relative bg-gradient-to-br from-blue-50 to-green-50 rounded-lg overflow-hidden">
        {/* Simulated Map Background */}
        <div className="w-full h-96 relative">
          {/* River representation */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-200 to-blue-300 opacity-30">
            <div className="absolute top-1/2 left-0 right-0 h-8 bg-blue-400 transform -translate-y-1/2 rotate-12"></div>
          </div>

          {/* Location markers */}
          {locations.map(location => {
            const data = crowdData.get(location.id);
            const isSelected = selectedLocation === location.id;
            
            return (
              <div
                key={location.id}
                className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 hover:scale-110 ${
                  isSelected ? 'scale-125 z-10' : 'z-0'
                }`}
                style={{
                  left: `${location.x}%`,
                  top: `${location.y}%`,
                }}
                onClick={() => onLocationSelect(location.id)}
              >
                <div className="relative">
                  {/* Pulsing animation for better visibility */}
                  <div className="absolute inset-0 rounded-full animate-ping opacity-30"
                    style={{
                      backgroundColor: getLocationColor(location.id),
                      width: `${getLocationSize(location.id)}px`,
                      height: `${getLocationSize(location.id)}px`,
                    }}
                  ></div>
                  
                  <div
                    className={`w-${getLocationSize(location.id) / 4} h-${getLocationSize(location.id) / 4} rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-sm transition-all duration-200`}
                    style={{
                      backgroundColor: getLocationColor(location.id),
                      width: `${getLocationSize(location.id)}px`,
                      height: `${getLocationSize(location.id)}px`,
                    }}
                  >
                    {getTypeIcon(location.type)}
                  </div>
                  
                  {data?.riskLevel === 'critical' && (
                    <div className="absolute -top-2 -right-2 animate-pulse">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                    </div>
                  )}
                  
                  {isSelected && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap">
                      {location.name}
                      <div className="text-xs text-gray-300">
                        {data ? `${data.currentCount} people` : 'Loading...'}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white bg-opacity-90 rounded-lg p-3">
          <h4 className="font-semibold text-sm mb-2">Location Types</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center space-x-1">
              <span>🏛️</span>
              <span>Ghats</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>🚪</span>
              <span>Entry Gates</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>🍽️</span>
              <span>Food Stalls</span>
            </div>
            <div className="flex items-center space-x-1">
              <span>🏥</span>
              <span>Health Centers</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};