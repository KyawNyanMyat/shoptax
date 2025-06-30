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
import userProtectRoute from '../middleware/userProtectRoute.js';
import adminProtectRoute from '../middleware/adminProtectRoute.js';

const router = express.Router();

router.post('/', adminProtectRoute, createWarning); // use by admin

router.get('/', adminProtectRoute, getAllWarnings); // use by admin

router.get('/:id', getWarningById);

router.put('/:id', updateWarning);

router.delete('/:id', deleteWarning);

router.get('/unread/:userId', userProtectRoute , getUnreadWarningsByUserId); // used by user

router.get("/user/:userId", userProtectRoute, getWarningsByUserId); // used by user

router.patch("/user/:warningId", userProtectRoute, updateWarningIsRead); // used by user

export default router;
