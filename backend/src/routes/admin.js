import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { getDb } from '../lib/db.js';

const router = express.Router();
router.use(requireAuth, requireRole('admin'));

// Users
router.get('/users', async (req,res,next)=>{ try{ const db=getDb(); const rows=await db.all(`SELECT id,email,name,role,created_at FROM users ORDER BY id DESC`); res.json(rows);}catch(e){ next(e); } });
router.patch('/users/:id', async (req,res,next)=>{ try{ const db=getDb(); const { name, role }=req.body; await db.run(`UPDATE users SET name=COALESCE(?,name), role=COALESCE(?,role) WHERE id=?`, [name, role, req.params.id]); res.json({ok:true}); }catch(e){ next(e); } });
router.delete('/users/:id', async (req,res,next)=>{ try{ const db=getDb(); await db.run(`DELETE FROM users WHERE id=?`, [req.params.id]); res.json({ok:true}); }catch(e){ next(e); } });

// Categories
router.get('/categories', async (req,res,next)=>{ try{ const db=getDb(); const rows=await db.all(`SELECT * FROM categories ORDER BY name`); res.json(rows);}catch(e){ next(e); } });
router.post('/categories', async (req,res,next)=>{ try{ const db=getDb(); const {name,slug}=req.body; const r=await db.run(`INSERT INTO categories (name,slug) VALUES (?,?)`, [name, slug]); res.json({id:r.lastID}); }catch(e){ next(e); } });
router.patch('/categories/:id', async (req,res,next)=>{ try{ const db=getDb(); const {name,slug}=req.body; await db.run(`UPDATE categories SET name=COALESCE(?,name), slug=COALESCE(?,slug) WHERE id=?`, [name, slug, req.params.id]); res.json({ok:true}); }catch(e){ next(e); } });
router.delete('/categories/:id', async (req,res,next)=>{ try{ const db=getDb(); await db.run(`DELETE FROM categories WHERE id=?`, [req.params.id]); res.json({ok:true}); }catch(e){ next(e); } });

// Courses
router.get('/courses', async (req,res,next)=>{ try{ const db=getDb(); const rows=await db.all(`SELECT c.*, cat.name as category_name FROM courses c JOIN categories cat ON cat.id=c.category_id ORDER BY c.id DESC`); res.json(rows);}catch(e){ next(e); } });
router.post('/courses', async (req,res,next)=>{ try{ const db=getDb(); const { title, description, price_cents, category_id, level, is_published, coach_name }=req.body; const r=await db.run(`INSERT INTO courses (title,description,price_cents,category_id,level,is_published,coach_name) VALUES (?,?,?,?,?,?,?)`, [title, description, price_cents||0, category_id, level||'debutant', is_published?1:0, coach_name||null]); res.json({id:r.lastID}); }catch(e){ next(e); } });
router.patch('/courses/:id', async (req,res,next)=>{ try{ const db=getDb(); const { title, description, price_cents, category_id, level, is_published, coach_name }=req.body; await db.run(`UPDATE courses SET title=COALESCE(?,title), description=COALESCE(?,description), price_cents=COALESCE(?,price_cents), category_id=COALESCE(?,category_id), level=COALESCE(?,level), is_published=COALESCE(?,is_published), coach_name=COALESCE(?,coach_name) WHERE id=?`, [title, description, price_cents, category_id, level, typeof is_published==='number'?is_published:(is_published?1:0), coach_name, req.params.id]); res.json({ok:true}); }catch(e){ next(e); } });
router.delete('/courses/:id', async (req,res,next)=>{ try{ const db=getDb(); await db.run(`DELETE FROM courses WHERE id=?`, [req.params.id]); res.json({ok:true}); }catch(e){ next(e); } });

// Lessons
router.get('/courses/:id/lessons', async (req,res,next)=>{ try{ const db=getDb(); const rows=await db.all(`SELECT * FROM lessons WHERE course_id=? ORDER BY position`, [req.params.id]); res.json(rows);}catch(e){ next(e); } });
router.post('/courses/:id/lessons', async (req,res,next)=>{ try{ const db=getDb(); const { title, video_url, content, position }=req.body; const r=await db.run(`INSERT INTO lessons (course_id,title,video_url,content,position) VALUES (?,?,?,?,?)`, [req.params.id, title, video_url, content||'', position||0]); res.json({id:r.lastID}); }catch(e){ next(e); } });
router.patch('/lessons/:lessonId', async (req,res,next)=>{ try{ const db=getDb(); const { title, video_url, content, position }=req.body; await db.run(`UPDATE lessons SET title=COALESCE(?,title), video_url=COALESCE(?,video_url), content=COALESCE(?,content), position=COALESCE(?,position) WHERE id=?`, [title, video_url, content, position, req.params.lessonId]); res.json({ok:true}); }catch(e){ next(e); } });
router.delete('/lessons/:lessonId', async (req,res,next)=>{ try{ const db=getDb(); await db.run(`DELETE FROM lessons WHERE id=?`, [req.params.lessonId]); res.json({ok:true}); }catch(e){ next(e); } });

