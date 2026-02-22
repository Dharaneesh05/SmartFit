import React, { createContext, useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (fullName: string, username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const queryClient = useQueryClient();

  // Get stored token
  const token = localStorage.getItem('authToken');

  // Fetch current user if token exists
  const { data: userData, isLoading } = useQuery({
    queryKey: ['/api/auth/me'],
    enabled: !!token,
    retry: false,
  });

  useEffect(() => {
    if (userData) {
      setUser(userData as User);
    }
  }, [userData]);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const response = await apiRequest('POST', '/api/auth/login', { email, password });
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('authToken', data.token);
      setUser(data.user);
      queryClient.invalidateQueries();
    },
  });

  const signupMutation = useMutation({
    mutationFn: async ({ fullName, username, email, password }: { fullName: string; username: string; email: string; password: string }) => {
      const response = await apiRequest('POST', '/api/auth/signup', { fullName, username, email, password });
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.setItem('authToken', data.token);
      setUser(data.user);
      queryClient.invalidateQueries();
    },
  });

  const login = async (email: string, password: string) => {
    await loginMutation.mutateAsync({ email, password });
  };

  const signup = async (fullName: string, username: string, email: string, password: string) => {
    await signupMutation.mutateAsync({ fullName, username, email, password });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    queryClient.clear();
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      signup,
      logout,
      isLoading: isLoading || loginMutation.isPending || signupMutation.isPending,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// HTTP interceptor to add auth token to requests
const originalFetch = window.fetch;
window.fetch = function(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const token = localStorage.getItem('authToken');
  
  if (token && init?.headers) {
    const headers = new Headers(init.headers);
    headers.set('Authorization', `Bearer ${token}`);
    init = { ...init, headers };
  } else if (token) {
    init = {
      ...init,
      headers: {
        ...init?.headers,
        'Authorization': `Bearer ${token}`,
      },
    };
  }
  
  return originalFetch.call(this, input, init);
};
