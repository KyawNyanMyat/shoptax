import Warning from '../models/warning.model.js';

// Create a new warning
export const createWarning = async (req, res) => {
  try {
    const { warningContent, userId } = req.body;

    if (!warningContent || !userId) {
      return res.status(400).json({ message: "warningContent and userId are required" });
    }

    const newWarning = new Warning({ warningContent, userId });
    await newWarning.save();

    res.status(201).json(newWarning);
  } catch (error) {
    console.error("Create Warning Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all warnings
export const getAllWarnings = async (req, res) => {
  try {
    const warnings = await Warning.find().populate('userId', 'username');
    res.status(200).json(warnings);
  } catch (error) {
    console.error("Get Warnings Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get one warning by ID
export const getWarningById = async (req, res) => {
  try {
    const warning = await Warning.findById(req.params.id).populate('userId', 'username');
    if (!warning) return res.status(404).json({ message: "Warning not found" });

    res.status(200).json(warning);
  } catch (error) {
    console.error("Get Warning Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update warning (e.g., mark as read)
export const updateWarning = async (req, res) => {
  try {
    const updatedWarning = await Warning.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedWarning) return res.status(404).json({ message: "Warning not found" });

    res.status(200).json(updatedWarning);
  } catch (error) {
    console.error("Update Warning Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete warning
export const deleteWarning = async (req, res) => {
  try {
    const deletedWarning = await Warning.findByIdAndDelete(req.params.id);
    if (!deletedWarning) return res.status(404).json({ message: "Warning not found" });

    res.status(200).json({ message: "Warning deleted successfully" });
  } catch (error) {
    console.error("Delete Warning Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};



export const getUnreadWarningsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const unreadWarnings = await Warning.find({
      userId,
      isRead: true,
    }).sort({ date: -1 });

    res.status(200).json(unreadWarnings);
  } catch (error) {
    console.error("Error fetching unread warnings:", error);
    res.status(500).json({ message: "Server error while fetching warnings." });
  }
};