// Course images
router.get('/courses/:id/images', async (req,res,next)=>{ try{ const db=getDb(); const rows=await db.all(`SELECT * FROM course_images WHERE course_id=? ORDER BY position, id`, [req.params.id]); res.json(rows);}catch(e){ next(e); } });
router.post('/courses/:id/images', async (req,res,next)=>{ try{ const db=getDb(); const { image_url, position }=req.body; const r=await db.run(`INSERT INTO course_images (course_id,image_url,position) VALUES (?,?,?)`, [req.params.id, image_url, position||0]); res.json({id:r.lastID}); }catch(e){ next(e); } });
router.delete('/images/:imageId', async (req,res,next)=>{ try{ const db=getDb(); await db.run(`DELETE FROM course_images WHERE id=?`, [req.params.imageId]); res.json({ok:true}); }catch(e){ next(e); } });

// Packs
router.get('/packs', async (req,res,next)=>{ try{ const db=getDb(); const rows=await db.all(`SELECT * FROM packs ORDER BY id DESC`); res.json(rows);}catch(e){ next(e); } });
router.post('/packs', async (req,res,next)=>{ try{ const db=getDb(); const { name, description, price_cents, is_published, course_ids=[] }=req.body; const r=await db.run(`INSERT INTO packs (name,description,price_cents,is_published) VALUES (?,?,?,?)`, [name, description||'', price_cents||0, is_published?1:0]); for(const cid of course_ids){ await db.run(`INSERT INTO pack_courses (pack_id,course_id) VALUES (?,?)`, [r.lastID, cid]); } res.json({id:r.lastID}); }catch(e){ next(e); } });
router.patch('/packs/:id', async (req,res,next)=>{ try{ const db=getDb(); const { name, description, price_cents, is_published, course_ids }=req.body; await db.run(`UPDATE packs SET name=COALESCE(?,name), description=COALESCE(?,description), price_cents=COALESCE(?,price_cents), is_published=COALESCE(?,is_published) WHERE id=?`, [name, description, price_cents, typeof is_published==='number'?is_published:(is_published?1:0), req.params.id]); if(Array.isArray(course_ids)){ await db.run(`DELETE FROM pack_courses WHERE pack_id=?`, [req.params.id]); for(const cid of course_ids){ await db.run(`INSERT INTO pack_courses (pack_id,course_id) VALUES (?,?)`, [req.params.id, cid]); } } res.json({ok:true}); }catch(e){ next(e); } });
router.delete('/packs/:id', async (req,res,next)=>{ try{ const db=getDb(); await db.run(`DELETE FROM packs WHERE id=?`, [req.params.id]); res.json({ok:true}); }catch(e){ next(e); } });

// Promotions
router.get('/promos', async (req,res,next)=>{ try{ const db=getDb(); const rows=await db.all(`SELECT * FROM promotions ORDER BY id DESC`); res.json(rows);}catch(e){ next(e); } });
router.post('/promos', async (req,res,next)=>{ try{ const db=getDb(); const { code, type, value, valid_from, valid_to, max_redemptions }=req.body; const r=await db.run(`INSERT INTO promotions (code,type,value,valid_from,valid_to,max_redemptions) VALUES (?,?,?,?,?,?)`, [code.toUpperCase(), type, value, valid_from||null, valid_to||null, max_redemptions||null]); res.json({id:r.lastID}); }catch(e){ next(e); } });
router.patch('/promos/:id', async (req,res,next)=>{ try{ const db=getDb(); const { code, type, value, valid_from, valid_to, max_redemptions, redemptions }=req.body; await db.run(`UPDATE promotions SET code=COALESCE(?,code), type=COALESCE(?,type), value=COALESCE(?,value), valid_from=COALESCE(?,valid_from), valid_to=COALESCE(?,valid_to), max_redemptions=COALESCE(?,max_redemptions), redemptions=COALESCE(?,redemptions) WHERE id=?`, [code && code.toUpperCase(), type, value, valid_from, valid_to, max_redemptions, redemptions, req.params.id]); res.json({ok:true}); }catch(e){ next(e); } });
router.delete('/promos/:id', async (req,res,next)=>{ try{ const db=getDb(); await db.run(`DELETE FROM promotions WHERE id=?`, [req.params.id]); res.json({ok:true}); }catch(e){ next(e); } });

export default router;
