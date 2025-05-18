export interface RegisterRequest {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  password: string;
  roles: string[];
  isActive: boolean;
}

export interface RegisteredUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserResponse {
  token: string;
  user: RegisteredUser;
} 