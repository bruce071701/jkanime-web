'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Search, Menu, X, Play, Clock } from 'lucide-react';
import { SearchModal } from '@/components/ui/SearchModal';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <>
      <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-40">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <Play className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold">JKAnime<span className="text-primary-400">FLV</span></span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="hover:text-primary-400 transition-colors">
                Inicio
              </Link>
              <Link href="/peliculas" className="hover:text-primary-400 transition-colors">
                Películas
              </Link>
              <Link href="/series" className="hover:text-primary-400 transition-colors">
                Series
              </Link>
              <Link href="/generos" className="hover:text-primary-400 transition-colors">
                Géneros
              </Link>
              <Link href="/historial" className="hover:text-primary-400 transition-colors flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                Historial
              </Link>
            </nav>

            {/* Search and Mobile Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Buscar"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
                aria-label="Menú"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-800">
              <nav className="flex flex-col space-y-4">
                <Link 
                  href="/" 
                  className="hover:text-primary-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Inicio
                </Link>
                <Link 
                  href="/peliculas" 
                  className="hover:text-primary-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Películas
                </Link>
                <Link 
                  href="/series" 
                  className="hover:text-primary-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Series
                </Link>
                <Link 
                  href="/generos" 
                  className="hover:text-primary-400 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Géneros
                </Link>
                <Link 
                  href="/historial" 
                  className="hover:text-primary-400 transition-colors flex items-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Historial
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>

      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}