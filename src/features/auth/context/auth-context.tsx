import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type FC,
  type ReactNode,
} from "react";
import type { User } from "@/types";
import { sessionsApi } from "../api/sessions";
import { config } from "../lib/mt-login";
import { can } from "../lib/permissions";

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

  useEffect(() => {
    sessionsApi
      .me()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    await sessionsApi.login(email, password);

    window.location.reload();
  };

  const logout = async () => {
    await sessionsApi.logout();
    setUser(null);
    window.location.replace(config.url_logout);
  };

  const loginWithMTLogin = (code: string) => {
    setLoading(true);

    sessionsApi.loginWithMTLogin(code).then(() => window.location.replace("/"));
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col font-mono gap-4">
        <div className="relative animate-pulse">
          <div className="absolute border-primary size-32 animate-spin rounded-full border-b-2"></div>
          <div className="size-32 rounded overflow-hidden p-4">
            <img
              src="/icon192.png"
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

/**
 * Verifica permissões do usuário logado.
 *
 * ```tsx
 * const can = useCan();
 * {can("properties:edit") && <BotaoEditar />}
 * ```
 *
 * Com vários guards, exige **todos**: `can("a", "b")`.
 */
export const useCan = () => {
  const { user } = useAuth();

  return useCallback(
    (...guards: string[]) => can(guards, user?.permissions),
    [user?.permissions],
  );
};
