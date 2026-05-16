import React, { createContext, useContext, useState, useEffect } from "react";
import {
  clearTokens,
  getStoredTokens,
  refreshAccessToken,
  storeTokens,
} from "@/api/client";
import { fetchProfile } from "@/api/auth";
import type { User } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  login: (token: string, refreshToken: string, user: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const { access, refresh } = getStoredTokens();
    if (access && refresh) {
      setToken(access);
      setRefreshToken(refresh);
      loadUser(access, refresh);
    } else {
      setIsLoading(false);
    }
  }, []);

  const loadUser = async (access: string, refresh: string) => {
    try {
      let activeToken = access;
      let profile = await fetchProfile(activeToken).catch(() => null);

      if (!profile) {
        const renewed = await refreshAccessToken(refresh);
        if (!renewed) {
          logout();
          return;
        }
        activeToken = renewed;
        setToken(renewed);
        profile = await fetchProfile(renewed);
      }

      setUser(profile);
    } catch {
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = (newToken: string, newRefreshToken: string, newUser: User) => {
    storeTokens(newToken, newRefreshToken);
    setToken(newToken);
    setRefreshToken(newRefreshToken);
    setUser(newUser);
  };

  const logout = () => {
    clearTokens();
    setToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, refreshToken, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
