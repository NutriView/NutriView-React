import { http } from '../../api/http';
import type { UserUpdateDTO } from '../../api/types';

export function updateUser(id: string, dto: UserUpdateDTO): Promise<void> {
  return http.put<void>(`/User/${id}`, dto);
}
