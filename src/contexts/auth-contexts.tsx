import {
  createContext,
  useContext,
  useEffect,
  useState,
  type FC,
  type ReactNode,
} from "react";
// import { redirect } from "@tanstack/react-router";
import { api } from "@/lib/api";
import { Loader2 } from "lucide-react";
import { config } from "@/lib/mt-login";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  is: boolean;
};

export type AuthContextType = {
  isAuthenticated: boolean;
  user: User | undefined | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null | undefined>();
  const [loading, setLoading] = useState(true);

  const getUserData = () =>
    api
      .get("/api/v1/auth/me")
      .then(({ data }) => setUser(data))
      .finally(() => setLoading(false));

  useEffect(() => {
    getUserData();
  }, []);

  const login = async (email: string, password: string) => {
    await api.post("/api/v1/sessions", { email, password });

    window.location.reload();
  };

  const logout = async () => {
    api.delete("/api/v1/sessions").then(() => {
      setUser(null);
      window.location.replace(config.url_logout);
    });
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
