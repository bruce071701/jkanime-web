import { useState } from 'react';
import { Play, ExternalLink, AlertCircle } from 'lucide-react';

interface VideoPlayerProps {
  url: string;
  title: string;
  server: string;
}

export function VideoPlayer({ url, title, server }: VideoPlayerProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
    setError(false);
  };

  const handleError = () => {
    setLoading(false);
    setError(true);
  };

  const openInNewTab = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (error) {
    return (
      <div className="aspect-video flex items-center justify-center bg-gray-800 rounded-lg">
        <div className="text-center p-8">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            Error al cargar el reproductor
          </h3>
          <p className="text-gray-400 mb-4">
            No se pudo cargar el contenido desde {server}
          </p>
          <button
            onClick={openInNewTab}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded flex items-center mx-auto"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Abrir en nueva pestaña
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="aspect-video relative bg-gray-800 rounded-lg overflow-hidden">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-400">Cargando reproductor...</p>
          </div>
        </div>
      )}
      
      <iframe
        src={url}
        className="w-full h-full border-0"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        title={title}
        onLoad={handleLoad}
        onError={handleError}
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
      
      {/* Fallback button */}
      <div className="absolute top-4 right-4">
        <button
          onClick={openInNewTab}
          className="bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
          title="Abrir en nueva pestaña"
        >
          <ExternalLink className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}