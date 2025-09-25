import { Metadata } from 'next';
import Link from 'next/link';
import { Shield, Eye, Lock, Cookie, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Política de Privacidad - AnimeES',
  description: 'Conoce cómo AnimeES protege tu privacidad y maneja tus datos personales.',
  keywords: 'privacidad, política, datos personales, AnimeES, protección datos',
};

export default function PrivacidadPage() {
  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <Shield className="h-16 w-16 text-primary-500 mx-auto mb-6" />
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Política de Privacidad</h1>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto">
          En AnimeES, tu privacidad es importante para nosotros. Esta política explica cómo recopilamos, 
          usamos y protegemos tu información.
        </p>
        <p className="text-sm text-gray-400 mt-4">
          Última actualización: 23 de enero de 2025
        </p>
      </div>

      {/* Quick Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <Eye className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Transparencia</h3>
          <p className="text-gray-400 text-sm">
            Te explicamos claramente qué datos recopilamos y por qué
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <Lock className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Seguridad</h3>
          <p className="text-gray-400 text-sm">
            Protegemos tu información con medidas de seguridad avanzadas
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 text-center">
          <Cookie className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Control</h3>
          <p className="text-gray-400 text-sm">
            Tienes control sobre tus datos y puedes gestionarlos fácilmente
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto prose prose-invert prose-lg">
        <div className="bg-amber-900/20 border border-amber-700 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-amber-300">⚠️ Importante: Naturaleza del Servicio</h2>
          
          <div className="space-y-4 text-gray-300">
            <p className="text-lg font-semibold text-white">
              AnimeES es un agregador de contenido que NO aloja ni almacena archivos de video.
            </p>
            
            <div className="bg-amber-900/30 rounded-lg p-4">
              <h4 className="font-semibold text-amber-200 mb-2">Funcionamiento de la plataforma:</h4>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Agregación de enlaces:</strong> Recopilamos enlaces públicos disponibles en internet</li>
                <li>• <strong>Sin almacenamiento:</strong> No almacenamos, subimos ni distribuimos archivos de video</li>
                <li>• <strong>Servidores externos:</strong> Todo el contenido se reproduce desde servidores de terceros</li>
                <li>• <strong>Índice público:</strong> Funcionamos como un índice de contenido disponible públicamente</li>
              </ul>
            </div>
            
            <p className="text-sm text-amber-200">
              <strong>Nota legal:</strong> Los usuarios acceden directamente a servidores externos. 
              AnimeES no tiene control sobre el contenido alojado en dichos servidores.
            </p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">1. Información que Recopilamos</h2>
          
          <h3 className="text-xl font-semibold mb-4">Información que nos proporcionas</h3>
          <ul className="space-y-2 text-gray-300 mb-6">
            <li>• Información de contacto cuando nos escribes (nombre, email)</li>
            <li>• Comentarios y sugerencias que nos envías</li>
            <li>• Reportes de problemas técnicos</li>
          </ul>

          <h3 className="text-xl font-semibold mb-4">Información recopilada automáticamente</h3>
          <ul className="space-y-2 text-gray-300 mb-6">
            <li>• Dirección IP y ubicación aproximada</li>
            <li>• Tipo de navegador y dispositivo</li>
            <li>• Páginas visitadas y tiempo de navegación</li>
            <li>• Preferencias de idioma y configuración</li>
          </ul>

          <h3 className="text-xl font-semibold mb-4">Información que NO recopilamos</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• <strong>Archivos de video:</strong> No almacenamos ni procesamos contenido multimedia</li>
            <li>• <strong>Datos de streaming:</strong> No registramos qué contenido específico visualizas</li>
            <li>• <strong>Información de servidores externos:</strong> No tenemos acceso a datos de terceros</li>
          </ul>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">2. Cómo Usamos tu Información</h2>
          
          <div className="space-y-4 text-gray-300">
            <div>
              <h4 className="font-semibold text-white mb-2">Para mejorar nuestro servicio:</h4>
              <p>Analizamos el uso de la plataforma para identificar problemas y mejorar la experiencia del usuario.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-2">Para comunicarnos contigo:</h4>
              <p>Respondemos a tus consultas, sugerencias y reportes de problemas.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-2">Para personalizar tu experiencia:</h4>
              <p>Recordamos tus preferencias para ofrecerte una experiencia más personalizada.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-2">Para mantener la seguridad:</h4>
              <p>Protegemos la plataforma contra uso indebido y actividades maliciosas.</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">3. Cookies y Tecnologías Similares</h2>
          
          <div className="space-y-4 text-gray-300">
            <p>
              Utilizamos cookies y tecnologías similares para mejorar tu experiencia en AnimeES:
            </p>
            
            <div>
              <h4 className="font-semibold text-white mb-2">Cookies esenciales:</h4>
              <p>Necesarias para el funcionamiento básico de la plataforma.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-2">Cookies de preferencias:</h4>
              <p>Recuerdan tus configuraciones y preferencias de idioma.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-2">Cookies analíticas:</h4>
              <p>Nos ayudan a entender cómo usas la plataforma para mejorarla.</p>
            </div>
            
            <p className="mt-4">
              Puedes gestionar las cookies desde la configuración de tu navegador.
            </p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">4. Responsabilidad del Contenido</h2>
          
          <div className="space-y-4 text-gray-300">
            <div className="bg-blue-900/30 rounded-lg p-4">
              <h4 className="font-semibold text-blue-200 mb-2">Descargo de responsabilidad:</h4>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Contenido de terceros:</strong> Todo el contenido multimedia proviene de servidores externos</li>
                <li>• <strong>Sin control directo:</strong> No controlamos la disponibilidad, calidad o legalidad del contenido externo</li>
                <li>• <strong>Enlaces públicos:</strong> Solo proporcionamos enlaces a contenido ya disponible públicamente</li>
                <li>• <strong>Responsabilidad del usuario:</strong> Los usuarios acceden directamente a servidores de terceros</li>
              </ul>
            </div>
            
            <p className="font-semibold text-white">
              Respecto a tu información personal, no la vendemos, alquilamos ni compartimos con terceros, excepto:
            </p>
            
            <ul className="space-y-2">
              <li>• <strong>Proveedores de servicios:</strong> Empresas que nos ayudan a operar la plataforma</li>
              <li>• <strong>Cumplimiento legal:</strong> Cuando sea requerido por ley o autoridades competentes</li>
              <li>• <strong>Protección de derechos:</strong> Para proteger nuestros derechos legales o los de nuestros usuarios</li>
            </ul>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">5. Seguridad de los Datos</h2>
          
          <div className="space-y-4 text-gray-300">
            <p>
              Implementamos medidas de seguridad técnicas y organizativas para proteger tu información:
            </p>
            
            <ul className="space-y-2">
              <li>• Cifrado de datos en tránsito y en reposo</li>
              <li>• Acceso restringido a información personal</li>
              <li>• Monitoreo regular de sistemas de seguridad</li>
              <li>• Actualizaciones de seguridad periódicas</li>
            </ul>
            
            <p className="mt-4">
              Sin embargo, ningún sistema es 100% seguro. Te recomendamos tomar precauciones 
              adicionales para proteger tu información personal.
            </p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">6. Tus Derechos</h2>
          
          <div className="space-y-4 text-gray-300">
            <p>Tienes los siguientes derechos respecto a tu información personal:</p>
            
            <ul className="space-y-2">
              <li>• <strong>Acceso:</strong> Solicitar información sobre los datos que tenemos sobre ti</li>
              <li>• <strong>Rectificación:</strong> Corregir información inexacta o incompleta</li>
              <li>• <strong>Eliminación:</strong> Solicitar la eliminación de tus datos personales</li>
              <li>• <strong>Portabilidad:</strong> Obtener una copia de tus datos en formato estructurado</li>
              <li>• <strong>Oposición:</strong> Oponerte al procesamiento de tus datos en ciertos casos</li>
            </ul>
            
            <p className="mt-4">
              Para ejercer estos derechos, contáctanos a través de nuestra 
              <Link href="/contacto" className="text-primary-400 hover:text-primary-300"> página de contacto</Link>.
            </p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">7. Retención de Datos</h2>
          
          <div className="space-y-4 text-gray-300">
            <p>
              Conservamos tu información personal solo durante el tiempo necesario para:
            </p>
            
            <ul className="space-y-2">
              <li>• Proporcionar nuestros servicios</li>
              <li>• Cumplir con obligaciones legales</li>
              <li>• Resolver disputas</li>
              <li>• Hacer cumplir nuestros acuerdos</li>
            </ul>
            
            <p className="mt-4">
              Cuando ya no necesitemos tu información, la eliminaremos de forma segura.
            </p>
          </div>
        </div>

        <div className="bg-gray-800 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">8. Cambios a esta Política</h2>
          
          <div className="space-y-4 text-gray-300">
            <p>
              Podemos actualizar esta política de privacidad ocasionalmente. Te notificaremos 
              sobre cambios significativos publicando la nueva política en esta página.
            </p>
            
            <p>
              Te recomendamos revisar esta política periódicamente para mantenerte informado 
              sobre cómo protegemos tu información.
            </p>
          </div>
        </div>

        <div className="bg-red-900/20 border border-red-700 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-red-300">⚖️ Descargo de Responsabilidad Legal</h2>
          
          <div className="space-y-4 text-gray-300">
            <div className="bg-red-900/30 rounded-lg p-4">
              <h4 className="font-semibold text-red-200 mb-3">Naturaleza del servicio:</h4>
              <ul className="space-y-2 text-sm">
                <li>• <strong>Agregador de enlaces:</strong> AnimeES funciona exclusivamente como un motor de búsqueda y agregador de enlaces públicos disponibles en internet</li>
                <li>• <strong>Sin almacenamiento:</strong> No alojamos, almacenamos, subimos, modificamos o distribuimos ningún archivo de contenido multimedia</li>
                <li>• <strong>Servidores externos:</strong> Todo el contenido se reproduce directamente desde servidores de terceros independientes</li>
                <li>• <strong>Sin control de contenido:</strong> No tenemos control sobre el contenido, disponibilidad, velocidad o calidad de los servidores externos</li>
              </ul>
            </div>
            
            <div className="bg-red-900/30 rounded-lg p-4">
              <h4 className="font-semibold text-red-200 mb-3">Responsabilidad del usuario:</h4>
              <ul className="space-y-2 text-sm">
                <li>• Los usuarios acceden directamente a contenido alojado en servidores de terceros</li>
                <li>• Es responsabilidad del usuario cumplir con las leyes locales de su jurisdicción</li>
                <li>• El uso de enlaces externos es bajo la propia responsabilidad del usuario</li>
                <li>• AnimeES no se hace responsable del contenido de sitios web de terceros</li>
              </ul>
            </div>
            
            <p className="text-red-200 font-semibold text-center mt-4">
              AnimeES actúa únicamente como un índice de enlaces públicos, similar a un motor de búsqueda, 
              sin alojar ni controlar el contenido multimedia.
            </p>
          </div>
        </div>

        <div className="bg-primary-900/50 rounded-2xl p-8">
          <h2 className="text-2xl font-bold mb-6">10. Contacto</h2>
          
          <div className="space-y-4 text-gray-300">
            <p>
              Si tienes preguntas sobre esta política de privacidad o sobre cómo manejamos 
              tu información personal, no dudes en contactarnos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Link href="/contacto" className="btn-primary">
                Contactar Soporte
              </Link>
              <Link href="/" className="btn-secondary">
                Volver al Inicio
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