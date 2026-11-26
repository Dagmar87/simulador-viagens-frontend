import { api } from './client';
import type { SimulationPayload, TripSimulation } from '../types/api';

export async function getSimulations(): Promise<TripSimulation[]> {
  const response = await api.get<TripSimulation[]>('/simulations/');
  return response.data;
}

export async function getSimulation(id: number): Promise<TripSimulation> {
  const response = await api.get<TripSimulation>(`/simulations/${id}/`);
  return response.data;
}

export async function createSimulation(
  payload: SimulationPayload,
): Promise<TripSimulation> {
  const response = await api.post<TripSimulation>('/simulations/', payload);

  return response.data;
}

export async function deleteSimulation(id: number): Promise<void> {
  await api.delete(`/simulations/${id}/`);
}
