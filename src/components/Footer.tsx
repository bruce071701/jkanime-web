import { Link } from 'react-router-dom';
import { Play, Heart } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-800 border-t border-gray-700">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo y descripción */}
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Play className="h-8 w-8 text-blue-500" />
              <span className="text-xl font-bold text-white">JKAnime</span>
            </Link>
            <p className="text-gray-400 mb-4">
              La mejor plataforma para ver anime online gratis en HD. 
              Disfruta de series y películas anime con subtítulos en español.
            </p>
            <div className="flex items-center text-gray-400">
              <span>Hecho con</span>
              <Heart className="h-4 w-4 mx-1 text-red-500" />
              <span>para los fans del anime</span>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div>
            <h3 className="text-white font-semibold mb-4">Enlaces</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/peliculas" className="text-gray-400 hover:text-white transition-colors">
                  Películas
                </Link>
              </li>
              <li>
                <Link to="/series" className="text-gray-400 hover:text-white transition-colors">
                  Series
                </Link>
              </li>
              <li>
                <Link to="/generos" className="text-gray-400 hover:text-white transition-colors">
                  Géneros
                </Link>
              </li>
            </ul>
          </div>

          {/* Información */}
          <div>
            <h3 className="text-white font-semibold mb-4">Información</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Acerca de
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Contacto
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Términos de uso
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  Privacidad
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2024 JKAnime. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}