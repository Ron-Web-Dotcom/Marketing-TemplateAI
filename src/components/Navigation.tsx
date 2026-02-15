import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { config } from '../config';
import { Button } from './Button';

export const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'FAQ', href: '#faq' },
    { label: 'Dashboard', href: '/dashboard', isRoute: true },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/80 backdrop-blur-lg shadow-sm border-b border-orange-100' : 'bg-white/50 backdrop-blur-sm'
        }`}
      >
        <div className="container mx-auto px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{config.brand.logo}</span>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                {config.brand.name}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-gray-700 hover:text-orange-600 font-medium transition-colors px-4 py-2 rounded-lg hover:bg-orange-50/50"
                  onClick={(e) => {
                    e.preventDefault();
                    if ((link as any).isRoute) {
                      (window as any).navigate?.(link.href);
                    } else {
                      const element = document.querySelector(link.href);
                      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                >
                  {link.label}
                </a>
              ))}
              <Button size="sm" href="#pricing" className="ml-2">{config.hero.primaryCTA}</Button>
            </div>

            <button
              className="md:hidden text-gray-900 p-2 hover:bg-orange-50 rounded-lg transition-colors"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-md"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-72 bg-white shadow-2xl p-8 pt-24">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-base font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 px-4 py-3 rounded-lg transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    if ((link as any).isRoute) {
                      (window as any).navigate?.(link.href);
                    } else {
                      const element = document.querySelector(link.href);
                      element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                  }}
                >
                  {link.label}
                </a>
              ))}
              <Button
                className="w-full mt-4"
                href="#pricing"
                onClick={() => setIsOpen(false)}
              >
                {config.hero.primaryCTA}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
