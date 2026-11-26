import { api } from './client';
import type { Vehicle, VehiclePayload } from '../types/api';

export async function getVehicles(): Promise<Vehicle[]> {
  const response = await api.get<Vehicle[]>('/vehicles/');
  return response.data;
}

export async function createVehicle(payload: VehiclePayload): Promise<Vehicle> {
  const response = await api.post<Vehicle>('/vehicles/', payload);
  return response.data;
}

export async function deleteVehicle(id: number): Promise<void> {
  await api.delete(`/vehicles/${id}/`);
}
