import { http } from '../../api/http';
import type {
  ReminderCreateDTO,
  ReminderResponse,
  ReminderUpdateDTO,
} from '../../api/types';

export function getReminders(userId: string): Promise<ReminderResponse[]> {
  return http.get<ReminderResponse[]>(`/Reminder/user/${userId}`);
}

export function createReminder(dto: ReminderCreateDTO): Promise<ReminderResponse> {
  return http.post<ReminderResponse>('/Reminder', dto);
}

export function updateReminder(id: string, dto: ReminderUpdateDTO): Promise<void> {
  return http.put<void>(`/Reminder/${id}`, dto);
}

export function deleteReminder(id: string): Promise<void> {
  return http.del<void>(`/Reminder/${id}`);
}
