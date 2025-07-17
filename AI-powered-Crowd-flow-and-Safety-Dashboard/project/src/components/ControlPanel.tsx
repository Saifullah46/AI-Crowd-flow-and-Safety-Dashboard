import React from 'react';
import { Play, Pause, Filter, RefreshCw } from 'lucide-react';

interface ControlPanelProps {
  selectedType: string;
  onTypeChange: (type: string) => void;
  isLiveUpdating: boolean;
  onLiveUpdateToggle: (enabled: boolean) => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  selectedType,
  onTypeChange,
  isLiveUpdating,
  onLiveUpdateToggle
}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
        <Filter className="h-5 w-5 text-blue-600" />
        <span>Controls</span>
      </h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filter by Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Locations</option>
            <option value="ghat">Ghats</option>
            <option value="entry_gate">Entry Gates</option>
            <option value="food_stall">Food Stalls</option>
            <option value="health_center">Health Centers</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Live Updates
          </label>
          <button
            onClick={() => onLiveUpdateToggle(!isLiveUpdating)}
            className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-md transition-colors ${
              isLiveUpdating
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {isLiveUpdating ? (
              <>
                <Pause className="h-4 w-4" />
                <span>Pause Updates</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                <span>Resume Updates</span>
              </>
            )}
          </button>
        </div>

        <div>
          <button
            onClick={() => window.location.reload()}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Data</span>
          </button>
        </div>
        
        <div className="pt-4 border-t">
          <div className="text-sm text-gray-600">
            <p className="font-medium mb-2">System Status</p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span>Data Source:</span>
                <span className="text-green-600">Connected</span>
              </div>
              <div className="flex justify-between">
                <span>AI Model:</span>
                <span className="text-green-600">Active</span>
              </div>
              <div className="flex justify-between">
                <span>Predictions:</span>
                <span className="text-green-600">Real-time</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};