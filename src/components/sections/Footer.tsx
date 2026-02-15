import React from 'react';
import { Twitter, Linkedin, Github } from 'lucide-react';
import { config } from '../../config';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl">{config.brand.logo}</span>
              <span className="text-2xl font-bold">{config.brand.name}</span>
            </div>
            <p className="text-slate-400 mb-6 leading-relaxed">
              {config.footer.description}
            </p>
            <div className="flex gap-4">
              <a
                href={config.footer.social.twitter}
                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Twitter size={20} />
              </a>
              <a
                href={config.footer.social.linkedin}
                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Linkedin size={20} />
              </a>
              <a
                href={config.footer.social.github}
                className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center hover:bg-orange-500 transition-colors"
              >
                <Github size={20} />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4">Product</h3>
            <ul className="space-y-3">
              {config.footer.links.product.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Company</h3>
            <ul className="space-y-3">
              {config.footer.links.company.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4">Resources</h3>
            <ul className="space-y-3">
              {config.footer.links.resources.map((link, index) => (
                <li key={index}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-400 text-sm">
            © 2024 {config.brand.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            {config.footer.links.legal.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="text-slate-400 hover:text-white text-sm transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
