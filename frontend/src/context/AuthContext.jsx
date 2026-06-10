import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('bolao_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('bolao_token'));

  const login = (payload) => {
    setUser(payload.user);
    setToken(payload.token);
    localStorage.setItem('bolao_user', JSON.stringify(payload.user));
    localStorage.setItem('bolao_token', payload.token);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('bolao_user');
    localStorage.removeItem('bolao_token');
  };

  const value = useMemo(
    () => ({
      user,
      token,
      isAuthenticated: Boolean(token),
      isAdmin: user?.tipoUsuario === 'ADMIN',
      login,
      logout,
      setUser,
    }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
