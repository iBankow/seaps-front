import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { config } from "@/lib/mt-login";
import api, { authAPI, type User } from "#/lib/axios";

export type AuthContextType = {
  isAuthenticated: boolean;
  user: User | undefined | null;
  loading: boolean;
  logout: () => Promise<void>;
  loginWithMTLogin: (code: string) => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null | undefined>();
  const [loading, setLoading] = useState(true);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;

    async function checkAuth() {
      try {
        const userData = await authAPI.getMe();

        setUser(userData);
      } catch (error: any) {
        if (error.response?.status === 401) {
          setUser(null);
        } else {
          console.error("Erro ao verificar autenticação:", error);
          setUser(null);
        }
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    }

    checkAuth();
  }, [initialized]);

  const logout = async () => {
    api.delete("sessions").then(() => {
      setUser(null);
      window.location.replace(config.url_logout);
    });
  };

  const loginWithMTLogin = (code: string) => {
    setLoading(true);

    api
      .post("sessions/mt-login?code=" + code, { code })
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
        {/* <p className="text-foreground">carregando...</p> */}
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
