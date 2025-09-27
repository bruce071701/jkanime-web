import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, Menu, X, Clock } from 'lucide-react';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/buscar?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navItems = [
    { name: 'Inicio', path: '/' },
    { name: 'Películas', path: '/peliculas' },
    { name: 'Series', path: '/series' },
    { name: 'Géneros', path: '/generos' },
    { name: 'Historial', path: '/historial', icon: Clock },
  ];

  return (
    <header className="bg-gray-800 shadow-lg sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/jkanime-icon.svg" alt="JKAnime" className="h-8 w-8" />
            <span className="text-xl font-bold text-white">JKAnime</span>
            <span className="text-sm text-yellow-400 font-semibold">FLV</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-1"
              >
                {item.icon && <item.icon className="h-4 w-4" />}
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar anime..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-12 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:w-80 transition-all duration-200"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-1.5 bg-blue-600 hover:bg-blue-700 text-white p-1 rounded transition-colors"
                title="Buscar"
              >
                <Search className="h-3 w-3" />
              </button>
            </div>
          </form>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-white"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="text-gray-300 hover:text-white transition-colors duration-200 flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.icon && <item.icon className="h-4 w-4" />}
                  {item.name}
                </Link>
              ))}
            </nav>
            
            {/* Mobile Search */}
            <form onSubmit={(e) => { handleSearch(e); setIsMenuOpen(false); }} className="mt-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar anime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              </div>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}