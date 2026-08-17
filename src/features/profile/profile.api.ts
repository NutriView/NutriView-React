import { http } from '../../api/http';
import type { UserUpdateDTO } from '../../api/types';

export function updateMe(dto: UserUpdateDTO): Promise<void> {
  return http.put<void>('/User/me', dto);
}
