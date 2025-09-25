import { Metadata } from 'next';
import Link from 'next/link';
import { Mail, MessageCircle, Bug, Lightbulb, Heart, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contacto - AnimeES',
  description: 'Ponte en contacto con el equipo de AnimeES. Reporta problemas, sugiere mejoras o simplemente saluda.',
  keywords: 'contacto, AnimeES, soporte, ayuda, reportar problema, sugerencias',
};

export default function ContactoPage() {
  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Contacto</h1>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          ¿Tienes alguna pregunta, sugerencia o problema? Nos encantaría escucharte
        </p>
      </div>

      {/* Contact Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        <div className="bg-gray-800 rounded-xl p-6 text-center hover:bg-gray-750 transition-colors">
          <Bug className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Reportar Error</h3>
          <p className="text-gray-400 text-sm">
            ¿Encontraste un problema técnico? Ayúdanos a solucionarlo
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 text-center hover:bg-gray-750 transition-colors">
          <Lightbulb className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Sugerir Mejora</h3>
          <p className="text-gray-400 text-sm">
            Comparte tus ideas para hacer AnimeES aún mejor
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 text-center hover:bg-gray-750 transition-colors">
          <MessageCircle className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Pregunta General</h3>
          <p className="text-gray-400 text-sm">
            ¿Tienes dudas sobre cómo usar la plataforma?
          </p>
        </div>

        <div className="bg-gray-800 rounded-xl p-6 text-center hover:bg-gray-750 transition-colors">
          <Heart className="h-12 w-12 text-pink-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Feedback</h3>
          <p className="text-gray-400 text-sm">
            Cuéntanos qué te gusta y qué podríamos mejorar
          </p>
        </div>
      </div>

      {/* Contact Form */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-2xl p-8">
          <div className="text-center mb-8">
            <Mail className="h-12 w-12 text-primary-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Envíanos un Mensaje</h2>
            <p className="text-gray-400">
              Completa el formulario y nos pondremos en contacto contigo pronto
            </p>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-medium mb-2">
                Asunto
              </label>
              <select
                id="subject"
                name="subject"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">Selecciona un tema</option>
                <option value="bug">Reportar Error</option>
                <option value="suggestion">Sugerencia</option>
                <option value="question">Pregunta General</option>
                <option value="feedback">Feedback</option>
                <option value="other">Otro</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2">
                Mensaje
              </label>
              <textarea
                id="message"
                name="message"
                rows={6}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="Describe tu consulta, problema o sugerencia..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              Enviar Mensaje
            </button>
          </form>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-12">Preguntas Frecuentes</h2>
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">¿Por qué no funciona un reproductor?</h3>
            <p className="text-gray-400">
              Si un reproductor no funciona, prueba con otro servidor disponible. 
              Algunos servidores pueden estar temporalmente fuera de servicio.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">¿Cómo puedo solicitar un anime?</h3>
            <p className="text-gray-400">
              Puedes enviarnos una sugerencia usando el formulario de contacto. 
              Revisamos todas las solicitudes y agregamos contenido regularmente.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">¿La plataforma es gratuita?</h3>
            <p className="text-gray-400">
              Sí, AnimeES es completamente gratuito. No cobramos por acceder al contenido 
              ni por usar las funciones de la plataforma.
            </p>
          </div>

          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-3">¿Con qué frecuencia se actualiza el contenido?</h3>
            <p className="text-gray-400">
              Agregamos nuevo contenido regularmente. Los episodios nuevos suelen estar 
              disponibles poco después de su emisión original.
            </p>
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