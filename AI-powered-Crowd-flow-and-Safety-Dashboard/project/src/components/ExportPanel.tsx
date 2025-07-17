import React from 'react';
import { CrowdData, Alert, Location } from '../types/dashboard';
import { Download, FileText, BarChart3, AlertCircle } from 'lucide-react';

interface ExportPanelProps {
  crowdData: CrowdData[];
  historicalData: CrowdData[];
  alerts: Alert[];
  locations: Location[];
}

export const ExportPanel: React.FC<ExportPanelProps> = ({
  crowdData,
  historicalData,
  alerts,
  locations
}) => {
  const exportToCsv = (data: any[], filename: string) => {
    const headers = Object.keys(data[0] || {});
    const csvContent = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          const value = row[header];
          return typeof value === 'string' ? `"${value}"` : value;
        }).join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCurrentData = () => {
    const exportData = crowdData.map(data => ({
      locationId: data.locationId,
      locationName: locations.find(l => l.id === data.locationId)?.name || 'Unknown',
      currentCount: data.currentCount,
      predictedCount: data.predictedCount,
      density: data.density,
      riskLevel: data.riskLevel,
      weather: data.weather,
      dayType: data.dayType,
      timestamp: data.timestamp.toISOString()
    }));

    exportToCsv(exportData, `crowd-data-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportHistoricalData = () => {
    const exportData = historicalData.map(data => ({
      locationId: data.locationId,
      locationName: locations.find(l => l.id === data.locationId)?.name || 'Unknown',
      currentCount: data.currentCount,
      predictedCount: data.predictedCount,
      density: data.density,
      riskLevel: data.riskLevel,
      weather: data.weather,
      dayType: data.dayType,
      timestamp: data.timestamp.toISOString()
    }));

    exportToCsv(exportData, `historical-data-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const exportAlerts = () => {
    const exportData = alerts.map(alert => ({
      id: alert.id,
      locationId: alert.locationId,
      locationName: locations.find(l => l.id === alert.locationId)?.name || 'Unknown',
      type: alert.type,
      severity: alert.severity,
      message: alert.message,
      timestamp: alert.timestamp.toISOString(),
      resolved: alert.resolved
    }));

    exportToCsv(exportData, `alerts-${new Date().toISOString().split('T')[0]}.csv`);
  };

  const generateReport = () => {
    const totalPeople = crowdData.reduce((sum, data) => sum + data.currentCount, 0);
    const criticalAlerts = alerts.filter(alert => alert.severity === 'high').length;
    const warningAlerts = alerts.filter(alert => alert.severity === 'medium').length;
    
    const report = `
SIMHASTHA 2028 CROWD MANAGEMENT REPORT
Generated on: ${new Date().toLocaleString()}

EXECUTIVE SUMMARY
================
Total People: ${totalPeople.toLocaleString()}
Critical Alerts: ${criticalAlerts}
Warning Alerts: ${warningAlerts}
Monitoring Locations: ${locations.length}

LOCATION STATUS
===============
${locations.map(location => {
  const data = crowdData.find(d => d.locationId === location.id);
  return `${location.name}: ${data ? `${data.currentCount} people (${data.riskLevel})` : 'No data'}`;
}).join('\n')}

ACTIVE ALERTS
=============
${alerts.length === 0 ? 'No active alerts' : alerts.map(alert => 
  `${alert.timestamp.toLocaleTimeString()} - ${alert.severity.toUpperCase()}: ${alert.message}`
).join('\n')}

RECOMMENDATIONS
===============
${criticalAlerts > 0 ? '• Immediate action required for critical areas' : ''}
${warningAlerts > 0 ? '• Monitor warning areas closely' : ''}
${criticalAlerts === 0 && warningAlerts === 0 ? '• All areas operating normally' : ''}
• Continue monitoring crowd flow patterns
• Maintain emergency response readiness
    `;

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `crowd-management-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Download className="h-5 w-5 text-blue-600" />
          <span>Export Data</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={exportCurrentData}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <div className="text-left">
              <h4 className="font-medium text-gray-900">Current Data</h4>
              <p className="text-sm text-gray-600">Export current crowd data as CSV</p>
            </div>
          </button>

          <button
            onClick={exportHistoricalData}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <BarChart3 className="h-8 w-8 text-green-600" />
            <div className="text-left">
              <h4 className="font-medium text-gray-900">Historical Data</h4>
              <p className="text-sm text-gray-600">Export historical crowd patterns</p>
            </div>
          </button>

          <button
            onClick={exportAlerts}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <AlertCircle className="h-8 w-8 text-red-600" />
            <div className="text-left">
              <h4 className="font-medium text-gray-900">Alerts Log</h4>
              <p className="text-sm text-gray-600">Export alerts and incidents</p>
            </div>
          </button>

          <button
            onClick={generateReport}
            className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <FileText className="h-8 w-8 text-purple-600" />
            <div className="text-left">
              <h4 className="font-medium text-gray-900">Summary Report</h4>
              <p className="text-sm text-gray-600">Generate executive summary</p>
            </div>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Information</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <p><strong>Current Data:</strong> Real-time crowd counts and predictions for all locations</p>
          <p><strong>Historical Data:</strong> Past 7 days of crowd flow patterns and trends</p>
          <p><strong>Alerts Log:</strong> All alerts generated with timestamps and resolution status</p>
          <p><strong>Summary Report:</strong> Executive-level overview with key metrics and recommendations</p>
        </div>
      </div>
    </div>
  );
};