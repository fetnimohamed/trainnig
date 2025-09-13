import express from 'express';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { getDb } from '../lib/db.js';
const router = express.Router();

router.get('/me', requireAuth, async (req,res,next)=>{
  try{ const db = getDb(); const me = await db.get(`SELECT id,email,name,role,created_at FROM users WHERE id=?`, [req.user.id]); res.json(me); }catch(e){ next(e); }
});

router.get('/', requireAuth, requireRole('admin'), async (req,res,next)=>{
  try{ const db=getDb(); const users=await db.all(`SELECT id,email,name,role,created_at FROM users ORDER BY id DESC`); res.json(users);}catch(e){ next(e); }
});

export default router;
