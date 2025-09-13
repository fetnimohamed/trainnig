import React,{useEffect,useState} from 'react'; import api from '../api'; import { Link } from 'react-router-dom';
export default function Catalog(){
  const [cats,setCats]=useState([]); const [selected,setSelected]=useState(''); const [courses,setCourses]=useState([]);
  useEffect(()=>{ api.get('/api/courses/categories').then(r=>setCats(r.data)); },[]);
  useEffect(()=>{ const url = selected? `/api/courses?category=${selected}`:'/api/courses'; api.get(url).then(r=>setCourses(r.data)); },[selected]);
  return (
    <div>
      <div className="flex items-center justify-between mb-4"><h2 className="text-3xl font-black">Catalogue</h2><div className="text-sm text-gray-500">{courses.length} formations</div></div>
      <div className="flex gap-2 mb-6 flex-wrap">
        <button onClick={()=>setSelected('')} className={`px-3 py-1.5 rounded-xl border ${selected===''?'bg-indigo-600 text-white border-indigo-600':'bg-white hover:bg-slate-50'}`}>Tout</button>
        {cats.map(c=>(<button key={c.id} onClick={()=>setSelected(c.slug)} className={`px-3 py-1.5 rounded-xl border ${selected===c.slug?'bg-indigo-600 text-white border-indigo-600':'bg-white hover:bg-slate-50'}`}>{c.name}</button>))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map(c=>(
          <Link key={c.id} to={`/course/${c.id}`} className="group bg-white rounded-3xl shadow p-4 hover:shadow-xl transition">
            <div className="h-44 rounded-2xl mb-3 overflow-hidden border bg-slate-50">{c.cover_image ? <img src={c.cover_image} alt="cover" className="w-full h-full object-cover"/> : null}</div>
            <div className="text-xs uppercase tracking-wide text-indigo-600">{c.category_name}</div>
            <div className="font-bold text-lg mt-0.5">{c.title}</div>
            <div className="text-sm text-gray-600 mt-1">{(c.price_cents/100).toFixed(2)} €</div>
          </Link>
        ))}
      </div>
    </div>
  )
}