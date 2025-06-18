import Shop from '../models/shop.model.js';

// Create a new shop
export const createShop = async (req, res) => {
  try {
    const { _id,marketHallNo, shopNo, chargeRate } = req.body;

    if(!marketHallNo || !shopNo){
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
