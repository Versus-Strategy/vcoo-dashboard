import { BrowserRouter } from 'react-router-dom';
import { ProveedorDeAuth } from './auth/authContext';
import { useAuth } from './auth/authContext';
import Login from './pages/Login/Login';

function AppContent() {
  const { auth } = useAuth();

  if (!auth.estaAutenticado) {
    return <Login />;
  }

  return (
    <div className="min-h-screen">
      <header className="bg-white border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-primary-600">VERSUS</span>
              </div>
              <div className="hidden md:block">
                <div className="ml-10 flex items-baseline space-x-4">
                  {/* Navigation links will go here */}
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6">
                {/* User menu will go here */}
              </div>
            </div>
          </div>
        </div>
      </header>
      <main>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          {/* Page content based on role and route */}
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900">
              Bienvenido, {auth.usuario?.nombre || 'Usuario'}!
            </h1>
            <p className="mt-4 text-gray-600">
              Rol: {auth.usuario?.rol === 'cliente' ? 'Cliente' : 'Operador'}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <ProveedorDeAuth>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ProveedorDeAuth>
  );
}

export default App;
