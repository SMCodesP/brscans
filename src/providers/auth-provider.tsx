'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
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

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export function AuthProvider({
  children,
}: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const saveAuth = useCallback((token: string, user: User) => {
    setToken(token);
    setUser(user);
    localStorage.setItem('auth_token', token);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('auth_token');
  }, []);

  // Load token on mount
  useEffect(() => {
    const stored = localStorage.getItem('auth_token');
    if (stored) {
      setToken(stored);
      fetch(`${API_URL}/auth/me/`, {
        headers: { Authorization: `Token ${stored}` },
      })
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then((data) => setUser(data))
        .catch(() => {
          localStorage.removeItem('auth_token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(
    async (username: string, password: string) => {
      const res = await fetch(`${API_URL}/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Falha no login.');
      }

      const data = await res.json();
      saveAuth(data.token, data.user);
    },
    [saveAuth]
  );

  const register = useCallback(
    async (username: string, password: string, email?: string) => {
      const res = await fetch(`${API_URL}/auth/register/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg =
          data.username?.[0] ||
          data.password?.[0] ||
          data.error ||
          'Falha no registro.';
        throw new Error(msg);
      }

      const data = await res.json();
      saveAuth(data.token, data.user);
    },
    [saveAuth]
  );

  const loginWithDiscord = useCallback(
    async (code: string, redirectUri: string) => {
      const res = await fetch(`${API_URL}/auth/discord/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, redirect_uri: redirectUri }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(
          data.error || 'Falha na autenticação Discord.'
        );
      }

      const data = await res.json();
      saveAuth(data.token, data.user);
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
