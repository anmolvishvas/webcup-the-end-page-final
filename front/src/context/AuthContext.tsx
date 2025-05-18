import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RegisteredUser } from '../types/user';
import { userService } from '../services/userService';

interface AuthContextType {
  currentUser: RegisteredUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (firstname: string, lastname: string, username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export { useAuth };

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<RegisteredUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    const token = localStorage.getItem('token');
    if (storedUser && token) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const register = async (
    firstname: string,
    lastname: string,
    username: string,
    email: string,
    password: string
  ): Promise<void> => {
    const result = await userService.register({
      firstname,
      lastname,
      username,
      email,
      password,
      roles: ['writer'],
      isActive: true
    });
    
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Registration failed');
    }

    localStorage.setItem('token', result.data.token);
    localStorage.setItem('currentUser', JSON.stringify(result.data.user));
    setCurrentUser(result.data.user);
  };

  const login = async (email: string, password: string): Promise<void> => {
    const result = await userService.login(email, password);
    
    if (!result.success || !result.data) {
      throw new Error(result.error || 'Login failed');
    }

    localStorage.setItem('token', result.data.token);
    localStorage.setItem('currentUser', JSON.stringify(result.data.user));
    setCurrentUser(result.data.user);
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        register,
        logout,
        isLoading,
        isAuthenticated: !!currentUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
 