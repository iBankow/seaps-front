import {
  createContext,
  useContext,
  useEffect,
  useState,
  type FC,
  type ReactNode,
} from "react";
import { api } from "@/lib/api";
import { config } from "@/lib/mt-login";

type User = {
  id: string;
  name: string;
  email: string;
  permissions: string[];
  is_active: boolean;
  is: boolean;
};

export type AuthContextType = {
  isAuthenticated: boolean;
  user: User | undefined | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loginWithMTLogin: (code: string) => void;
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

  const loginWithMTLogin = (code: string) => {
    setLoading(true);

    api
      .post("/api/v1/sessions/mt-login?code=" + code, { code })
      .then(() => window.location.replace("/"));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col font-mono gap-4">
        <div className="relative animate-pulse">
          <div className="absolute border-primary size-32 animate-spin rounded-full border-b-2"></div>
          <div className="size-32 rounded overflow-hidden p-4">
            <img
              src="/logo-app.png"
              alt="Logo Governo"
              className="rounded-full"
            />
          </div>
        </div>
      </div>
    );
  }

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        login,
        logout,
        loginWithMTLogin,
      }}
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
