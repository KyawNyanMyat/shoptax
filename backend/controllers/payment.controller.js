import mongoose from 'mongoose';
import Payment from '../models/payment.model.js';
import redlock from '../utils/redlock.js';
import Shop from '../models/shop.model.js';
import Warning from '../models/warning.model.js';
import Receipt from '../models/receipt.model.js';
import Redlock from 'redlock';
import { myanmarToEnglish } from '../utils/numberConverter.js';

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

    if (!userId || !shopId || !paymentType || !amount || !nextPaymentDueDate || !paymentPhoto) {
      return res.status(400).json({ message: "အချက်အလက်အားလုံးဖြည့်ရန် လိုအပ်ပါသည်။" });
    }

    const amountNumber = myanmarToEnglish(amount)
    if (isNaN(amountNumber) || amountNumber <= 0) {
      return res.status(400).json({ message: "ပမာဏသည် ငွေပမာဏဖြစ်ပြီး သုညထက်ကြီးရမည်။" });
    }

    const validTypes = ["NRC Register Cost", "Land Rent Cost", "Overdue Fee"];
    if (!validTypes.includes(paymentType)) {
      return res.status(400).json({ message: "ငွေပေးချေမှု အမျိုးအစား မမှန်ကန်ပါ။" });
    }

    const newPayment = new Payment({
      userId,
      shopId,
      paymentType,
      paymentPhoto,
      amount: amountNumber,
      nextPaymentDueDate,
    });

    await newPayment.save();
    res.status(201).json(newPayment);
  } catch (error) {
    console.error("Create Payment Error:", error);
    res.status(500).json({ message: "ဆာဗာအမှား ဖြစ်ပွားနေပါသည်။" });
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

    //In the future, do something
    if (!user) {
      return res.status(404).json({ message: "ငွေပေးချေမှုအချက်အလက်မတွေ့ရှိပါ။" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Get Payment Error:", error);
    res.status(500).json({ message: "ဆာဗာ အခက်အခဲ ဖြစ်ပွားနေပါသည်။" });
  }
};


export const getPendingPayments = async (req, res) => {
  try {
    const pendingPayments = await Payment.find({ status: "Pending" })
    .populate("userId", "username shopId")
    .populate("shopId")

    if(!pendingPayments) {
      return res.status(404).json({message: "မပေးရသေးသော ငွေပေးချေမှု မရှိပါ"})
    }

    res.status(200).json(pendingPayments);
  } catch (error) {
    console.error("Error fetching pending payments:", error);
    res.status(500).json({ message: "ဆာဗာ အခက်အခဲ ဖြစ်ပွားနေပါသည်။" });
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
    res.status(500).json({ message: "ဆာဗာ အခက်အခဲ ဖြစ်ပွားနေပါသည်။" });
  }
};


export const updatePaymentStatus = async (req, res) => {
  const adminId = req.admin?._id; // from Protect Route
  if (!adminId) {
    return res.status(401).json({ message: "အက်မင်အထောက်အထား မရှိပါ။ ဝင်ရောက်ခွင့်မပြုပါ။" });
  }

  const { id } = req.params;
  const { status, userId, rejectionReason } = req.body;

  if (!['Pending', 'Finished', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'မှန်ကန်သောအခြေအနေတန်ဖိုး မဟုတ်ပါ' });
  }

  let lock;
  const session = await mongoose.startSession();

  try {
    lock = await redlock.acquire([`locks:payment:${id}`], 10000, {
      retryCount: 0,
      retryDelay: 0,
      retryJitter: 0
    });

    session.startTransaction({
      readConcern: { level: "snapshot" },
      writeConcern: { w: "majority" },
    });

    const payment = await Payment.findById(id).session(session);
    if (!payment) {
      await session.abortTransaction();
      await lock.release();
      return res.status(404).json({ message: "ငွေပေးချေမှုအချက်အလက် မတွေ့ပါ" });
    }

    if (status === "Finished") {
      await Receipt.create([{
        paymentId: payment._id,
        adminId: adminId,
        amount: payment.amount,
        issueDate: new Date()
      }], { session });
    }

    if (status === "Rejected") {
      const shop = await Shop.findById(payment.shopId).session(session);
      if (!shop) throw new Error("ဆိုင် မတွေ့ပါ");

      await Warning.create([{
        warningTitle: "ငွေပေးချေမှု ပယ်ဖျက်ခြင်း",
        warningContent: `သင်၏ ရုံ ${shop.marketHallNo}/ဆိုင် ${shop.shopNo} တွင် ပြုလုပ်သော ${payment.paymentType} သည်
        ${rejectionReason} ကြောင့်ပယ်ဖျက်ခဲ့ပါသည်။ ကျေးဇူးပြု၍ မှန်ကန်သော ငွေပေးချေမှုဖောင်ကို ပြန်လည်တင်ပြပါ။`,
        userId: userId,
        issueDate: new Date()
      }], { session });
    }

    if (payment.status !== 'Pending') {
      await session.abortTransaction();
      await lock.release();
      return res.status(409).json({ message: `ငွေပေးချေမှုသည် ထပ်မံပြင်ဆင်လို့မရတော့ပါ။ (Status: ${payment.status})` });
    }

    payment.status = status;
    await payment.save({ session });

    await session.commitTransaction();
    await lock.release();

    const updated = await Payment.findById(id)
      .populate("userId", "username")
      .populate("shopId", "marketHallNo shopNo");

    res.status(200).json(updated);
  } catch (err) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }

    console.error("ငွေပေးချေမှုအခြေအနေ ပြင်ဆင်ရာတွင် ပြဿနာရှိသည်:", err);

    if (err.name == "ExecutionError" || err instanceof Redlock.LockError) {
      return res.status(423).json({ message: "ဤငွေပေးချေမှုကို တခြားအက်မင်မှ ပြင်ဆင်နေပါသည်။ ခဏစောင့်ပြီး ပြန်ကြိုးစားပါ။" });
    }

    if (err.code == 112) {
      return res.status(409).json({ message: "တခြားအက်မင်တစ်ဦးမှ ပြောင်းလဲမှုများ ပြုလုပ်ပြီးဖြစ်သည်။" });
    }

    res.status(500).json({ message: "ဆာဗာအတွင်းမှ အမှားတစ်ခု ဖြစ်ပွားခဲ့သည်" });
  } finally {
    session.endSession();
  }
};
