'use client';

import React, { createContext, useContext } from 'react';
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";
import type { Role, User } from '@/types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  switchRole: (role: Role) => void;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function AuthProviderInner({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  const user: User | null = session?.user ? {
    id: session.user.id || "1",
    name: session.user.name || "User",
    email: session.user.email || "",
    role: (session.user.role as Role) || "VIEWER",
    workspaceId: session.user.workspaceId || "demo-workspace-id",
    createdAt: new Date().toISOString()
  } : null;

  const login = async (email: string, password: string) => {
    return signIn("credentials", { email, password, redirect: false });
  };

  const logout = () => {
    signOut({ callbackUrl: "/login" });
  };

  const switchRole = (_role: Role) => {};
  const updateUser = (_updates: Partial<User>) => {};

  return (
    <AuthContext.Provider value={{
      user,
      isLoading: status === "loading",
      login,
      logout,
      switchRole,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderInner>
        {children}
      </AuthProviderInner>
    </SessionProvider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
