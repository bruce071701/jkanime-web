import { Metadata } from 'next';
import Link from 'next/link';
import { Scale, AlertTriangle, Globe, Shield, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Términos de Servicio y Descargo de Responsabilidad - AnimeES',
  description: 'Términos de uso, condiciones de servicio y descargo de responsabilidad legal de AnimeES.',
  keywords: 'términos, condiciones, descargo responsabilidad, AnimeES, legal, uso',
};

export default function TerminosPage() {
  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <Scale className="h-16 w-16 text-primary-500 mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Términos de Servicio</h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          Términos de uso, condiciones de servicio y descargo de responsabilidad legal
        </p>
        <p className="text-sm text-gray-400 mt-4">
          Última actualización: 23 de enero de 2025
        </p>
      </div>

      {/* Important Notice */}
      <div className="bg-red-900/20 border border-red-700 rounded-2xl p-8 mb-12">
        <div className="flex items-center mb-6">
          <AlertTriangle className="h-8 w-8 text-red-400 mr-3" />
          <h2 className="text-2xl font-bold text-red-300">Aviso Importante</h2>
        </div>
        
        <div className="space-y-4 text-gray-300">
          <p className="text-lg font-semibold text-white">
            AnimeES es exclusivamente un agregador de enlaces públicos disponibles en internet.
          </p>
          
          <div className="bg-red-900/30 rounded-lg p-4">
            <h4 className="font-semibold text-red-200 mb-3">Funcionamiento del servicio:</h4>
            <ul className="space-y-2 text-sm">
              <li>• <strong>Motor de búsqueda:</strong> Funcionamos como un motor de búsqueda especializado en contenido de anime</li>
              <li>• <strong>Enlaces públicos:</strong> Solo indexamos y organizamos enlaces ya disponibles públicamente en internet</li>
              <li>• <strong>Sin almacenamiento:</strong> No alojamos, subimos, modificamos o almacenamos archivos de contenido multimedia</li>
              <li>• <strong>Servidores externos:</strong> Todo el contenido se reproduce desde servidores de terceros independientes</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto space-y-8">
        
        <div className="bg-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">1. Aceptación de los Términos</h2>
          
          <div className="space-y-4 text-gray-300">
            <p>
              Al acceder y utilizar AnimeES, aceptas estar sujeto a estos términos de servicio. 
              Si no estás de acuerdo con alguna parte de estos términos, no debes usar nuestro servicio.
            </p>
            
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier momento. 
              Los cambios entrarán en vigor inmediatamente después de su publicación en esta página.
            </p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">2. Naturaleza del Servicio</h2>
          
          <div className="space-y-4 text-gray-300">
            <div className="bg-blue-900/30 rounded-lg p-4">
              <h4 className="font-semibold text-blue-200 mb-3">AnimeES es:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Un agregador de enlaces públicos disponibles en internet</li>
                <li>• Un motor de búsqueda especializado en contenido de anime</li>
                <li>• Una plataforma de organización y categorización de enlaces</li>
                <li>• Un servicio de índice similar a Google o otros motores de búsqueda</li>
              </ul>
            </div>
            
            <div className="bg-red-900/30 rounded-lg p-4">
              <h4 className="font-semibold text-red-200 mb-3">AnimeES NO es:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Un servicio de hosting o almacenamiento de archivos</li>
                <li>• Una plataforma de distribución de contenido</li>
                <li>• Un servidor de streaming de video</li>
                <li>• Propietario del contenido multimedia indexado</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">3. Descargo de Responsabilidad</h2>
          
          <div className="space-y-4 text-gray-300">
            <div className="bg-amber-900/30 rounded-lg p-4">
              <h4 className="font-semibold text-amber-200 mb-3">Contenido de terceros:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Todo el contenido multimedia proviene de servidores externos independientes</li>
                <li>• No tenemos control sobre la disponibilidad, calidad o legalidad del contenido externo</li>
                <li>• No somos responsables del contenido alojado en servidores de terceros</li>
                <li>• Los enlaces pueden dejar de funcionar sin previo aviso</li>
              </ul>
            </div>
            
            <div className="bg-purple-900/30 rounded-lg p-4">
              <h4 className="font-semibold text-purple-200 mb-3">Responsabilidad del usuario:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Es responsabilidad del usuario cumplir con las leyes de su jurisdicción</li>
                <li>• El acceso a contenido externo es bajo la propia responsabilidad del usuario</li>
                <li>• Los usuarios deben verificar la legalidad del contenido en su país</li>
                <li>• AnimeES no proporciona asesoramiento legal sobre el uso del contenido</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">4. Uso Aceptable</h2>
          
          <div className="space-y-4 text-gray-300">
            <h4 className="font-semibold text-white mb-2">Está permitido:</h4>
            <ul className="space-y-2 mb-4">
              <li>• Navegar y buscar contenido en la plataforma</li>
              <li>• Acceder a enlaces públicos indexados</li>
              <li>• Usar la plataforma para fines personales y no comerciales</li>
              <li>• Reportar enlaces rotos o problemas técnicos</li>
            </ul>
            
            <h4 className="font-semibold text-white mb-2">Está prohibido:</h4>
            <ul className="space-y-2">
              <li>• Usar la plataforma para actividades ilegales</li>
              <li>• Intentar hackear o comprometer la seguridad del sitio</li>
              <li>• Sobrecargar los servidores con solicitudes automatizadas</li>
              <li>• Redistribuir o revender el acceso a la plataforma</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">5. Propiedad Intelectual</h2>
          
          <div className="space-y-4 text-gray-300">
            <p>
              AnimeES respeta los derechos de propiedad intelectual. Si eres propietario de contenido 
              y consideras que tus derechos están siendo infringidos, puedes contactarnos para 
              solicitar la eliminación de enlaces específicos.
            </p>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">Proceso de eliminación:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Contacta a través de nuestra página de contacto</li>
                <li>• Proporciona información específica sobre el contenido</li>
                <li>• Incluye prueba de propiedad de los derechos</li>
                <li>• Revisaremos y responderemos en un plazo razonable</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">6. Limitación de Responsabilidad</h2>
          
          <div className="space-y-4 text-gray-300">
            <p className="font-semibold text-white">
              AnimeES se proporciona "tal como está" sin garantías de ningún tipo.
            </p>
            
            <div className="bg-gray-700 rounded-lg p-4">
              <h4 className="font-semibold text-white mb-2">No nos hacemos responsables de:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Daños directos, indirectos, incidentales o consecuentes</li>
                <li>• Pérdida de datos o interrupciones del servicio</li>
                <li>• Contenido de sitios web de terceros</li>
                <li>• Acciones de usuarios o terceros</li>
                <li>• Virus, malware o software malicioso de sitios externos</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">7. Modificaciones del Servicio</h2>
          
          <div className="space-y-4 text-gray-300">
            <p>
              Nos reservamos el derecho de modificar, suspender o discontinuar cualquier parte 
              del servicio en cualquier momento sin previo aviso.
            </p>
            
            <p>
              No seremos responsables ante ti o terceros por cualquier modificación, 
              suspensión o discontinuación del servicio.
            </p>
          </div>
        </div>

        <div className="bg-primary-900/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">8. Contacto y Soporte</h2>
          
          <div className="space-y-4 text-gray-300">
            <p>
              Si tienes preguntas sobre estos términos de servicio o necesitas reportar 
              algún problema, puedes contactarnos a través de nuestra página de contacto.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Link href="/contacto" className="btn-primary">
                Contactar Soporte
              </Link>
              <Link href="/privacidad" className="btn-secondary">
                Ver Política de Privacidad
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Back to Home */}
      <div className="text-center mt-16">
        <Link 
          href="/"
          className="inline-flex items-center text-primary-400 hover:text-primary-300 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}