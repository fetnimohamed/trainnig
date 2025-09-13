import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NavItem = ({to, children}) => {
  const loc = useLocation();
  const active = loc.pathname.startsWith(to) && to !== '/';
  return (
    <Link to={to} className={`text-sm font-semibold px-3 py-2 rounded-xl transition ${active ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-100'}`}>
      {children}
    </Link>
  );
};

export default function Navbar() {
  return (
    <div className="bg-white/80 backdrop-blur border-b sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="font-black text-2xl tracking-tight">
          <span className="text-indigo-600">Train</span>Me<span className="text-slate-900">Fit</span>
        </Link>
        <div className="flex items-center gap-1">
          <NavItem to="/catalog">Catalogue</NavItem>
          <NavItem to="/login">Connexion</NavItem>
          <NavItem to="/register">Créer un compte</NavItem>
        </div>
      </div>
    </div>
  )
}
