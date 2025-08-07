import Payment from '../models/payment.model.js';
import Receipt from '../models/receipt.model.js';
import { getIO } from '../socket/socket.js';

// Create a new receipt
export const createReceipt = async (req, res) => {
  try {
    const { paymentId, adminId, amount } = req.body;

    const newReceipt = new Receipt({
      paymentId,
      adminId,
      amount
    });

    await newReceipt.save();
    res.status(201).json(newReceipt);
  } catch (error) {
    console.error("Create Receipt Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all receipts
export const getAllReceipts = async (req, res) => {
  try {
    const receipts = await Receipt.find()
      .populate(
        {
          path:'paymentId', 
          populate: [
            {path: "userId", select: "_id username"},
            {path: "shopId"}
          ]
        }
      )
      .populate('adminId', 'adminName')
      .sort({issueDate: -1});

    res.status(200).json(receipts);
  } catch (error) {
    console.error("Get Receipts Error:", error);
    res.status(500).json({ message: "ဆာဗာအတွင်း အမှားရှိနေသည်။" });
  }
};

// Get one receipt by ID
export const getReceiptById = async (req, res) => {
  try {
    const receipt = await Receipt.findById(req.params.id)
      .populate('paymentId')
      .populate('adminId', 'adminName');

    if (!receipt) {
      return res.status(404).json({ message: "Receipt not found" });
    }

    res.status(200).json(receipt);
  } catch (error) {
    console.error("Get Receipt Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update receipt
export const updateReceipt = async (req, res) => {
  try {
    const updatedReceipt = await Receipt.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedReceipt) {
      return res.status(404).json({ message: "Receipt not found" });
    }

    res.status(200).json(updatedReceipt);
  } catch (error) {
    console.error("Update Receipt Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete receipt
export const deleteReceipt = async (req, res) => {
  try {
    const deletedReceipt = await Receipt.findByIdAndDelete(req.params.id);

    if (!deletedReceipt) {
      return res.status(404).json({ message: "Receipt not found" });
    }

    res.status(200).json({ message: "Receipt deleted successfully" });
  } catch (error) {
    console.error("Delete Receipt Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


export const getReceiptsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const payments = await Payment.find({ userId }).select("_id");

    const paymentIds = payments.map((p) => p._id);
    const receipts = await Receipt.find({ paymentId: { $in: paymentIds } })
      .populate({
        path: "paymentId",
        populate: [
          { path: "shopId", select: "marketHallNo shopNo" },
          { path: "userId", select: "username" },
        ]        
      })
      .populate("adminId", "adminName")
      .sort({ issueDate: -1 });

    res.status(200).json(receipts);
  } catch (error) {
    console.error("Error fetching receipts:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const getAllUnreadReceiptsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const payments = await Payment.find({ userId }).select("_id");

    // if (!payments.length) {
    //   return res.status(200).json([]); // No payments = no receipts
    // }
    const paymentIds = payments.map((p) => p._id);

    const allUnreadReceipts = await Receipt.find({ paymentId: {$in: paymentIds},isRead: false});

    if (!allUnreadReceipts) {
      return res.status(404).json({ message: "Read Receipt not found" });
    }

    res.status(200).json(allUnreadReceipts);
  } catch (error) {
    console.error("Error in getAllUnreadReceipts:", error);
    res.status(500).json({ message: "Server error" });
  }
};


export const markReceiptAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const updatedReceipt = await Receipt.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true }
    )
    .populate({
      path: "paymentId",
      populate: [
        { path: "shopId", select: "marketHallNo shopNo" },
        { path: "userId", select: "username" },
      ]        
    })
    .populate("adminId", "adminName");

    if (!updatedReceipt) {
      return res.status(404).json({ message: "Receipt not found" });
    }

    //socket
    const io = getIO();
    io.to("adminRoom").emit("userReceiptMarkedAsRead", updatedReceipt); // for admin
    io.to(updatedReceipt.paymentId.userId._id.toString()).emit("receiptMarkedAsRead", updatedReceipt) // for user

    res.status(200).json(updatedReceipt);
  } catch (error) {
    console.error("Error in markReceiptAsRead:", error);
    res.status(500).json({ message: "Server error while marking receipt as read" });
  }
};
