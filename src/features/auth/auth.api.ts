import { http } from '../../api/http';
import type { LoginDTO, UserCreateDTO, UserResponse } from '../../api/types';

export function login(dto: LoginDTO): Promise<UserResponse> {
  return http.post<UserResponse>('/User/login', dto);
}

export function register(dto: UserCreateDTO): Promise<UserResponse> {
  return http.post<UserResponse>('/User', dto);
}
