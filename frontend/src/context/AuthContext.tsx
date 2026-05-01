import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

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
    const storedToken = localStorage.getItem("token");
    const storedRefreshToken = localStorage.getItem("refreshToken");
    if (storedToken && storedRefreshToken) {
      setToken(storedToken);
      setRefreshToken(storedRefreshToken);
      fetchUser(storedToken, storedRefreshToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  const refreshAccessToken = async (currentRefreshToken: string) => {
    try {
      const response = await fetch("/api/auth/token/refresh/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refresh: currentRefreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.access);
        setToken(data.access);
        return data.access;
      }
    } catch (error) {
      console.error("Failed to refresh token", error);
    }
    return null;
  };

  const fetchUser = async (currentToken: string, currentRefreshToken: string) => {
    try {
      let response = await fetch("/api/auth/profile/", {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      if (response.status === 401) {
        // Token expired, try to refresh
        const newToken = await refreshAccessToken(currentRefreshToken);
        if (newToken) {
          response = await fetch("/api/auth/profile/", {
            headers: {
              Authorization: `Bearer ${newToken}`,
            },
          });
        }
      }

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        // Refresh failed or other error
        logout();
      }
    } catch (error) {
      console.error("Failed to fetch user", error);
      logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = (newToken: string, newRefreshToken: string, newUser: User) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("refreshToken", newRefreshToken);
    setToken(newToken);
    setRefreshToken(newRefreshToken);
    setUser(newUser);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
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
