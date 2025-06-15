import Payment from '../models/payment.model.js';

// Create a new payment
export const createPayment = async (req, res) => {
  try {
    const {
      userId,
      shopId,
      paymentType,
      paymentPhoto,
      amount,
      paidDate,
      nextPaymentDueDate,
      status
    } = req.body;

    const newPayment = new Payment({
      userId,
      shopId,
      paymentType,
      paymentPhoto,
      amount,
      paidDate,
      nextPaymentDueDate,
      status
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
