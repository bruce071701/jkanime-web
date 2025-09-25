import { Metadata } from 'next';
import Link from 'next/link';
import { Play, Heart, Users, Globe, Shield, Zap } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Acerca de AnimeES - Tu Portal de Anime en Español',
  description: 'Conoce más sobre AnimeES, tu plataforma favorita para disfrutar de los mejores animes con subtítulos en español.',
  keywords: 'acerca de, AnimeES, anime español, plataforma anime, streaming anime',
};

export default function AcercaPage() {
  return (
    <div className="container-custom py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="flex items-center justify-center mb-6">
          <Play className="h-16 w-16 text-primary-500 mr-4" />
          <h1 className="text-4xl md:text-6xl font-bold">AnimeES</h1>
        </div>
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
          Tu portal favorito para disfrutar de los mejores animes con subtítulos en español
        </p>
      </div>

      {/* Important Notice */}
      <section className="mb-16">
        <div className="bg-amber-900/20 border border-amber-700 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <Globe className="h-12 w-12 text-amber-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4 text-amber-300">Naturaleza del Servicio</h2>
          </div>
          <div className="max-w-4xl mx-auto space-y-4 text-gray-300">
            <p className="text-lg text-center font-semibold text-white">
              AnimeES es un agregador de contenido que facilita el acceso a enlaces públicos de anime disponibles en internet.
            </p>
            
            <div className="grid md:grid-cols-2 gap-6 mt-8">
              <div className="bg-amber-900/30 rounded-lg p-4">
                <h4 className="font-semibold text-amber-200 mb-2">✅ Lo que hacemos:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Recopilamos enlaces públicos de internet</li>
                  <li>• Organizamos el contenido por categorías</li>
                  <li>• Proporcionamos una interfaz fácil de usar</li>
                  <li>• Facilitamos la búsqueda de contenido</li>
                </ul>
              </div>
              
              <div className="bg-amber-900/30 rounded-lg p-4">
                <h4 className="font-semibold text-amber-200 mb-2">❌ Lo que NO hacemos:</h4>
                <ul className="text-sm space-y-1">
                  <li>• No alojamos archivos de video</li>
                  <li>• No subimos contenido multimedia</li>
                  <li>• No almacenamos datos de streaming</li>
                  <li>• No controlamos servidores externos</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="mb-16">
        <div className="bg-gradient-to-r from-primary-900/50 to-primary-800/50 rounded-2xl p-8 md:p-12">
          <div className="text-center mb-8">
            <Heart className="h-12 w-12 text-primary-400 mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-4">Nuestra Misión</h2>
          </div>
          <p className="text-lg text-gray-300 text-center max-w-4xl mx-auto leading-relaxed">
            En AnimeES, nos dedicamos a brindar la mejor experiencia de navegación para encontrar anime en español. 
            Creemos que todos merecen acceso fácil a contenido de calidad, por eso trabajamos incansablemente 
            para ofrecer una plataforma moderna, rápida y fácil de usar que conecte a los fanáticos del 
            anime con enlaces a sus series y películas favoritas disponibles públicamente en internet.
          </p>
        </div>
      </section>

      {/* Features Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">¿Por qué elegir AnimeES?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <Zap className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Velocidad Optimizada</h3>
            <p className="text-gray-400">
              Plataforma optimizada para carga rápida y streaming fluido sin interrupciones.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <Globe className="h-12 w-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Contenido en Español</h3>
            <p className="text-gray-400">
              Subtítulos de alta calidad en español para que disfrutes al máximo cada episodio.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <Users className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Comunidad Activa</h3>
            <p className="text-gray-400">
              Únete a miles de fanáticos del anime que ya disfrutan de nuestro contenido.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <Shield className="h-12 w-12 text-purple-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Navegación Segura</h3>
            <p className="text-gray-400">
              Plataforma segura y confiable, sin publicidad invasiva ni contenido malicioso.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <Play className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Enlaces a Múltiples Servidores</h3>
            <p className="text-gray-400">
              Agregamos enlaces de varios servidores públicos para ofrecerte opciones de visualización.
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-6 text-center">
            <Heart className="h-12 w-12 text-pink-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-3">Actualizaciones Constantes</h3>
            <p className="text-gray-400">
              Contenido nuevo agregado regularmente para mantenerte al día con los últimos lanzamientos.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-16">
        <div className="bg-gray-800 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold text-center mb-12">AnimeES en Números</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary-500 mb-2">3,500+</div>
              <p className="text-gray-400">Animes Disponibles</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-500 mb-2">1,500+</div>
              <p className="text-gray-400">Series Completas</p>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-500 mb-2">100+</div>
              <p className="text-gray-400">Películas HD</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Nuestro Compromiso</h2>
          <div className="max-w-4xl mx-auto">
            <p className="text-lg text-gray-300 mb-6 leading-relaxed">
              El equipo de AnimeES está formado por apasionados del anime que entienden lo que los fanáticos 
              realmente quieren. Trabajamos día y noche para mejorar la plataforma, agregar nuevo contenido 
              y asegurar que tengas la mejor experiencia posible.
            </p>
            <p className="text-lg text-gray-300 leading-relaxed">
              Nuestro objetivo es simple: ser tu destino número uno para el anime en español, 
              ofreciendo calidad, variedad y una experiencia de usuario excepcional.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center">
        <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12">
          <h2 className="text-3xl font-bold mb-4">¿Listo para comenzar?</h2>
          <p className="text-xl text-primary-100 mb-8">
            Explora nuestra extensa colección de animes y encuentra tu próxima serie favorita
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/series" className="btn-secondary bg-white text-primary-700 hover:bg-gray-100">
              Explorar Series
            </Link>
            <Link href="/peliculas" className="btn-secondary bg-primary-800 text-white hover:bg-primary-900">
              Ver Películas
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}