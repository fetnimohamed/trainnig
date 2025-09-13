import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET || 'change_me';
export function signJwt(payload){ return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' }); }
export function verifyJwt(token){ return jwt.verify(token, JWT_SECRET); }
