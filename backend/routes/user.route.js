import express from 'express';
import { createUser, deleteUser, getAllUsers, getUserById, loginUser, updateUser } from '../controllers/user.controller.js';

const router = express.Router();

router.post('/', createUser);

router.post('/login', loginUser);

router.get('/', getAllUsers); // used by admin

router.get('/:id', getUserById); // used by user

router.put('/:id', updateUser);

router.delete('/:id', deleteUser);

export default router;
