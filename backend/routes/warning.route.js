import express from 'express';
import {
  createWarning,
  getAllWarnings,
  getWarningById,
  updateWarning,
  deleteWarning,
  getUnreadWarningsByUserId,
} from '../controllers/warning.controller.js';

const router = express.Router();

router.post('/', createWarning);

router.get('/', getAllWarnings);

router.get('/:id', getWarningById);

router.put('/:id', updateWarning);

router.delete('/:id', deleteWarning);

router.get('/unread/:userId', getUnreadWarningsByUserId);

export default router;
