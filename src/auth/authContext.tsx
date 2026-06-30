import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Usuario {
  id: string;
  email: string;
  nombre: string;
  rol: 'cliente' | 'operador';
  avatar?: string;
}

export interface AuthState {
  usuario: Usuario | null;
  token: string | null;
  refreshToken: string | null;
  estaAutenticado: boolean;
  cargando: boolean;
  error: string | null;
}

export interface AuthContextType {
  auth: AuthState;
  iniciarSesion: (email: string, password: string) => Promise<void>;
  cerrarSesion: () => void;
  actualizarToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthData {
  usuario: Usuario;
  token: string;
  refreshToken: string;
  marcaDeTiempo: number;
}

export const ProveedorDeAuth = ({ children }: { children: ReactNode }) => {
  const [auth, setAuth] = useState<AuthState>({
    usuario: null,
    token: null,
    refreshToken: null,
    estaAutenticado: false,
    cargando: false,
    error: null
  });

  // Load auth from localStorage on init
  useEffect(() => {
    try {
      const datosDeAuth = localStorage.getItem('vcoo-auth');
      if (datosDeAuth) {
        const analizado: AuthData = JSON.parse(datosDeAuth);
        // Simple validation - check expiry (24h)
        if (Date.now() - analizado.marcaDeTiempo < 24 * 60 * 60 * 1000) {
          setAuth({
            usuario: analizado.usuario,
            token: analizado.token,
            refreshToken: analizado.refreshToken,
            estaAutenticado: !!analizado.token,
            cargando: false,
            error: null
          });
        }
      }
    } catch {
      localStorage.removeItem('vcoo-auth');
    }
  }, []);

  const iniciarSesion = async (email: string, _password: string) => {
    setAuth(prev => ({ ...prev, cargando: true, error: null }));
    try {
      // Simulate API call - replace with real API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simulate successful login
      const usuarioMock: Usuario = {
        id: 'usuario_123',
        email,
        nombre: email.split('@')[0],
        rol: email.includes('admin') ? 'operador' : 'cliente',
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=random`
      };

      const tokenMock = 'mock_jwt_token_' + Date.now();
      const refreshTokenMock = 'mock_refresh_token_' + Date.now();

      setAuth({
        usuario: usuarioMock,
        token: tokenMock,
        refreshToken: refreshTokenMock,
        estaAutenticado: true,
        cargando: false,
        error: null
      });

      // Save to localStorage
      localStorage.setItem('vcoo-auth', JSON.stringify({
        usuario: usuarioMock,
        token: tokenMock,
        refreshToken: refreshTokenMock,
        marcaDeTiempo: Date.now()
      }));
    } catch (error) {
      setAuth(prev => ({
        ...prev,
        cargando: false,
        error: error instanceof Error ? error.message : 'Inicio de sesión fallido'
      }));
    }
  };

  const cerrarSesion = () => {
    setAuth({
      usuario: null,
      token: null,
      refreshToken: null,
      estaAutenticado: false,
      cargando: false,
      error: null
    });
    localStorage.removeItem('vcoo-auth');
  };

  const actualizarToken = async () => {
    if (auth.refreshToken) {
      const newToken = `refreshed_${Date.now()}`;
      const newRefreshToken = `refreshed_${Date.now()}_rt`;

      setAuth(prev => ({
        ...prev,
        token: newToken,
        refreshToken: newRefreshToken
      }));

      try {
        const stored = JSON.parse(localStorage.getItem('vcoo-auth') || '{}');
        stored.token = newToken;
        stored.refreshToken = newRefreshToken;
        stored.marcaDeTiempo = Date.now();
        localStorage.setItem('vcoo-auth', JSON.stringify(stored));
      } catch {
        // Ignore localStorage errors
      }
    }
  };

  return (
    <AuthContext.Provider value={{ auth, iniciarSesion, cerrarSesion, actualizarToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe usarse dentro de un ProveedorDeAuth');
  }
  return context;
};
