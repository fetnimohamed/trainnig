import express from 'express';
import bcrypt from 'bcryptjs';
import { body, validationResult } from 'express-validator';
import { getDb } from '../lib/db.js';
import { signJwt } from '../utils/jwt.js';

const router = express.Router();

router.post('/register', body('email').isEmail(), body('password').isLength({min:6}), body('name').isLength({min:2}), async (req,res,next)=>{
  try{
    const errors = validationResult(req); if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { email, password, name } = req.body;
    const db = getDb();
    const existing = await db.get(`SELECT id FROM users WHERE email=?`, [email]);
    if(existing) return res.status(409).json({ error:'Email déjà utilisé' });
    const hash = await bcrypt.hash(password,10);
    const { lastID } = await db.run(`INSERT INTO users (email, password_hash, name, role) VALUES (?,?,?, 'user')`, [email, hash, name]);
    const token = signJwt({ id:lastID, email, role:'user', name });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    res.json({ id:lastID, email, name, role:'user' });
  }catch(e){ next(e); }
});

router.post('/login', body('email').isEmail(), body('password').isLength({min:6}), async (req,res,next)=>{
  try{
    const { email, password } = req.body;
    const db = getDb();
    const user = await db.get(`SELECT * FROM users WHERE email=?`, [email]);
    if(!user) return res.status(401).json({ error:'Identifiants invalides' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if(!ok) return res.status(401).json({ error:'Identifiants invalides' });
    const token = signJwt({ id:user.id, email:user.email, role:user.role, name:user.name });
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    res.json({ id:user.id, email:user.email, name:user.name, role:user.role });
  }catch(e){ next(e); }
});

router.post('/logout', (req,res)=>{ res.clearCookie('token'); res.json({ ok:true }); });
export default router;
