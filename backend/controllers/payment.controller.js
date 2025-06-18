import Payment from '../models/payment.model.js';

// Create a new payment
export const createPayment = async (req, res) => {
  try {
    const {
      userId,
      shopId,
      paymentType,
      amount,
      nextPaymentDueDate,
    } = req.body;

    const paymentPhoto = req.file ? `/uploads/${req.file.filename}` : null;
    
    const newPayment = new Payment({
      userId,
      shopId,
      paymentType,
      paymentPhoto,
      amount,
      nextPaymentDueDate,
    });

    await newPayment.save();
    res.status(201).json(newPayment);
  } catch (error) {
    console.error("Create Payment Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all payments
export const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('userId', 'username')
      .populate('shopId', 'marketHallNo shopNo');

    if(!payments) {
      return res.status(404).json({message:[]})
    }
    res.status(200).json(payments);
  } catch (error) {
    console.error("Get Payments Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get one payment by ID
export const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('userId', 'username')
      .populate('shopId', 'marketHallNo shopNo');

    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json(payment);
  } catch (error) {
    console.error("Get Payment Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update payment
export const updatePayment = async (req, res) => {
  try {
    const updatedPayment = await Payment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json(updatedPayment);
  } catch (error) {
    console.error("Update Payment Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete payment
export const deletePayment = async (req, res) => {
  try {
    const deletedPayment = await Payment.findByIdAndDelete(req.params.id);

    if (!deletedPayment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    res.status(200).json({ message: "Payment deleted successfully" });
  } catch (error) {
    console.error("Delete Payment Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};



export const getPaymentByUserId = async (req, res) => {
  try {
    const { id } = req.params
    const user = await Payment.findOne({userId: id}).sort({paidDate: -1})

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Get Payment Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


export const getPendingPayments = async (req, res) => {
  try {
    const pendingPayments = await Payment.find({ status: "Pending" })
    .populate("userId", "username shopId")
    .populate("shopId")

    if(!pendingPayments) {
      return res.status(404).json({message: "No pending Payment is found"})
    }

    res.status(200).json(pendingPayments);
  } catch (error) {
    console.error("Error fetching pending payments:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


// controllers/paymentController.js
export const getOverdueUsers = async (req, res) => {
  try {
    const today = new Date();

    const overduePayments = await Payment.find({
      nextPaymentDueDate: { $lt: today },
      status: "Pending"
    }).populate("userId", "username shopId").populate("shopId");

    if (!overduePayments.length) {
      return res.status(200).json([]); // return empty array
    }

    res.status(200).json(overduePayments);
  } catch (error) {
    console.error("Error fetching overdue payments:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
