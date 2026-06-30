import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usarAccionesCliente } from '../../../../store/useAppStore';
import StepIndicator from '../../../../components/StepIndicator';
import Button from '../../../../components/Button';

const InstalacionDeAgente = () => {
  const [estaCopiado, setEstaCopiado] = useState(false);
  const [estaInstalado, setEstaInstalado] = useState(false);
  const [ultimaVerificacion, setUltimaVerificacion] = useState<Date | null>(null);
  const navigate = useNavigate();
  const { establecerPasoDeIncorporacion } = usarAccionesCliente();

  const oneliner = `curl -fsSL https://vcoo-onboarding.vercel.app/install.sh | \\\n  PROVISION_TOKEN="tu-token" PROVISION_ID="tu-id-aqui" bash`;

  // Simulate polling for installation status
  useEffect(() => {
    if (!estaInstalado) {
      const interval = setInterval(() => {
        setUltimaVerificacion(new Date());
        // Simulate 30% chance of installation completion per check
        if (Math.random() < 0.3) {
          setEstaInstalado(true);
        }
      }, 15000); // 15 seconds

      return () => clearInterval(interval);
    }
  }, [estaInstalado]);

  const manejarCopiar = () => {
    navigator.clipboard.writeText(oneliner);
    setEstaCopiado(true);
    setTimeout(() => setEstaCopiado(false), 2000);
  };

  const manejarCompletar = () => {
    establecerPasoDeIncorporacion(1);
    navigate('/configuracion/configuracion-de-proveedor');
  };

  return (
    <div className="space-y-6">
      <StepIndicator
        pasoActual={0}
        pasosTotales={4}
        pasos={['Instalar Agente', 'Configurar Proveedor de IA', 'Configurar Módulos', 'Finalización']}
      />

      <div className="space-y-4">
        <div className="border rounded-lg p-4 bg-gray-50">
          <h3 className="font-semibold text-gray-900 mb-2">
            Comando de instalación personalizado
          </h3>
          <pre className="bg-gray-800 text-gray-100 p-3 rounded overflow-auto text-sm">
            <code>{oneliner}</code>
          </pre>
          <button
            onClick={manejarCopiar}
            className="mt-2 flex items-center px-3 py-1.5 text-sm font-medium transition-colors duration-200 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
          >
            {estaCopiado ? '✅ Copiado' : '📋 Copiar comando'}
          </button>
        </div>

        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 mb-2">Instrucciones de instalación</h3>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Abre una terminal en tu VPS (conexión SSH)</li>
            <li>Pega el comando copiado (Ctrl+V o Cmd+V)</li>
            <li>Presiona Enter y espera a que termine la instalación</li>
            <li>¡Vuelve aquí y marca el paso como completado!</li>
          </ol>
        </div>

        <div className="border-t pt-4">
          <div className="flex justify-between items-start">
            <span className="text-sm text-gray-500">
              Última verificación:{' '}
              {ultimaVerificacion ? ultimaVerificacion.toLocaleTimeString() : 'Nunca'}
            </span>
            {!estaInstalado ? (
              <div className="flex space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setUltimaVerificacion(new Date())}
                >
                  Verificar ahora
                </Button>
                <Button
                  onClick={manejarCompletar}
                  disabled={!estaInstalado}
                  variant="primary"
                  size="sm"
                >
                  Marcar como completado
                </Button>
              </div>
            ) : (
              <span className="text-green-600 font-medium">✅ Instalado correctamente</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstalacionDeAgente;
