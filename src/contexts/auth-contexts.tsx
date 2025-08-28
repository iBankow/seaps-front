import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import React, { createContext, useContext, useEffect, useState } from "react";

type User = { id: string; name: string; email: string; role: string };

export type AuthContextType = {
  isAuthenticated: boolean;
  user: User | undefined | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await api.get("/api/v1/auth/me");
        setUser(data);
      } catch {
        setUser(undefined);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    await api.post("/api/v1/sessions", { email, password });
    const { data } = await api.get("/api/v1/auth/me");
    setUser(data.user);
    window.location.replace("/");
  };

  const logout = async () => {
    await api.delete("/api/v1/sessions");
    setUser(null);
    window.location.replace("/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin h-20 w-20" />
      </div>
    );
  }

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, loading, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth precisa estar dentro do AuthProvider");
  return context;
};
