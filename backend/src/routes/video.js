// mux video routes (simplified placeholder for demonstration)
import express from 'express';
const router = express.Router();
router.get('/ping', (req,res)=>res.json({ok:true}));
export default router;
