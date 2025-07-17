import { CrowdData, Location, Alert, PredictionModel } from '../types/dashboard';

export class CrowdDataSimulator {
  private locations: Location[];
  private currentData: Map<string, CrowdData> = new Map();
  private alerts: Alert[] = [];
  private model: PredictionModel;

  constructor(locations: Location[]) {
    this.locations = locations;
    this.model = new SimplePredictionModel();
    this.initializeData();
  }

  private initializeData() {
    this.locations.forEach(location => {
      const baseCount = this.getBaseCount(location);
      const crowdData: CrowdData = {
        locationId: location.id,
        timestamp: new Date(),
        currentCount: baseCount,
        predictedCount: baseCount,
        density: this.calculateDensity(baseCount, location.capacity),
        riskLevel: this.calculateRiskLevel(baseCount, location.capacity),
        weather: this.getRandomWeather(),
        dayType: this.getDayType()
      };
      this.currentData.set(location.id, crowdData);
    });
  }

  private getBaseCount(location: Location): number {
    const hour = new Date().getHours();
    const peakHours = [6, 7, 8, 17, 18, 19]; // Morning and evening peaks
    const isPeak = peakHours.includes(hour);
    
    let baseMultiplier = 0.3;
    if (isPeak) baseMultiplier = 0.8;
    if (location.type === 'ghat') baseMultiplier *= 1.2;
    if (location.type === 'entry_gate') baseMultiplier *= 1.1;
    
    return Math.floor(location.capacity * baseMultiplier * (0.8 + Math.random() * 0.4));
  }

  private calculateDensity(count: number, capacity: number): 'low' | 'medium' | 'high' {
    const ratio = count / capacity;
    if (ratio < 0.4) return 'low';
    if (ratio < 0.7) return 'medium';
    return 'high';
  }

  private calculateRiskLevel(count: number, capacity: number): 'safe' | 'warning' | 'critical' {
    const ratio = count / capacity;
    if (ratio < 0.6) return 'safe';
    if (ratio < 0.85) return 'warning';
    return 'critical';
  }

  private getRandomWeather(): 'sunny' | 'cloudy' | 'rainy' {
    const rand = Math.random();
    if (rand < 0.6) return 'sunny';
    if (rand < 0.85) return 'cloudy';
    return 'rainy';
  }

  private getDayType(): 'normal' | 'weekend' | 'festival' {
    const day = new Date().getDay();
    if (day === 0 || day === 6) return 'weekend';
    return Math.random() < 0.1 ? 'festival' : 'normal';
  }

  public updateData(): void {
    this.locations.forEach(location => {
      const current = this.currentData.get(location.id)!;
      const hour = new Date().getHours();
      
      // Simulate crowd flow changes
      const prediction = this.model.predict({
        hour,
        locationId: location.id,
        weather: current.weather,
        dayType: current.dayType,
        historicalAverage: current.currentCount
      });

      // Add some randomness to simulate real-world variations
      const variation = 0.9 + Math.random() * 0.2;
      const newCount = Math.max(0, Math.floor(prediction.predictedCount * variation));

      const updatedData: CrowdData = {
        ...current,
        timestamp: new Date(),
        currentCount: newCount,
        predictedCount: prediction.predictedCount,
        density: this.calculateDensity(newCount, location.capacity),
        riskLevel: this.calculateRiskLevel(newCount, location.capacity)
      };

      this.currentData.set(location.id, updatedData);
      this.checkForAlerts(location, updatedData);
    });
  }

  private checkForAlerts(location: Location, data: CrowdData): void {
    if (data.riskLevel === 'critical' && !this.hasActiveAlert(location.id, 'congestion')) {
      this.alerts.push({
        id: `alert-${Date.now()}-${location.id}`,
        locationId: location.id,
        type: 'congestion',
        severity: 'high',
        message: `Critical congestion at ${location.name}. Immediate action required.`,
        timestamp: new Date(),
        resolved: false
      });
    }
  }

  private hasActiveAlert(locationId: string, type: string): boolean {
    return this.alerts.some(alert => 
      alert.locationId === locationId && 
      alert.type === type && 
      !alert.resolved
    );
  }

  public getCurrentData(): Map<string, CrowdData> {
    return this.currentData;
  }

  public getAlerts(): Alert[] {
    return this.alerts.filter(alert => !alert.resolved);
  }

  public resolveAlert(alertId: string): void {
    const alert = this.alerts.find(a => a.id === alertId);
    if (alert) {
      alert.resolved = true;
    }
  }

  public generateHistoricalData(days: number): CrowdData[] {
    const historicalData: CrowdData[] = [];
    const now = new Date();
    
    for (let d = days; d > 0; d--) {
      for (let h = 0; h < 24; h++) {
        this.locations.forEach(location => {
          const timestamp = new Date(now);
          timestamp.setDate(now.getDate() - d);
          timestamp.setHours(h, 0, 0, 0);
          
          const baseCount = this.getHistoricalCount(location, h, d);
          historicalData.push({
            locationId: location.id,
            timestamp,
            currentCount: baseCount,
            predictedCount: baseCount,
            density: this.calculateDensity(baseCount, location.capacity),
            riskLevel: this.calculateRiskLevel(baseCount, location.capacity),
            weather: this.getRandomWeather(),
            dayType: this.getDayType()
          });
        });
      }
    }
    
    return historicalData;
  }

  private getHistoricalCount(location: Location, hour: number, daysAgo: number): number {
    const peakHours = [6, 7, 8, 17, 18, 19];
    const isPeak = peakHours.includes(hour);
    
    let baseMultiplier = 0.3;
    if (isPeak) baseMultiplier = 0.7;
    if (location.type === 'ghat') baseMultiplier *= 1.1;
    
    // Add some variation based on days ago
    const variation = 0.8 + Math.random() * 0.4;
    
    return Math.floor(location.capacity * baseMultiplier * variation);
  }
}

class SimplePredictionModel implements PredictionModel {
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
  } {
    const { hour, weather, dayType, historicalAverage } = features;
    
    // Simple rule-based prediction
    let multiplier = 1.0;
    
    // Time-based factors
    if (hour >= 6 && hour <= 9) multiplier *= 1.3; // Morning peak
    if (hour >= 17 && hour <= 20) multiplier *= 1.4; // Evening peak
    if (hour >= 22 || hour <= 5) multiplier *= 0.5; // Night time
    
    // Weather factors
    if (weather === 'rainy') multiplier *= 0.7;
    if (weather === 'sunny') multiplier *= 1.1;
    
    // Day type factors
    if (dayType === 'weekend') multiplier *= 1.2;
    if (dayType === 'festival') multiplier *= 1.5;
    
    const predictedCount = Math.floor(historicalAverage * multiplier);
    
    return {
      density: this.calculateDensity(predictedCount),
      riskLevel: this.calculateRiskLevel(predictedCount),
      predictedCount
    };
  }

  private calculateDensity(count: number): 'low' | 'medium' | 'high' {
    if (count < 1000) return 'low';
    if (count < 3000) return 'medium';
    return 'high';
  }

  private calculateRiskLevel(count: number): 'safe' | 'warning' | 'critical' {
    if (count < 2000) return 'safe';
    if (count < 4000) return 'warning';
    return 'critical';
  }
}