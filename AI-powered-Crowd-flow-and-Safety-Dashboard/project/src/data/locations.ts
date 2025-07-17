import { Location } from '../types/dashboard';

export const locations: Location[] = [
  // Ghats
  { id: 'ghat-1', name: 'Ram Ghat', type: 'ghat', x: 45, y: 60, capacity: 5000 },
  { id: 'ghat-2', name: 'Triveni Ghat', type: 'ghat', x: 55, y: 65, capacity: 8000 },
  { id: 'ghat-3', name: 'Mangal Nath Ghat', type: 'ghat', x: 35, y: 70, capacity: 3000 },
  { id: 'ghat-4', name: 'Gau Ghat', type: 'ghat', x: 65, y: 55, capacity: 4000 },
  
  // Entry Gates
  { id: 'gate-1', name: 'Main Entry Gate', type: 'entry_gate', x: 20, y: 30, capacity: 10000 },
  { id: 'gate-2', name: 'North Gate', type: 'entry_gate', x: 50, y: 15, capacity: 6000 },
  { id: 'gate-3', name: 'South Gate', type: 'entry_gate', x: 70, y: 85, capacity: 7000 },
  { id: 'gate-4', name: 'East Gate', type: 'entry_gate', x: 90, y: 50, capacity: 5000 },
  
  // Food Stalls
  { id: 'food-1', name: 'Central Food Court', type: 'food_stall', x: 60, y: 45, capacity: 2000 },
  { id: 'food-2', name: 'Riverside Stalls', type: 'food_stall', x: 40, y: 55, capacity: 1500 },
  { id: 'food-3', name: 'Temple Food Area', type: 'food_stall', x: 75, y: 40, capacity: 1000 },
  
  // Health Centers
  { id: 'health-1', name: 'Main Medical Center', type: 'health_center', x: 30, y: 40, capacity: 500 },
  { id: 'health-2', name: 'Emergency Station', type: 'health_center', x: 80, y: 30, capacity: 300 },
  { id: 'health-3', name: 'First Aid Post', type: 'health_center', x: 25, y: 75, capacity: 200 },
];