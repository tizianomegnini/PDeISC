import { Router } from 'express';
import { requireAuth,allowRoles } from '../middleware/auth.js';
import { me,listUsers,createUser } from '../controllers/userController.js';
const router=Router();
router.get('/me',requireAuth,me);
router.get('/',requireAuth,allowRoles('admin'),listUsers);
router.post('/',requireAuth,allowRoles('admin'),createUser);
export default router;
