import express from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getDb } from '../lib/db.js';

const router = express.Router();

async function applyPromo(db, promo_code, amount_cents){
  if(!promo_code) return { amount_cents, applied: null };
  const code = promo_code.toUpperCase();
  const p = await db.get(`SELECT * FROM promotions WHERE code=?`, [code]);
  const now = new Date();
  if(!p) return { amount_cents, applied: null };
  if (p.valid_from && new Date(p.valid_from) > now) return { amount_cents, applied: null };
  if (p.valid_to && new Date(p.valid_to) < now) return { amount_cents, applied: null };
  if (p.max_redemptions && p.redemptions >= p.max_redemptions) return { amount_cents, applied: null };
  let discounted = amount_cents;
  if (p.type==='percent') discounted = Math.max(0, Math.round(amount_cents * (100 - p.value) / 100));
  if (p.type==='amount') discounted = Math.max(0, amount_cents - p.value);
  await db.run(`UPDATE promotions SET redemptions=redemptions+1 WHERE id=?`, [p.id]);
  return { amount_cents: discounted, applied: { code: p.code, type: p.type, value: p.value } };
}

// purchase single course
router.post('/purchase/:courseId', requireAuth, async (req,res,next)=>{
  try{
    const db = getDb();
    const courseId = parseInt(req.params.courseId,10);
    const course = await db.get(`SELECT * FROM courses WHERE id=?`, [courseId]);
    if(!course) return res.status(404).json({ error:'Cours introuvable' });
    let total = course.price_cents;
    const { amount_cents, applied } = await applyPromo(db, req.body?.promo_code, total);
    await db.run(`INSERT OR IGNORE INTO purchases (user_id, course_id) VALUES (?,?)`, [req.user.id, courseId]);
    res.json({ ok:true, total_cents: total, paid_cents: amount_cents, promo: applied });
  }catch(e){ next(e); }
});

// purchase pack
router.post('/purchase-pack/:packId', requireAuth, async (req,res,next)=>{
  try{
    const db = getDb();
    const packId = parseInt(req.params.packId,10);
    const pack = await db.get(`SELECT * FROM packs WHERE id=?`, [packId]);
    if(!pack) return res.status(404).json({ error:'Pack introuvable' });
    let total = pack.price_cents;
    const { amount_cents, applied } = await applyPromo(db, req.body?.promo_code, total);
    const courses = await db.all(`SELECT course_id FROM pack_courses WHERE pack_id=?`, [packId]);
    for(const row of courses){
      await db.run(`INSERT OR IGNORE INTO purchases (user_id, course_id) VALUES (?,?)`, [req.user.id, row.course_id]);
    }
    res.json({ ok:true, total_cents: total, paid_cents: amount_cents, promo: applied, courses_unlocked: courses.length });
  }catch(e){ next(e); }
});

// start subscription
router.post('/start', requireAuth, async (req,res,next)=>{
  try{
    const db = getDb();
    const plan = req.body.plan || 'mensuel';
    const periodDays = plan==='annuel' ? 365 : 30;
    const end = new Date(Date.now() + periodDays*24*60*60*1000).toISOString();
    const base = plan==='annuel' ? 9999 : 1499; // prix simulés
    const { amount_cents, applied } = await applyPromo(db, req.body?.promo_code, base);
    await db.run(`INSERT INTO subscriptions (user_id, plan, status, current_period_end) VALUES (?,?, 'active', ?)`, [req.user.id, plan, end]);
    res.json({ status:'active', plan, current_period_end:end, total_cents: base, paid_cents: amount_cents, promo: applied });
  }catch(e){ next(e); }
});

router.get('/mine', requireAuth, async (req,res,next)=>{
  try{ const db=getDb(); const sub=await db.get(`SELECT * FROM subscriptions WHERE user_id=? ORDER BY id DESC LIMIT 1`, [req.user.id]); res.json(sub||null); }catch(e){ next(e); }
});

export default router;
