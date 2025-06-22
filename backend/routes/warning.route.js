import express from 'express';
import {
  createWarning,
  getAllWarnings,
  getWarningById,
  updateWarning,
  deleteWarning,
  getUnreadWarningsByUserId,
  getWarningsByUserId,
  updateWarningIsRead,
} from '../controllers/warning.controller.js';

const router = express.Router();

router.post('/', createWarning); // use by admin

router.get('/', getAllWarnings); // use by admin

router.get('/:id', getWarningById);

router.put('/:id', updateWarning);

router.delete('/:id', deleteWarning);

router.get('/unread/:userId', getUnreadWarningsByUserId); // used by user

router.get("/user/:userId", getWarningsByUserId); // used by user

router.patch("/user/:warningId", updateWarningIsRead); // used by user

export default router;
