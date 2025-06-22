import express from 'express';
import { assignUserToShop, createShop, deleteShop, getAllShops, getShopById, getShopsByUserId, updateShop } from '../controllers/shop.controller.js';

const router = express.Router();

router.post('/', createShop);

router.get('/', getAllShops); 

router.put("/:shopId/assign", assignUserToShop); // used by admin

router.get('/user/:id', getShopsByUserId); // used by user

router.get('/:id', getShopById);

router.put('/:id', updateShop);

router.delete('/:id', deleteShop);

export default router;
