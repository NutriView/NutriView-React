import { http } from '../../api/http';
import type { FoodCreateDTO, FoodResponse, FoodUpdateDTO } from '../../api/types';

export function getFoods(): Promise<FoodResponse[]> {
  return http.get<FoodResponse[]>('/Food');
}

export function createFood(dto: FoodCreateDTO): Promise<FoodResponse> {
  return http.post<FoodResponse>('/Food', dto);
}

export function updateFood(id: string, dto: FoodUpdateDTO): Promise<void> {
  return http.put<void>(`/Food/${id}`, dto);
}

export function deleteFood(id: string): Promise<void> {
  return http.del<void>(`/Food/${id}`);
}
