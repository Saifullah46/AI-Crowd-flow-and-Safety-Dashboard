import React from 'react';
import { Alert } from '../types/dashboard';
import { AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface AlertPanelProps {
  alerts: Alert[];
  onResolveAlert: (alertId: string) => void;
}

export const AlertPanel: React.FC<AlertPanelProps> = ({ alerts, onResolveAlert }) => {
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'high': return <AlertTriangle className="h-5 w-5 text-red-500" />;
      case 'medium': return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'low': return <AlertTriangle className="h-5 w-5 text-blue-500" />;
      default: return <AlertTriangle className="h-5 w-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'border-red-200 bg-red-50';
      case 'medium': return 'border-yellow-200 bg-yellow-50';
      case 'low': return 'border-blue-200 bg-blue-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <span>Active Alerts</span>
          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs">
            {alerts.length}
          </span>
        </h3>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-3 text-green-500" />
            <p>No active alerts</p>
            <p className="text-sm">All locations are operating normally</p>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {alerts.map(alert => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3">
                    {getSeverityIcon(alert.severity)}
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{alert.message}</p>
                      <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{alert.timestamp.toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onResolveAlert(alert.id)}
                    className="text-sm bg-white border border-gray-300 rounded px-3 py-1 hover:bg-gray-50 transition-colors"
                  >
                    Resolve
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};