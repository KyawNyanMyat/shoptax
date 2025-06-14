import ShopHistory from '../models/shopHistory.model.js';

// Create a new shop occupancy record
export const createShopHistory = async (req, res) => {
  try {
    const { userId, marketHallNo, shopNo, assignedDate, releasedDate } = req.body;

    if (!userId || !marketHallNo || !shopNo || !assignedDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newHistory = new ShopHistory({
      userId,
      marketHallNo,
      shopNo,
      assignedDate,
      releasedDate
    });

    await newHistory.save();
    res.status(201).json(newHistory);
  } catch (error) {
    console.error("Create ShopHistory Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all shop occupancy histories
export const getAllShopHistories = async (req, res) => {
  try {
    const histories = await ShopHistory.find()
      .populate('userId', 'username phoneNo');
    res.status(200).json(histories);
  } catch (error) {
    console.error("Get ShopHistories Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get one shop occupancy history by ID
export const getShopHistoryById = async (req, res) => {
  try {
    const history = await ShopHistory.findById(req.params.id)
      .populate('userId', 'username phoneNo');
    if (!history) return res.status(404).json({ message: "Shop history not found" });

    res.status(200).json(history);
  } catch (error) {
    console.error("Get ShopHistory Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update a shop occupancy history (e.g., set releasedDate)
export const updateShopHistory = async (req, res) => {
  try {
    const updatedHistory = await ShopHistory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedHistory) return res.status(404).json({ message: "Shop history not found" });

    res.status(200).json(updatedHistory);
  } catch (error) {
    console.error("Update ShopHistory Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete a shop occupancy history record
export const deleteShopHistory = async (req, res) => {
  try {
    const deletedHistory = await ShopHistory.findByIdAndDelete(req.params.id);
    if (!deletedHistory) return res.status(404).json({ message: "Shop history not found" });

    res.status(200).json({ message: "Shop history deleted successfully" });
  } catch (error) {
    console.error("Delete ShopHistory Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
