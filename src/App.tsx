import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProveedorDeAuth } from './auth/authContext';
import { useAuth } from './auth/authContext';
import Login from './pages/Login/Login';
import ClientLayout from '@/layouts/ClientLayout';
import OperatorLayout from '@/layouts/OperatorLayout';
// Importar rutas de cliente
import RutasCliente from '@/rutas/rutasCliente';
// Importar páginas de operador
import ClientesPage from '@/pages/operador/Clientes/Clientes';
import NuevoClientePage from '@/pages/operador/Clientes/NuevoCliente';
import DetalleClientePage from '@/pages/operador/Clientes/DetalleCliente';
// Importar wizard público de onboarding
import SetupWizard from '@/pages/public/SetupWizard/SetupWizard';

function AppContent() {
  const { auth } = useAuth();

  // Ruta pública para el wizard de onboarding — no requiere autenticación
  if (window.location.pathname.startsWith('/setup/')) {
    return <SetupWizard />;
  }

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
    return (
      <Routes>
        <Route element={<OperatorLayout />}>
          <Route
            path="/operador"
            element={<Navigate to="/operador/clientes" replace />}
          />
          <Route path="/operador/clientes" element={<ClientesPage />} />
          <Route path="/operador/clientes/nuevo" element={<NuevoClientePage />} />
          <Route path="/operador/clientes/:id" element={<DetalleClientePage />} />
        </Route>
        <Route path="*" element={<Navigate to="/operador" replace />} />
      </Routes>
    );
  }

  // Caso por defecto (no debería ocurrir)
  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-12">
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
