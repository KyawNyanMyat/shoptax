import express from 'express';
import { assignUserToShop, createShop, deleteShop, getAllShops, getShopById, getShopsByUserId, removeUserFromShop, updateShop } from '../controllers/shop.controller.js';
import userProtectRoute from '../middleware/userProtectRoute.js';
import adminProtectRoute from '../middleware/adminProtectRoute.js';

const router = express.Router();

router.post('/', adminProtectRoute, createShop); // used by admin

router.get('/', adminProtectRoute, getAllShops); // used by admin

router.put("/:shopId/assign", adminProtectRoute, assignUserToShop); // used by admin

router.patch("/:shopId/remove-user", adminProtectRoute, removeUserFromShop); // used by admin

router.get('/user/:id', userProtectRoute, getShopsByUserId); // used by user

router.get('/:id', getShopById);

router.put('/:id', updateShop);

router.delete('/:id', deleteShop);

export default router;
