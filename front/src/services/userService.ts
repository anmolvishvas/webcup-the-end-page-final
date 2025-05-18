import axios from "axios";
import { RegisterRequest, UserResponse } from "../types/user";

const API_URL = "/api";

interface ApiError {
  message: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: {
    id: number;
    firstname: string;
    lastname: string;
    email: string;
    roles: string[];
  }
}

export const userService = {
  register: async (userData: RegisterRequest): Promise<{ success: boolean; data?: UserResponse; error?: string }> => {
    try {
      const response = await axios.post<UserResponse>(
        `${API_URL}/register`,
        userData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return {
        success: true,
        data: response.data,
      };
    } catch (error) {
      const axiosError = error as { response?: { data: ApiError } };
      if (axiosError.response?.data?.message) {
        return {
          success: false,
          error: axiosError.response.data.message,
        };
      }
      return {
        success: false,
        error: "Registration failed",
      };
    }
  },

  login: async (email: string, password: string): Promise<{ success: boolean; data?: UserResponse; error?: string }> => {
    try {
      const response = await axios.post<LoginResponse>(
        `${API_URL}/auth/login_check`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return {
        success: true,
        data: {
          token: response.data.token,
          user: {
            id: response.data.user.id,
            firstName: response.data.user.firstname,
            lastName: response.data.user.lastname,
            email: response.data.user.email
          }
        },
      };
    } catch (error) {
      const axiosError = error as { response?: { data: ApiError } };
      if (axiosError.response?.data?.message) {
        return {
          success: false,
          error: axiosError.response.data.message,
        };
      }
      return {
        success: false,
        error: "Login failed",
      };
    }
  },

  decrementAttempts: async (userId: number): Promise<{ success: boolean; attemptsLeft?: number; hasAttempts?: boolean; error?: string }> => {
    try {
      const response = await axios.put<{ attempts_left: number; has_attempts: boolean }>(
        `${API_URL}/attempts/${userId}`
      );

      return {
        success: true,
        attemptsLeft: response.data.attempts_left,
        hasAttempts: response.data.has_attempts
      };
    } catch (error) {
      const axiosError = error as { response?: { data: { message: string } } };
      if (axiosError.response?.data?.message) {
        return {
          success: false,
          error: axiosError.response.data.message,
        };
      }
      return {
        success: false,
        error: "Failed to update attempts",
      };
    }
  }
};
