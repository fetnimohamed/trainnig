import React from 'react'; import { Link } from 'react-router-dom';
export default function Home(){
  return (
    <div>
      <section className="rounded-3xl bg-gradient-to-r from-indigo-600 to-fuchsia-600 text-white p-8 md:p-12 shadow-xl">
        <h1 className="text-5xl font-black leading-tight">Des programmes fitness qui donnent envie 💪</h1>
        <p className="mt-3 text-indigo-100 max-w-2xl">Vidéos HD, plans, nutrition, du débutant à avancé. Accédez partout.</p>
        <div className="mt-6 flex gap-3">
          <Link to="/catalog" className="bg-white text-indigo-700 px-5 py-2.5 rounded-xl font-semibold shadow hover:shadow-md">Voir le catalogue</Link>
          <Link to="/register" className="bg-black/20 px-5 py-2.5 rounded-xl font-semibold hover:bg-black/30">Commencer</Link>
        </div>
      </section>
      <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Renforcement & Musculation','Cardio & HIIT','Mobilité & Nutrition'].map((t,i)=>(
          <div key={i} className="bg-white rounded-3xl p-6 shadow hover:shadow-md transition">
            <div className="h-28 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 mb-4" />
            <div className="font-bold">{t}</div>
            <div className="text-sm text-gray-600 mt-1">Programmes guidés, vidéos, suivi.</div>
          </div>
        ))}
      </section>
    </div>
  )
}