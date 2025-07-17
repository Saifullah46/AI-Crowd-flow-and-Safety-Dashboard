import React, { useState, useEffect, useMemo } from 'react';
import { CrowdDataSimulator } from '../services/dataSimulation';
import { locations } from '../data/locations';
import { CrowdData, Alert, Location } from '../types/dashboard';
import { HeatMap } from './HeatMap';
import { AlertPanel } from './AlertPanel';
import { LocationStats } from './LocationStats';
import { TimeSeriesChart } from './TimeSeriesChart';
import { ControlPanel } from './ControlPanel';
import { ExportPanel } from './ExportPanel';
import { InsightsPanel } from './InsightsPanel';
import { Activity, AlertTriangle, Users, TrendingUp, Download } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [simulator] = useState(() => new CrowdDataSimulator(locations));
  const [crowdData, setCrowdData] = useState<Map<string, CrowdData>>(new Map());
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [historicalData, setHistoricalData] = useState<CrowdData[]>([]);
  const [isLiveUpdating, setIsLiveUpdating] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'export'>('overview');

  useEffect(() => {
    // Initialize data
    setCrowdData(simulator.getCurrentData());
    setAlerts(simulator.getAlerts());
    setHistoricalData(simulator.generateHistoricalData(7));

    // Set up live updates
    const interval = setInterval(() => {
      if (isLiveUpdating) {
        simulator.updateData();
        setCrowdData(new Map(simulator.getCurrentData()));
        setAlerts([...simulator.getAlerts()]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [simulator, isLiveUpdating]);

  const filteredLocations = useMemo(() => {
    return locations.filter(location => 
      selectedType === 'all' || location.type === selectedType
    );
  }, [selectedType]);

  const currentDataArray = useMemo(() => {
    return Array.from(crowdData.values());
  }, [crowdData]);

  const criticalAlerts = alerts.filter(alert => alert.severity === 'high').length;
  const warningAlerts = alerts.filter(alert => alert.severity === 'medium').length;
  const totalPeople = currentDataArray.reduce((sum, data) => sum + data.currentCount, 0);
  const avgDensity = currentDataArray.length > 0 
    ? currentDataArray.reduce((sum, data) => sum + (data.density === 'high' ? 3 : data.density === 'medium' ? 2 : 1), 0) / currentDataArray.length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Activity className="h-8 w-8 text-blue-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Simhastha 2028</h1>
                <p className="text-sm text-gray-600">Crowd Flow & Safety Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">Live Updates</span>
              </div>
              <div className="text-sm text-gray-600">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total People</p>
                <p className="text-2xl font-bold text-gray-900">{totalPeople.toLocaleString()}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Alerts</p>
                <p className="text-2xl font-bold text-red-600">{criticalAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Warnings</p>
                <p className="text-2xl font-bold text-yellow-600">{warningAlerts}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Density</p>
                <p className="text-2xl font-bold text-gray-900">{avgDensity.toFixed(1)}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-1 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('export')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'export'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Download className="h-4 w-4 inline mr-2" />
            Export
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Heat Map */}
            <div className="lg:col-span-2">
              <HeatMap
                locations={filteredLocations}
                crowdData={crowdData}
                onLocationSelect={setSelectedLocation}
                selectedLocation={selectedLocation}
              />
              
              {/* Insights Panel */}
              <div className="mt-6">
                <InsightsPanel
                  crowdData={crowdData}
                  locations={locations}
                  alerts={alerts}
                  historicalData={historicalData}
                />
              </div>
            </div>

            {/* Right Panel */}
            <div className="space-y-6">
              <ControlPanel
                selectedType={selectedType}
                onTypeChange={setSelectedType}
                isLiveUpdating={isLiveUpdating}
                onLiveUpdateToggle={setIsLiveUpdating}
              />
              
              <AlertPanel
                alerts={alerts}
                onResolveAlert={(alertId) => simulator.resolveAlert(alertId)}
              />
              
              <LocationStats
                location={selectedLocation ? locations.find(l => l.id === selectedLocation) : null}
                data={selectedLocation ? crowdData.get(selectedLocation) : null}
                locations={locations}
                crowdData={crowdData}
                onLocationSelect={setSelectedLocation}
              />
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <TimeSeriesChart
              historicalData={historicalData}
              currentData={currentDataArray}
              selectedLocation={selectedLocation}
            />
          </div>
        )}

        {activeTab === 'export' && (
          <div className="space-y-6">
            <ExportPanel
              crowdData={currentDataArray}
              historicalData={historicalData}
              alerts={alerts}
              locations={locations}
            />
          </div>
        )}
      </main>
    </div>
  );
};