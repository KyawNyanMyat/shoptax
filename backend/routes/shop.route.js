import express from 'express';
import { createShop, deleteShop, getAllShops, getShopById, updateShop } from '../controllers/shop.controller.js';

const router = express.Router();

router.post('/', createShop);
router.get('/', getAllShops);
router.get('/:id', getShopById);
router.put('/:id', updateShop);
router.delete('/:id', deleteShop);

export default router;
