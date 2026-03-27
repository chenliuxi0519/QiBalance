import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { loginAdmin as apiLogin } from './api';

const STORAGE_TOKEN = 'qb_admin_token';
const STORAGE_EMAIL = 'qb_admin_email';

type AdminAuthContextValue = {
  token: string | null;
  email: string | null;
  isAdmin: boolean;
  login: (password: string) => Promise<void>;
  logout: () => void;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_TOKEN));
  const [email, setEmail] = useState<string | null>(() => localStorage.getItem(STORAGE_EMAIL));

  const login = useCallback(async (password: string) => {
    const { token: t, email: e } = await apiLogin(password);
    localStorage.setItem(STORAGE_TOKEN, t);
    localStorage.setItem(STORAGE_EMAIL, e);
    setToken(t);
    setEmail(e);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN);
    localStorage.removeItem(STORAGE_EMAIL);
    setToken(null);
    setEmail(null);
  }, []);

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      token,
      email,
      isAdmin: Boolean(token),
      login,
      logout,
    }),
    [token, email, login, logout]
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}
