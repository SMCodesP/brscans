'use client';

import { api } from '@/services/api';
import { deleteCookie, setCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';

interface User {
  id: number;
  username: string;
  email: string;
  profile: {
    avatar: string | null;
    bio: string;
    discord_id: string | null;
    discord_username: string | null;
    created_at: string;
  } | null;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (
    username: string,
    password: string,
    email?: string
  ) => Promise<void>;
  loginWithDiscord: (
    code: string,
    redirectUri: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  loginWithDiscord: async () => {},
  logout: () => {},
});

export function AuthProvider({
  children,
  initialUser = null,
  initialToken = null,
}: {
  children: React.ReactNode;
  initialUser?: User | null;
  initialToken?: string | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [token, setToken] = useState<string | null>(initialToken);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const saveAuth = useCallback(
    (newToken: string, newUser: User) => {
      setToken(newToken);
      setUser(newUser);
      setCookie('auth_token', newToken, {
        maxAge: 30 * 24 * 60 * 60,
        path: '/',
      });
      router.refresh();
    },
    [router]
  );

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    deleteCookie('auth_token', { path: '/' });
    router.refresh();
  }, [router]);

  const login = useCallback(
    async (username: string, password: string) => {
      try {
        const data = await api
          .post('auth/login/', {
            json: { username, password },
          })
          .json<{ token: string; user: User }>();
        saveAuth(data.token, data.user);
      } catch (err: any) {
        const errorData = await err.response
          ?.json()
          .catch(() => ({}));
        throw new Error(errorData?.error || 'Falha no login.');
      }
    },
    [saveAuth]
  );

  const register = useCallback(
    async (username: string, password: string, email?: string) => {
      try {
        const data = await api
          .post('auth/register/', {
            json: { username, password, email },
          })
          .json<{ token: string; user: User }>();
        saveAuth(data.token, data.user);
      } catch (err: any) {
        const errorData = await err.response
          ?.json()
          .catch(() => ({}));
        const msg =
          errorData?.username?.[0] ||
          errorData?.password?.[0] ||
          errorData?.error ||
          'Falha no registro.';
        throw new Error(msg);
      }
    },
    [saveAuth]
  );

  const loginWithDiscord = useCallback(
    async (code: string, redirectUri: string) => {
      try {
        const data = await api
          .post('auth/discord/', {
            json: { code, redirect_uri: redirectUri },
          })
          .json<{ token: string; user: User }>();
        saveAuth(data.token, data.user);
      } catch (err: any) {
        const errorData = await err.response
          ?.json()
          .catch(() => ({}));
        throw new Error(
          errorData?.error || 'Falha na autenticação Discord.'
        );
      }
    },
    [saveAuth]
  );

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        loginWithDiscord,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
