import express from 'express';
import {
  createWarning,
  getAllWarnings,
  getWarningById,
  updateWarning,
  deleteWarning,
} from '../controllers/warning.controller.js';

const router = express.Router();

router.post('/', createWarning);

router.get('/', getAllWarnings);

router.get('/:id', getWarningById);

router.put('/:id', updateWarning);

router.delete('/:id', deleteWarning);

export default router;
