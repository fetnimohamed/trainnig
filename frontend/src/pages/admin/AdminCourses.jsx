import React,{useEffect,useState} from 'react'; import api from '../../api';
export default function AdminCourses(){ const [rows,setRows]=useState([]); const [cats,setCats]=useState([]);
  const [form,setForm]=useState({title:'', description:'', price_cents:0, category_id:'', level:'debutant', is_published:true, coach_name:''});
  const load=()=>api.get('/api/admin/courses').then(r=>setRows(r.data)); const loadCats=()=>api.get('/api/admin/categories').then(r=>setCats(r.data));
  useEffect(()=>{ load(); loadCats(); },[]);
  const add=async()=>{ if(!form.title||!form.category_id) return; await api.post('/api/admin/courses', {...form, price_cents:Number(form.price_cents)||0, is_published: form.is_published?1:0}); setForm({title:'', description:'', price_cents:0, category_id:'', level:'debutant', is_published:true, coach_name:''}); load(); };
  const save=async(c)=>{ await api.patch(`/api/admin/courses/${c.id}`, { title:c.title, description:c.description, price_cents:Number(c.price_cents)||0, category_id:c.category_id, level:c.level, is_published:c.is_published?1:0, coach_name:c.coach_name }); load(); };
  const del=async(id)=>{ if(confirm('Supprimer ?')){ await api.delete(`/api/admin/courses/${id}`); load(); } };
  return (<div className="bg-white rounded-2xl p-6 shadow"><h2 className="text-2xl font-bold mb-4">Formations</h2>
    <div className="grid md:grid-cols-2 gap-3 mb-6">
      <input placeholder="Titre" className="border rounded px-3 py-2" value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/>
      <input placeholder="Coach" className="border rounded px-3 py-2" value={form.coach_name} onChange={e=>setForm({...form,coach_name:e.target.value})}/>
      <textarea placeholder="Description" className="border rounded px-3 py-2 md:col-span-2" value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/>
      <input placeholder="Prix (cents)" className="border rounded px-3 py-2" value={form.price_cents} onChange={e=>setForm({...form,price_cents:e.target.value})}/>
      <select className="border rounded px-3 py-2" value={form.category_id} onChange={e=>setForm({...form,category_id:e.target.value})}><option value="">Catégorie...</option>{cats.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}</select>
      <select className="border rounded px-3 py-2" value={form.level} onChange={e=>setForm({...form,level:e.target.value})}><option value="debutant">Débutant</option><option value="intermediaire">Intermédiaire</option><option value="avance">Avancé</option></select>
      <label className="flex items-center gap-2"><input type="checkbox" checked={form.is_published} onChange={e=>setForm({...form,is_published:e.target.checked})}/> Publié</label>
      <button onClick={add} className="px-4 py-2 rounded bg-indigo-600 text-white">Ajouter</button>
    </div>
    <table className="w-full text-sm"><thead><tr className="text-left border-b"><th>Titre</th><th>Catégorie</th><th>Prix</th><th>Publié</th><th></th></tr></thead><tbody>
      {rows.map(c=>(<tr key={c.id} className="border-b last:border-0 align-top">
        <td><input defaultValue={c.title} onChange={e=>c.title=e.target.value} className="border rounded px-2"/></td>
        <td><select defaultValue={c.category_id} onChange={e=>c.category_id=Number(e.target.value)} className="border rounded px-2 py-1">{cats.map(cat=><option key={cat.id} value={cat.id}>{cat.name}</option>)}</select></td>
        <td><input defaultValue={c.price_cents} onChange={e=>c.price_cents=Number(e.target.value)} className="border rounded px-2 w-24"/></td>
        <td><input type="checkbox" defaultChecked={!!c.is_published} onChange={e=>c.is_published=e.target.checked?1:0}/></td>
        <td className="text-right"><button onClick={()=>save(c)} className="px-3 py-1 rounded border">Enregistrer</button><button onClick={()=>del(c.id)} className="ml-2 px-3 py-1 rounded border text-red-600">Supprimer</button></td>
      </tr>))}
    </tbody></table></div>) }