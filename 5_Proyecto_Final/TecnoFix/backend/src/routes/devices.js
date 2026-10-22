import { Router } from 'express';
import { requireAuth,allowRoles } from '../middleware/auth.js';
import { listDevices,createDevice } from '../controllers/deviceController.js';
const router=Router();
router.get('/',requireAuth,allowRoles('admin','tecnico','cliente'),listDevices);
router.post('/',requireAuth,allowRoles('cliente'),createDevice);
export default router;
