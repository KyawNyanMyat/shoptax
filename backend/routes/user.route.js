import express from 'express';
import { createUser, deleteUser, getAllUsers, getUserById, loginUser, logoutUser, updateUser, userChangePassword } from '../controllers/user.controller.js';
import userProtectRoute from '../middleware/userProtectRoute.js';
import adminProtectRoute from '../middleware/adminProtectRoute.js';

const router = express.Router();

router.post('/', createUser);

router.post('/login', loginUser); // used by user

router.post('/changepassword/:userId', userProtectRoute, userChangePassword) // used by user

router.post("/logout", logoutUser); // used by user

router.get('/', adminProtectRoute, getAllUsers); // used by admin

router.get('/:id',userProtectRoute, getUserById); // used by user

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

export default router;
