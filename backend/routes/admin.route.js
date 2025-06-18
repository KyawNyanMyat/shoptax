// routes/admin.routes.js
import express from 'express';
import { createAdmin, deleteAdmin, getAdminById, getAllAdmins, loginAdmin, updateAdmin } from '../controllers/admin.controller.js';


const router = express.Router();

router.post('/login', loginAdmin);

router.post('/signup', createAdmin);

router.get('/', getAllAdmins);

router.get('/:id', getAdminById);

router.put('/:id', updateAdmin);

router.delete('/:id', deleteAdmin);

export default router;
