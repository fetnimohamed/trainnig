import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { initDb, getDb } from './lib/db.js';

await initDb(); const db = getDb();
const adminPass = await bcrypt.hash('admin123', 10);
await db.run(`INSERT OR IGNORE INTO users (email, password_hash, name, role) VALUES ('admin@coach.fit', ?, 'Coach Admin', 'admin')`, [adminPass]);

const cats = [['Renforcement','renforcement'],['Cardio','cardio'],['Mobilité','mobilite'],['Nutrition','nutrition']];
for(const [name,slug] of cats){ await db.run(`INSERT OR IGNORE INTO categories (name,slug) VALUES (?,?)`, [name, slug]); }
const cat = await db.get(`SELECT id FROM categories WHERE slug='renforcement'`);
const { lastID: cid } = await db.run(`INSERT INTO courses (title,description,price_cents,category_id,level,is_published,coach_name) VALUES (?,?,?,?,?,1,?)`,
  ['Programme Full-Body Débutant','Un programme complet pour commencer en toute sécurité.', 2999, cat.id, 'debutant', 'Coach Sami']);
const lessons = [['Intro','', 'Bienvenue', 1],['Échauffement','https://videos.example/echauffement','Routine 10 min',2],['Séance A','https://videos.example/a','Mouvements de base',3]];
for(const [title, url, content, pos] of lessons){ await db.run(`INSERT INTO lessons (course_id,title,video_url,content,position) VALUES (?,?,?,?,?)`, [cid,title,url,content,pos]); }
await db.run(`INSERT INTO course_images (course_id,image_url,position) VALUES (?,?,0)`, [cid,'https://images.unsplash.com/photo-1558611848-73f7eb4001a1?q=80&w=1200&auto=format&fit=crop',0]);
await db.run(`INSERT INTO course_images (course_id,image_url,position) VALUES (?,?,1)`, [cid,'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1200&auto=format&fit=crop',1]);

console.log('Seed done.');
