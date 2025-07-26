import mongoose from 'mongoose';
import Warning from '../models/warning.model.js';
import { redlock } from '../utils/redlock.js';
import { getIO } from '../socket/socket.js';

export const createWarning = async (req, res) => {
  const session = await mongoose.startSession();
  const { warningTitle, warningContent, userId, overdueFee } = req.body;

  if (!warningContent || !userId || !warningTitle || !overdueFee) {
    return res.status(400).json({ message: "လိုအပ်သောအချက်အလက်များအားလုံးကို ဖြည့်ပါ။" });
  }

  const lockKey = `locks:warning:user:${userId}`;
  let lock;

  try {
      lock = await redlock.acquire([lockKey], 60000, {
      retryCount: 0,
      retryDelay: 0,
      retryJitter: 0,
    });

    session.startTransaction({
      readConcern: { level: "snapshot" },
      writeConcern: { w: "majority" },
    });

    const newWarning = new Warning({ warningTitle, warningContent, userId, overdueFee });
    await newWarning.save({ session });

    await session.commitTransaction();
        //Important delete timeout
        await new Promise(res => setTimeout(res, 1500));
    await lock.release();

    //socket
    const io = getIO()
    const populatedWarning = await Warning.findById(newWarning._id).populate("userId", "username");
    io.to("adminRoom").emit("adminJustWarning", populatedWarning);
    io.to(userId).emit("justWarning", populatedWarning);
    

    res.status(201).json(newWarning);
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    console.error("သတိပေးချက်ဖန်တီးရာတွင် ပြဿနာဖြစ်ပွားသည်:", error);
    if (error.code == 112) {
      return res.status(409).json({ message: "အခြားဈေးတာ၀န်ခံမှလည်း ပေးပို့နေပါသည်။" });
    }

    if (error.name === "LockError" || error.name == "ExecutionError") {
      return res.status(423).json({ message: "တခြားသူပေးပို့နေသည်။ နောက်မှပြန်ကြိုးစားပါ။" });
    }

    res.status(500).json({ message: "Server မှာ အမှားအယွင်း ဖြစ်ပွားနေသည်။" });
  } finally {
    session.endSession();
    if (lock) {
      await lock.release().catch(() => {});
    }
  }
};

// Get all warnings
export const getAllWarnings = async (req, res) => {
  try {
    const warnings = await Warning.find().populate('userId', 'username').sort({issueDate: -1});
    res.status(200).json(warnings);
  } catch (error) {
    console.error("Get Warnings Error:", error);
    res.status(500).json({ message: "ဆာဗာအမှား ဖြစ်ပွားခဲ့သည်။" });
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

    const allwarningByUser = await Warning.find({userId}).sort({issueDate: -1})

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

    if (isRead) {
      const io = getIO();
      io.to("adminRoom").emit("userWarningMarkedAsRead", updated); // for admin
      io.to(updated.userId.toString()).emit("warningMarkedAsRead", updated) // for user
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating warning:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
