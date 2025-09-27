import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';

export function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl font-bold text-gray-600 mb-4">404</div>
        <h1 className="text-2xl font-bold text-white mb-4">Página no encontrada</h1>
        <p className="text-gray-400 mb-8 max-w-md">
          La página que buscas no existe o ha sido movida. 
          Puedes volver al inicio o buscar el contenido que necesitas.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/" className="btn-primary flex items-center justify-center">
            <Home className="h-5 w-5 mr-2" />
            Volver al inicio
          </Link>
          <Link to="/buscar" className="btn-secondary flex items-center justify-center">
            <Search className="h-5 w-5 mr-2" />
            Buscar anime
          </Link>
        </div>
      </div>
    </div>
  );
}