import { http } from '../../api/http';
import type {
  FoodEntryCreateDTO,
  FoodEntryResponse,
  FoodEntryUpdateDTO,
} from '../../api/types';

export function getMyEntries(): Promise<FoodEntryResponse[]> {
  return http.get<FoodEntryResponse[]>('/FoodEntry/me');
}

export function createEntry(dto: FoodEntryCreateDTO): Promise<FoodEntryResponse> {
  return http.post<FoodEntryResponse>('/FoodEntry', dto);
}

export function updateEntry(id: string, dto: FoodEntryUpdateDTO): Promise<void> {
  return http.put<void>(`/FoodEntry/${id}`, dto);
}

export function deleteEntry(id: string): Promise<void> {
  return http.del<void>(`/FoodEntry/${id}`);
}
