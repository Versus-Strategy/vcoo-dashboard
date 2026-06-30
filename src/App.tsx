import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProveedorDeAuth } from './auth/authContext';
import { useAuth } from './auth/authContext';
import Login from './pages/Login/Login';
import ClientLayout from '@/layouts/ClientLayout';
// Importar layouts de operador cuando se implementen
// import { OperatorLayout } from './layouts/OperatorLayout';
// Importar rutas de cliente
import RutasCliente from '@/rutas/rutasCliente';
// Importar rutas de operador cuando se implementen
// import { RutasOperador } from './rutas/rutasOperador';

function AppContent() {
  const { auth } = useAuth();

  if (!auth.estaAutenticado) {
    return <Login />;
  }

  // Redireccionar basado en el rol
  if (auth.usuario?.rol === 'cliente') {
    return (
      <ClientLayout>
        <RutasCliente />
      </ClientLayout>
    );
  } else if (auth.usuario?.rol === 'operador') {
    // Para operador, mostrar layout de operador cuando esté implementado
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <header className="bg-white border-b">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <span className="text-xl font-bold text-primary-600">VERSUS</span>
                <span className="ml-2 text-sm text-gray-400">| VCOO</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {auth.usuario?.nombre || 'Usuario'}
                </span>
                <button
                  onClick={() => {/* implementar logout */}}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 container mx-auto px-4 py-6">
          {/* Rutas de operador irán aquí cuando se implementen */}
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900">
              Panel de Operador
            </h1>
            <p className="mt-4 text-gray-600">
              Bienvenido, {auth.usuario?.nombre || 'Operador'}! 
              La interfaz de operador está en desarrollo.
            </p>
          </div>
        </main>
        <footer className="bg-white border-t border-gray-200 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <p className="text-center text-sm text-gray-500">
              &copy; {new Date().getFullYear()} VERSUS Strategy. Todos los derechos reservados.
            </p>
          </div>
        </footer>
      </div>
    );
  }

  // Caso por defecto (no debería ocurrir)
  return (
    <div className="min-h-flex flex-col items-center justify-center py-12">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">
        Cargando...
      </h1>
      <p className="text-gray-600">Redirigiendo según su rol...</p>
    </div>
  );
}

function App() {
  return (
    <ProveedorDeAuth>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppContent />} />
          {/* Ruta explícita para login por si acaso */}
          <Route path="/login" element={<Login />} />
          {/* Redirección de cualquier otra ruta no encontrada al home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </ProveedorDeAuth>
  );
}

export default App;