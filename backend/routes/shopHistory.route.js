import express from 'express';
import {
  createShopHistory,
  getAllShopHistories,
  getShopHistoryById,
  updateShopHistory,
  deleteShopHistory,
} from '../controllers/shopHistory.controller.js';

const router = express.Router();

router.post('/', createShopHistory);

router.get('/', getAllShopHistories);

router.get('/:id', getShopHistoryById);

router.put('/:id', updateShopHistory);

router.delete('/:id', deleteShopHistory);

export default router;
