// routes/admin.routes.js
import express from 'express';
import { createAdmin, deleteAdmin, getAdminById, getAllAdmins, loginAdmin, logoutAdmin, updateAdmin } from '../controllers/admin.controller.js';
import adminProtectRoute from '../middleware/adminProtectRoute.js';


const router = express.Router();

router.post('/login', loginAdmin); // used by admin

router.post("/logout", logoutAdmin); 

router.post('/signup', adminProtectRoute, createAdmin); // used by admin

router.get('/', adminProtectRoute, getAllAdmins); // used by admin

router.get('/:id', getAdminById);

router.put('/:id', updateAdmin);

router.delete('/:id', deleteAdmin);

export default router;
