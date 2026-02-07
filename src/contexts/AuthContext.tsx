import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole, name?: string) => boolean;
  logout: () => void;
  updateAvatar: (url: string) => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<UserRole, User> = {
  admin: { id: '1', name: 'Administrador', email: 'admin@gestaochurch.com', role: 'admin' },
  pastor: { id: '9', name: 'Pastor Principal', email: 'pastor@gestaochurch.com', role: 'pastor' },
  secretario: { id: '2', name: 'Maria Silva', email: 'secretario@gestaochurch.com', role: 'secretario' },
  tesoureiro: { id: '3', name: 'Carlos Santos', email: 'tesoureiro@gestaochurch.com', role: 'tesoureiro' },
  membro: { id: '4', name: 'Ana Oliveira', email: 'membro@gestaochurch.com', role: 'membro' },
  lider_celula: { id: '5', name: 'Líder Pedro', email: 'celula@gestaochurch.com', role: 'lider_celula' },
  lider_ministerio: { id: '6', name: 'Líder Aline', email: 'ministerio@gestaochurch.com', role: 'lider_ministerio' },
  aluno: { id: '7', name: 'Marcos Aluno', email: 'aluno@gestaochurch.com', role: 'aluno' },
  congregado: { id: '8', name: 'Visitante Frequente', email: 'congregado@gestaochurch.com', role: 'congregado' },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('church_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email: string, password: string, role: UserRole, name?: string) => {
    const userName = name || mockUsers[role]?.name || 'Usuário';
    const userId = mockUsers[role]?.id || '1';

    const newUser = {
      id: userId,
      name: userName,
      email: email,
      role: role
    };

    setUser(newUser);
    localStorage.setItem('church_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('church_user');
  };

  const updateAvatar = (url: string) => {
    if (user) {
      const updatedUser = { ...user, avatar: url };
      setUser(updatedUser);
      localStorage.setItem('church_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateAvatar, isAuthenticated: !!user }}>
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
