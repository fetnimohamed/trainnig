import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getDb } from '../lib/db.js';
const router = express.Router();

router.get('/', async (req,res,next)=>{
  try{
    const db = getDb();
    const category = req.query.category;
    let rows;
    if(category){
      rows = await db.all(`SELECT c.*, cat.name as category_name,
        (SELECT image_url FROM course_images ci WHERE ci.course_id=c.id ORDER BY position ASC, id ASC LIMIT 1) as cover_image
        FROM courses c JOIN categories cat ON cat.id=c.category_id WHERE cat.slug=? AND c.is_published=1 ORDER BY c.id DESC`, [category]);
    }else{
      rows = await db.all(`SELECT c.*, cat.name as category_name,
        (SELECT image_url FROM course_images ci WHERE ci.course_id=c.id ORDER BY position ASC, id ASC LIMIT 1) as cover_image
        FROM courses c JOIN categories cat ON cat.id=c.category_id WHERE c.is_published=1 ORDER BY c.id DESC`);
    }
    res.json(rows);
  }catch(e){ next(e); }
});

router.get('/categories', async (req,res,next)=>{
  try{ const db=getDb(); const cats=await db.all(`SELECT * FROM categories ORDER BY name`); res.json(cats);}catch(e){ next(e); }
});

router.get('/:id', async (req,res,next)=>{
  try{
    const db = getDb();
    const course = await db.get(`SELECT c.*, cat.name as category_name FROM courses c JOIN categories cat ON cat.id=c.category_id WHERE c.id=?`, [req.params.id]);
    if(!course) return res.status(404).json({ error:'Cours introuvable' });
    const lessons = await db.all(`SELECT id, title, position FROM lessons WHERE course_id=? ORDER BY position ASC`, [course.id]);
    const images = await db.all(`SELECT id, image_url, position FROM course_images WHERE course_id=? ORDER BY position ASC, id ASC`, [course.id]);
    res.json({ ...course, lessons, images });
  }catch(e){ next(e); }
});

router.get('/:id/lesson/:lessonId', requireAuth, async (req,res,next)=>{
  try{
    const db = getDb();
    const userId = req.user?.id;
    const courseId = parseInt(req.params.id,10);
    // access control: purchased or active sub
    const purchase = await db.get(`SELECT * FROM purchases WHERE user_id=? AND course_id=?`, [userId, courseId]);
    const sub = await db.get(`SELECT * FROM subscriptions WHERE user_id=? AND status='active' AND datetime(current_period_end)>datetime('now')`, [userId]);
    if(!purchase && !sub) return res.status(402).json({ error:'Accès restreint. Achetez le cours ou activez un abonnement.' });
    const lesson = await db.get(`SELECT * FROM lessons WHERE id=? AND course_id=?`, [req.params.lessonId, courseId]);
    if(!lesson) return res.status(404).json({ error:'Leçon introuvable' });
    res.json(lesson);
  }catch(e){ next(e); }
});

export default router;
