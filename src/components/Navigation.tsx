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
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-transparent'
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-2">
              <span className="text-3xl">{config.brand.logo}</span>
              <span className="text-2xl font-bold text-slate-900">
                {config.brand.name}
              </span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-slate-700 hover:text-sky-500 font-medium transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    const element = document.querySelector(link.href);
                    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                >
                  {link.label}
                </a>
              ))}
              <Button size="sm" href="#pricing">{config.hero.primaryCTA}</Button>
            </div>

            <button
              className="md:hidden text-slate-900 p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-64 bg-white shadow-2xl p-6 pt-24">
            <div className="flex flex-col gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-lg font-medium text-slate-700 hover:text-sky-500 transition-colors"
                  onClick={(e) => {
                    e.preventDefault();
                    setIsOpen(false);
                    const element = document.querySelector(link.href);
                    element?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                >
                  {link.label}
                </a>
              ))}
              <Button
                className="w-full"
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
