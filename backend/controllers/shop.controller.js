import Redlock from 'redlock';
import Shop from '../models/shop.model.js';
import redlock from '../utils/redlock.js';
import mongoose from 'mongoose';

// Create a new shop
export const createShop = async (req, res) => {
  try {
    const { _id,marketHallNo, shopNo, chargeRate } = req.body;

    if(!marketHallNo || !shopNo || !chargeRate){
        return res.status(400).json({ message:"Fill the required field"})
    }

    // Optional: prevent duplicate shop numbers in same hall
    const exists = await Shop.findOne({ marketHallNo, shopNo });
    if (exists) {
        return res.status(400).json({ message: "Shop already exists in this hall" });
    }

    const newShop = new Shop({ _id,marketHallNo, shopNo , chargeRate});
    await newShop.save();

    res.status(201).json(newShop);
  } catch (error) {
    console.error("Create Shop Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all shops
export const getAllShops = async (req, res) => {
  try {
    const shops = await Shop.find();
    res.status(200).json(shops);
  } catch (error) {
    console.error("Get Shops Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get one shop by ID
export const getShopById = async (req, res) => {
  try {
    const shop = await Shop.findById(req.params.id);
    if (!shop) return res.status(404).json({ message: "Shop not found" });

    res.status(200).json(shop);
  } catch (error) {
    console.error("Get Shop Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update shop
export const updateShop = async (req, res) => {
  try {
    const updatedShop = await Shop.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
    );
    if (!updatedShop) return res.status(404).json({ message: "Shop not found" });

    res.status(200).json(updatedShop);
  } catch (error) {
    console.error("Update Shop Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete shop
export const deleteShop = async (req, res) => {
  try {
    const deletedShop = await Shop.findByIdAndDelete(req.params.id);
    if (!deletedShop) return res.status(404).json({ message: "Shop not found" });

    res.status(200).json({ message: "Shop deleted successfully" });
  } catch (error) {
    console.error("Delete Shop Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


export const getShopsByUserId = async(req, res)=>{
  try {
    const { id: userId } = req.params;
    const ownShopUsers = await Shop.find({ userId }).populate("userId","username");
    if(ownShopUsers.length == 0){
      return res.status(404).json([])
    }

    res.status(200).json(ownShopUsers)
  } catch (error) {
    console.error("Get Shop By UserID:", error);
    res.status(500).json({ message: "Server Error" });
  }
}


export const assignUserToShop = async (req, res) => {
  const session = await mongoose.startSession();
  const shopId = req.params.shopId;
  const { userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(shopId) || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ message: "Invalid shopId or userId" });
  }

  const lockKey = `locks:shop:${shopId}`;

  try {

    const lock = await redlock.acquire([lockKey], 10000,{
      retryCount: 0,
      retryDelay: 0,
      retryJitter: 0,
    });

    session.startTransaction({
      readConcern: { level: "snapshot" },
      writeConcern: { w: "majority" },
    });

    // Find shop and assign userId
    const shop = await Shop.findById(shopId).session(session);
    if (!shop) {
      await session.abortTransaction();
      await lock.release();
      return res.status(404).json({ message: "Shop not found" });
    }

    shop.userId = userId; // assign user
    await shop.save({ session });

    await session.commitTransaction();

    await lock.release();

    res.status(200).json({ message: "User assigned to shop successfully" });
  } catch (error) {
    await session.abortTransaction();

    // In case lock not acquired, or any other error
    if (error instanceof Redlock.LockError || error.name == "ExecutionError") {
      return res.status(423).json({ message: "Resource is locked, please retry" });
    }

    if(error.code == 112) return res.status(409).json({error:"Another admin made changes"})

    console.error("Assign user to shop error:", error);
    res.status(500).json({ message: "Internal server error" });
  } finally {
    session.endSession();
  }
};
