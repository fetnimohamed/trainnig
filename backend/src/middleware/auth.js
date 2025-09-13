import { verifyJwt } from '../utils/jwt.js';
export function requireAuth(req,res,next){
  try{
    const token = req.cookies?.token || (req.headers.authorization?.split(' ')[1]);
    if(!token) return res.status(401).json({ error:'Non authentifié' });
    const decoded = verifyJwt(token);
    req.user = decoded; next();
  }catch(e){ return res.status(401).json({ error:'Token invalide' }); }
}
export function requireRole(role){
  return (req,res,next)=>{
    if(!req.user) return res.status(401).json({ error:'Non authentifié' });
    if(req.user.role !== role && req.user.role !== 'admin') return res.status(403).json({ error:'Accès refusé' });
    next();
  }
}
