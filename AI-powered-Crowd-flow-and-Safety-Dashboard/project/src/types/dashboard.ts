export interface Location {
  id: string;
  name: string;
  type: 'ghat' | 'entry_gate' | 'food_stall' | 'health_center';
  x: number;
  y: number;
  capacity: number;
}

export interface CrowdData {
  locationId: string;
  timestamp: Date;
  currentCount: number;
  predictedCount: number;
  density: 'low' | 'medium' | 'high';
  riskLevel: 'safe' | 'warning' | 'critical';
  weather: 'sunny' | 'cloudy' | 'rainy';
  dayType: 'normal' | 'weekend' | 'festival';
}

export interface Alert {
  id: string;
  locationId: string;
  type: 'congestion' | 'emergency' | 'weather';
  severity: 'low' | 'medium' | 'high';
  message: string;
  timestamp: Date;
  resolved: boolean;
}

export interface PredictionModel {
  predict(features: {
    hour: number;
    locationId: string;
    weather: string;
    dayType: string;
    historicalAverage: number;
  }): {
    density: 'low' | 'medium' | 'high';
    riskLevel: 'safe' | 'warning' | 'critical';
    predictedCount: number;
  };
}