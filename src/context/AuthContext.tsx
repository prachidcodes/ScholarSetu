import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserProfile, UserRole } from '../types';
import { authService } from '../services/authService';
import { DEMO_STUDENT_PROFILE, DEMO_ADMIN_PROFILE } from '../data/mockData';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<UserProfile>;
  registerStudent: (data: {
    name: string;
    aadhaarNumber: string;
    mobileNumber: string;
    state: string;
    district?: string;
    dateOfBirth?: string;
    category?: string;
    subTribe: string;
    stCertificateNumber?: string;
    email: string;
  }) => Promise<UserProfile>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  switchDemoRole: (role: 'student' | 'admin') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const current = authService.getCurrentUser();
    setUser(current);
  }, []);

  const login = async (email: string, pass: string): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const loggedInUser = await authService.login(email, pass);
      setUser(loggedInUser);
      return loggedInUser;
    } finally {
      setIsLoading(false);
    }
  };

  const registerStudent = async (data: {
    name: string;
    aadhaarNumber: string;
    mobileNumber: string;
    state: string;
    district?: string;
    dateOfBirth?: string;
    category?: string;
    subTribe: string;
    stCertificateNumber?: string;
    email: string;
  }): Promise<UserProfile> => {
    setIsLoading(true);
    try {
      const newUser = await authService.registerStudent(data);
      setUser(newUser);
      return newUser;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    try {
      await authService.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    const updated = authService.updateProfile(updates);
    setUser(updated);
  };

  const switchDemoRole = (role: 'student' | 'admin') => {
    const profile = role === 'student' ? DEMO_STUDENT_PROFILE : DEMO_ADMIN_PROFILE;
    localStorage.setItem('scholarsetu_current_user', JSON.stringify(profile));
    setUser(profile);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || null,
        isAuthenticated: !!user,
        isLoading,
        login,
        registerStudent,
        logout,
        updateProfile,
        switchDemoRole
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
