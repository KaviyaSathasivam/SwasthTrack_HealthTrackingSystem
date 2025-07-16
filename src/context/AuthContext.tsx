import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (userData: Partial<User> & { password: string }) => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@swasthtrack.com',
    password: 'admin123',
    name: 'System Administrator',
    role: 'admin',
    phone: '+1-555-0001',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'dr.smith@swasthtrack.com',
    password: 'doctor123',
    name: 'Dr. Sarah Smith',
    role: 'doctor',
    phone: '+1-555-0002',
    specialization: 'Cardiology',
    licenseNumber: 'MD-001-2024',
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    email: 'john.doe@email.com',
    password: 'patient123',
    name: 'John Doe',
    role: 'patient',
    phone: '+1-555-0003',
    dateOfBirth: '1985-06-15',
    address: '123 Main St, Anytown, ST 12345',
    emergencyContact: '+1-555-0004',
    createdAt: '2024-01-01T00:00:00Z'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('swasthtrack_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('swasthtrack_user', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('swasthtrack_user');
  };

  const register = async (userData: Partial<User> & { password: string }): Promise<boolean> => {
    // In a real app, this would make an API call
    const newUser: User = {
      id: Date.now().toString(),
      email: userData.email!,
      name: userData.name!,
      role: userData.role!,
      phone: userData.phone,
      specialization: userData.specialization,
      licenseNumber: userData.licenseNumber,
      dateOfBirth: userData.dateOfBirth,
      address: userData.address,
      emergencyContact: userData.emergencyContact,
      createdAt: new Date().toISOString()
    };
    
    mockUsers.push({ ...newUser, password: userData.password });
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, loading }}>
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