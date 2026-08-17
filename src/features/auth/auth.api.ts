import { http } from '../../api/http';
import type { AuthResponse, LoginDTO, UserCreateDTO, UserResponse } from '../../api/types';

export function login(dto: LoginDTO): Promise<AuthResponse> {
  return http.post<AuthResponse>('/User/login', dto);
}

export function register(dto: UserCreateDTO): Promise<AuthResponse> {
  return http.post<AuthResponse>('/User/register', dto);
}

/** The signed-in user, resolved from the token. */
export function getMe(): Promise<UserResponse> {
  return http.get<UserResponse>('/User/me');
}
