import mongoose from 'mongoose';
import Warning from '../models/warning.model.js';
import redlock from '../utils/redlock.js';

// Create a new warning
export const createWarning = async (req, res) => {
  const session = await mongoose.startSession();
  const { warningTitle, warningContent, userId } = req.body;

  if (!warningContent || !userId || !warningTitle) {
    return res.status(400).json({ message: "Fill all required fields" });
  }

  const lockKey = `locks:warning:user:${userId}`; // Lock key per user

  try {
    const lock = await redlock.acquire([lockKey], 10000, {
      retryCount: 0,
      retryDelay: 0,
      retryJitter: 0,
    });

    session.startTransaction({
      readConcern: { level: "snapshot" },
      writeConcern: { w: "majority" },
    });
    

    const newWarning = new Warning({ warningTitle, warningContent, userId });
    await newWarning.save({ session });

    await session.commitTransaction();
    await lock.release();

    res.status(201).json(newWarning);
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    if (error instanceof redlock.LockError || error.name == "ExecutionError") {
      return res.status(423).json({ message: "Another admin is creating a warning. Please try again shortly." });
    }

    if(err.code == 112) return res.status(409).json({error:"Another admin is also sending"})

    console.error("Create Warning Error:", error);
    res.status(500).json({ message: "Server Error" });
  } finally {
    session.endSession();
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
      isRead: false,
    }).sort({ date: -1 });

    res.status(200).json(unreadWarnings);
  } catch (error) {
    console.error("Error fetching unread warnings:", error);
    res.status(500).json({ message: "Server error while fetching warnings." });
  }
};


export const getWarningsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const allwarningByUser = await Warning.find({userId})

    res.status(200).json(allwarningByUser);
  } catch (error) {
    console.error("Error in getWarningsByUserId:", error.message);
    res.status(500).json({ message: "Server error getting warnings" });
  }
};


export const updateWarningIsRead = async (req, res) => {
  try {
    const { warningId } = req.params;
    const { isRead } = req.body;

    const updated = await Warning.findByIdAndUpdate(
      warningId,
      { isRead },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Warning not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating warning:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
