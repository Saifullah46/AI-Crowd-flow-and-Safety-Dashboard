import React from 'react';
import { CrowdData, Location, Alert } from '../types/dashboard';
import { 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  Users, 
  Clock, 
  MapPin,
  Activity,
  Shield,
  Zap,
  Target,
  BarChart3,
  Calendar,
  ThermometerSun,
  Navigation
} from 'lucide-react';

interface InsightsPanelProps {
  crowdData: Map<string, CrowdData>;
  locations: Location[];
  alerts: Alert[];
  historicalData: CrowdData[];
}

export const InsightsPanel: React.FC<InsightsPanelProps> = ({
  crowdData,
  locations,
  alerts,
  historicalData
}) => {
  const currentDataArray = Array.from(crowdData.values());
  
  // Calculate insights
  const totalCapacity = locations.reduce((sum, loc) => sum + loc.capacity, 0);
  const totalCurrent = currentDataArray.reduce((sum, data) => sum + data.currentCount, 0);
  const overallUtilization = Math.round((totalCurrent / totalCapacity) * 100);
  
  const criticalLocations = currentDataArray.filter(data => data.riskLevel === 'critical');
  const warningLocations = currentDataArray.filter(data => data.riskLevel === 'warning');
  const safeLocations = currentDataArray.filter(data => data.riskLevel === 'safe');
  
  const highDensityLocations = currentDataArray.filter(data => data.density === 'high');
  const mediumDensityLocations = currentDataArray.filter(data => data.density === 'medium');
  
  // Peak hour analysis
  const currentHour = new Date().getHours();
  const isPeakHour = [6, 7, 8, 17, 18, 19].includes(currentHour);
  
  // Weather impact
  const weatherCounts = currentDataArray.reduce((acc, data) => {
    acc[data.weather] = (acc[data.weather] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const weatherEntries = Object.entries(weatherCounts);
  const dominantWeather = weatherEntries.length > 0 
    ? weatherEntries.reduce((a, b) => 
        weatherCounts[a[0]] > weatherCounts[b[0]] ? a : b
      )[0]
    : 'unknown';
  
  // Trend analysis
  const avgPredicted = currentDataArray.length > 0 
    ? currentDataArray.reduce((sum, data) => sum + data.predictedCount, 0) / currentDataArray.length
    : 0;
  const avgCurrent = currentDataArray.length > 0 
    ? currentDataArray.reduce((sum, data) => sum + data.currentCount, 0) / currentDataArray.length
    : 0;
  const trendDirection = avgPredicted > avgCurrent ? 'increasing' : 'decreasing';
  
  // Location type analysis
  const locationTypeStats = locations.reduce((acc, loc) => {
    const data = crowdData.get(loc.id);
    if (!acc[loc.type]) {
      acc[loc.type] = { count: 0, totalPeople: 0, capacity: 0 };
    }
    acc[loc.type].count++;
    acc[loc.type].totalPeople += data?.currentCount || 0;
    acc[loc.type].capacity += loc.capacity;
    return acc;
  }, {} as Record<string, { count: number; totalPeople: number; capacity: number }>);
  
  // Emergency response recommendations
  const getRecommendations = () => {
    const recommendations = [];
    
    if (criticalLocations.length > 0) {
      recommendations.push({
        type: 'critical',
        icon: AlertTriangle,
        message: `Immediate action needed at ${criticalLocations.length} location(s)`,
        action: 'Deploy crowd control teams'
      });
    }
    
    if (overallUtilization > 80) {
      recommendations.push({
        type: 'warning',
        icon: Users,
        message: 'Overall capacity approaching limit',
        action: 'Consider entry restrictions'
      });
    }
    
    if (isPeakHour) {
      recommendations.push({
        type: 'info',
        icon: Clock,
        message: 'Peak hour detected',
        action: 'Increase monitoring frequency'
      });
    }
    
    if (dominantWeather === 'rainy') {
      recommendations.push({
        type: 'weather',
        icon: ThermometerSun,
        message: 'Weather may affect crowd patterns',
        action: 'Prepare covered areas'
      });
    }
    
    return recommendations;
  };
  
  const recommendations = getRecommendations();
  
  const getLocationTypeIcon = (type: string) => {
    switch (type) {
      case 'ghat': return '🏛️';
      case 'entry_gate': return '🚪';
      case 'food_stall': return '🍽️';
      case 'health_center': return '🏥';
      default: return '📍';
    }
  };
  
  const getLocationTypeName = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Overall Utilization</p>
              <p className="text-2xl font-bold text-gray-900">{overallUtilization}%</p>
              <p className="text-xs text-gray-500">{totalCurrent.toLocaleString()} / {totalCapacity.toLocaleString()}</p>
            </div>
            <div className={`p-2 rounded-full ${
              overallUtilization > 80 ? 'bg-red-100' : 
              overallUtilization > 60 ? 'bg-yellow-100' : 'bg-green-100'
            }`}>
              <BarChart3 className={`h-6 w-6 ${
                overallUtilization > 80 ? 'text-red-600' : 
                overallUtilization > 60 ? 'text-yellow-600' : 'text-green-600'
              }`} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Crowd Trend</p>
              <p className="text-lg font-bold text-gray-900 capitalize">{trendDirection}</p>
              <p className="text-xs text-gray-500">Next hour prediction</p>
            </div>
            <div className="p-2 rounded-full bg-blue-100">
              {trendDirection === 'increasing' ? 
                <TrendingUp className="h-6 w-6 text-blue-600" /> :
                <TrendingDown className="h-6 w-6 text-blue-600" />
              }
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Peak Status</p>
              <p className="text-lg font-bold text-gray-900">{isPeakHour ? 'Peak Hour' : 'Normal'}</p>
              <p className="text-xs text-gray-500">Current: {currentHour}:00</p>
            </div>
            <div className={`p-2 rounded-full ${isPeakHour ? 'bg-orange-100' : 'bg-green-100'}`}>
              <Clock className={`h-6 w-6 ${isPeakHour ? 'text-orange-600' : 'text-green-600'}`} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Weather Impact</p>
              <p className="text-lg font-bold text-gray-900 capitalize">{dominantWeather}</p>
              <p className="text-xs text-gray-500">Affecting crowd flow</p>
            </div>
            <div className="p-2 rounded-full bg-blue-100">
              <ThermometerSun className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Risk Distribution and Location Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Risk Level Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-600" />
            <span>Risk Level Distribution</span>
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="font-medium text-green-800">Safe Locations</span>
              </div>
              <span className="text-2xl font-bold text-green-600">{safeLocations.length}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                <span className="font-medium text-yellow-800">Warning Locations</span>
              </div>
              <span className="text-2xl font-bold text-yellow-600">{warningLocations.length}</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <span className="font-medium text-red-800">Critical Locations</span>
              </div>
              <span className="text-2xl font-bold text-red-600">{criticalLocations.length}</span>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t">
            <div className="text-sm text-gray-600">
              <p><strong>High Density Areas:</strong> {highDensityLocations.length} locations</p>
              <p><strong>Medium Density Areas:</strong> {mediumDensityLocations.length} locations</p>
            </div>
          </div>
        </div>

        {/* Location Type Analysis */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-blue-600" />
            <span>Location Type Analysis</span>
          </h3>
          
          <div className="space-y-3">
            {Object.entries(locationTypeStats).map(([type, stats]) => {
              const utilization = Math.round((stats.totalPeople / stats.capacity) * 100);
              return (
                <div key={type} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{getLocationTypeIcon(type)}</span>
                      <span className="font-medium text-gray-900">{getLocationTypeName(type)}</span>
                    </div>
                    <span className="text-sm text-gray-600">{stats.count} locations</span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">
                      {stats.totalPeople.toLocaleString()} people
                    </span>
                    <span className={`font-medium ${
                      utilization > 80 ? 'text-red-600' : 
                      utilization > 60 ? 'text-yellow-600' : 'text-green-600'
                    }`}>
                      {utilization}% capacity
                    </span>
                  </div>
                  
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        utilization > 80 ? 'bg-red-500' : 
                        utilization > 60 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(utilization, 100)}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recommendations and Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Target className="h-5 w-5 text-blue-600" />
          <span>AI Recommendations & Actions</span>
        </h3>
        
        {recommendations.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Shield className="h-12 w-12 mx-auto mb-3 text-green-500" />
            <p className="font-medium">All systems operating normally</p>
            <p className="text-sm">No immediate actions required</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recommendations.map((rec, index) => {
              const Icon = rec.icon;
              const getRecColor = (type: string) => {
                switch (type) {
                  case 'critical': return 'border-red-200 bg-red-50 text-red-800';
                  case 'warning': return 'border-yellow-200 bg-yellow-50 text-yellow-800';
                  case 'weather': return 'border-blue-200 bg-blue-50 text-blue-800';
                  default: return 'border-gray-200 bg-gray-50 text-gray-800';
                }
              };
              
              return (
                <div key={index} className={`p-4 border rounded-lg ${getRecColor(rec.type)}`}>
                  <div className="flex items-start space-x-3">
                    <Icon className="h-5 w-5 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium">{rec.message}</p>
                      <p className="text-sm mt-1 opacity-80">{rec.action}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
          <Zap className="h-5 w-5 text-blue-600" />
          <span>Quick Actions</span>
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="flex items-center justify-center space-x-2 p-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
            <AlertTriangle className="h-4 w-4" />
            <span className="text-sm">Emergency Alert</span>
          </button>
          
          <button className="flex items-center justify-center space-x-2 p-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors">
            <Users className="h-4 w-4" />
            <span className="text-sm">Crowd Control</span>
          </button>
          
          <button className="flex items-center justify-center space-x-2 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Navigation className="h-4 w-4" />
            <span className="text-sm">Route Guidance</span>
          </button>
          
          <button className="flex items-center justify-center space-x-2 p-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Activity className="h-4 w-4" />
            <span className="text-sm">Status Update</span>
          </button>
        </div>
      </div>
    </div>
  );
};