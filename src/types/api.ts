export type FuelType = "gasoline" | "ethanol" | "diesel" | "flex";

export interface Vehicle {
  id: number;
  name: string;
  fuel_type: FuelType;
  consumption_km_per_liter: string | number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VehiclePayload {
  name: string;
  fuel_type: FuelType;
  consumption_km_per_liter: number;
  active: boolean;
}

export interface TripSimulation {
  id: number;
  origin: string;
  destination: string;
  fuel_price: string | number;
  average_speed_kmh: string | number;
  round_trip: boolean;
  distance_km: string | number | null;
  duration_minutes: string | number | null;
  fuel_liters: string | number | null;
  fuel_cost: string | number | null;
  toll_cost: string | number | null;
  total_cost: string | number | null;
  route_geometry: {
    type?: string;
    coordinates?: number[][];
  } | null;
  created_at: string;
}

export interface SimulationPayload {
  origin: string;
  destination: string;
  vehicle_id: number;
  fuel_price: number;
  average_speed_kmh: number;
  round_trip: boolean;
}

export interface Toll {
  id: number;
  name: string;
  latitude: string | number;
  longitude: string | number;
  price: string | number;
  active: boolean;
  created_at: string;
}
