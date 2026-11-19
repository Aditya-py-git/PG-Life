import React from 'react';
import { Home, ShieldCheck, Heart, Mail, Phone, MapPin } from 'lucide-react';
import { CITIES } from '../../utils/constants';

export const Footer = ({ onSelectCity }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-12 mt-auto border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white">
                <Home className="w-5 h-5 stroke-[2.5]" />
              </div>
              <span className="text-2xl font-black text-white">
                PG<span className="text-brand-500">-Life</span>
              </span>
            </div>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              India's premier student accommodation and verified co-living platform. Discover, schedule visits, and book fully-furnished PGs with zero brokerage and transparent terms.
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-3 py-1.5 rounded-lg w-fit">
              <ShieldCheck className="w-4 h-4" />
              100% Owner Verified Properties
            </div>
          </div>

          {/* Top Cities */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Top Student Cities</h4>
            <ul className="space-y-2 text-sm">
              {CITIES.map((c) => (
                <li key={c.name}>
                  <button
                    onClick={() => onSelectCity?.(c.name)}
                    className="hover:text-white transition-colors"
                  >
                    PG in {c.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Platform</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#about" className="hover:text-white transition-colors">Why PG-Life</a></li>
              <li><a href="#features" className="hover:text-white transition-colors">Zero Brokerage Guarantee</a></li>
              <li><a href="#owner" className="hover:text-white transition-colors">For PG Owners</a></li>
              <li><a href="#reviews" className="hover:text-white transition-colors">Student Testimonials</a></li>
              <li><a href="#safety" className="hover:text-white transition-colors">Safety Standards</a></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-white mb-4">Support & Help</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-brand-400" />
                <span>support@pglife.com</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-brand-400" />
                <span>1800-247-PGLIFE (Toll Free)</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-brand-400" />
                <span>Koramangala, Bangalore</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} PG-Life Technologies Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Host Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
