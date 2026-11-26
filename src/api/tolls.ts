import { api } from "./client";
import type { Toll } from "../types/api";

export async function getTolls(): Promise<Toll[]> {
  const response = await api.get<Toll[]>("/tolls/");
  return response.data;
}