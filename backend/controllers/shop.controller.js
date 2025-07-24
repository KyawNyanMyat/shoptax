import Redlock from 'redlock';
import Shop from '../models/shop.model.js';
import { redlock } from '../utils/redlock.js';
import mongoose from 'mongoose';
import { getIO } from '../socket/socket.js';
import { getOverdueUsersData } from '../utils/overdueHelpers.js';

// Create a new shop
export const createShop = async (req, res) => {
  try {
    const { marketHallNo, shopNo, chargeRate } = req.body;

    if (!marketHallNo || !shopNo || !chargeRate) {
      return res.status(400).json({ message: "လိုအပ်သောအချက်အလက်များ ဖြည့်စွက်ပါ။" });
    }

    const exists = await Shop.findOne({ marketHallNo, shopNo });
    if (exists) {
      return res.status(400).json({ message: "ဈေးရုံတွင် ဤဆိုင် နံပါတ်သည် ရှိပြီးသား ဖြစ်ပါသည်။" });
    }

    const newShop = new Shop({ marketHallNo, shopNo, chargeRate });
    await newShop.save();

    const io = getIO();
    io.to("adminRoom").emit("addedNewShop", newShop)
    res.status(201).json(newShop);
  } catch (error) {
    console.error("ဆိုင်ဖန်တီးရာတွင် ပြဿနာ:", error);
    res.status(500).json({ message: "ဆာဗာအမှား ဖြစ်ပွားခဲ့သည်။" });
  }
};

// Get all shops
export const getAllShops = async (req, res) => {
  try {

    const shops = await Shop.find().populate("userId", "username");
    res.status(200).json(shops);
  } catch (error) {
    console.error("Get Shops Error:", error);
    res.status(500).json({ message: "ဆာဗာ အခက်အခဲ ဖြစ်ပွားနေပါသည်။" });
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
      return res.status(404).json({ message: "အရောင်းဆိုင် ပိုင်ဆိုင်မှုမရှိပါ"})
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
    return res.status(400).json({ message: "Shop ID သို့မဟုတ် User ID မှားယွင်းနေပါသည်။" });
  }

  const lockKey = `locks:shop:${shopId}`;

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

    const shop = await Shop.findById(shopId).session(session);
    if (!shop) {
      await session.abortTransaction();
      await lock.release();
      return res.status(404).json({ message: "ဖော်ပြထားသော ဆိုင်ကို မတွေ့ပါ။" });
    }

    shop.userId = userId;
    await shop.save({ session });

    await session.commitTransaction();
    await lock.release();

    //for socket to get updated data
    const updatedShop = await Shop.findById(shopId)
    .populate("userId", "username")
    .session(session);

    //socket
    const io = getIO();
    io.emit("shopAssignedToUser",updatedShop) // for admin
    io.to(userId).emit("shopAssigned", updatedShop) // for user

    res.status(200).json({ message: "အသုံးပြုသူအား ဆိုင်အပ်နှင်းခြင်း အောင်မြင်ပါသည်။" });
  } catch (error) {
    await session.abortTransaction();

    if (error.name === "LockError" || error.name === "ExecutionError") {
      return res.status(423).json({ message: "အရင်းအမြစ်ကို တခြားသူအသုံးပြုနေသည်။ နောက်မှပြန်ကြိုးစားပါ။" });
    }

    if (error.code == 112) {
      return res.status(409).json({ message: "တခြားဈေးတာ၀န်ခံသူတစ်ဦးမှ အချက်အလက်ပြောင်းလဲမှုများ ပြုလုပ်ထားသည်။" });
    }

    console.error("အသုံးပြုသူအား ဆိုင်အပ်နှင်းရာတွင် ပြဿနာ:", error);
    res.status(500).json({ message: "ဆာဗာအတွင်းအမှား ဖြစ်ပွားခဲ့သည်။" });
  } finally {
    session.endSession();
  }
};


export const removeUserFromShop = async (req, res) => {
  const { shopId } = req.params;
  const session = await mongoose.startSession();
  const lockKey = `locks:shop:${shopId}`;
  let lock;

  try {
    lock = await redlock.acquire([lockKey], 10000, {
      retryCount: 0,
      retryDelay: 0,
      retryJitter: 0
    });
    session.startTransaction({
      readConcern: { level: "snapshot" },
      writeConcern: { w: "majority" },
    });

    const shop = await Shop.findById(shopId).session(session);
    if (!shop) {
      await session.abortTransaction();
      return res.status(404).json({ message: "ဆိုင်ကိုမတွေ့ရှိနိုင်ပါ" });
    }

    if (!shop.userId) {
      await session.abortTransaction();
      return res.status(400).json({ message: "ဤဆိုင်တွင် အသုံးပြုသူမရှိသေးပါ" });
    }
    const forSocketUserId = shop.userId
    shop.userId = null;
    await shop.save({ session });

    await session.commitTransaction();

    //socket
    const io = getIO();
    // const updatedShop = await Shop.findById(shopId)
    io.emit("shopUserRemoved",shop) // for admin
    io.to(forSocketUserId.toString()).emit("shopRemoved", shop) // for user

    const dummytoday = new Date(); // July 11, 2025
    const overdue = await getOverdueUsersData(dummytoday);
    io.to("adminRoom").emit("overdueUpdated", overdue.length)

    res.status(200).json({ message: "အသုံးပြုသူကို ဆိုင်မှအောင်မြင်စွာ ဖယ်ရှားပြီးပါပြီ" });
  } catch (err) {
    await session.abortTransaction();
    console.error("Remove user error:", err.message);

    if (err.name === "LockError" || err.name === "ExecutionError") {
      return res.status(423).json({ message: "အရင်းအမြစ်ကို တခြားသူအသုံးပြုနေသည်။ နောက်မှပြန်ကြိုးစားပါ။" });
    }

    if (err.code == 112) {
      return res.status(409).json({ message: "တခြားဈေးတာ၀န်ခံ သူတစ်ဦးမှ အချက်အလက်ပြောင်းလဲမှုများ ပြုလုပ်ထားသည်။" });
    }

    res.status(500).json({ message: "အသုံးပြုသူကို ဆိုင်မှဖယ်ရှားရာတွင် မအောင်မြင်ပါ" });
  } finally {
    session.endSession();
    if (lock) {
      await lock.release().catch(() => {});
    }
  }
};


export const changeShopTax = async (req, res)=>{
  const { shopId } = req.params;
  const session = await mongoose.startSession()
  let lock;
  try {
    lock = await redlock.acquire([`locks:shop:${shopId}`], 10000, {
      retryCount: 0,
      retryDelay: 0,
      retryJitter: 0
    });
    session.startTransaction({
      readConcern: { level: "snapshot" },
      writeConcern: { w: "majority" },
    })

    const updatedTax = await Shop.findByIdAndUpdate(
      shopId,
      {chargeRate: req.body.chargeRate},
      {new: true, session}
    )

    if(!updatedTax){
      return res.status(404).json({message: "ဆိုင်ကိုမတွေ့ရှိနိုင်ပါ"})
    }

    await session.commitTransaction();
    //Important
    //await lock.release()

    //socket
    const io = getIO();
    io.emit("shopTaxChanged", updatedTax)

    res.status(200).json(updatedTax)

  } catch (error) {
    await session.abortTransaction();
    console.log("Error in shop controller changeShopTax", error)

    if (error.name === "LockError" || error.name === "ExecutionError") {
      return res.status(423).json({ message: "အရင်းအမြစ်ကို တခြားသူအသုံးပြုနေသည်။ နောက်မှပြန်ကြိုးစားပါ။" });
    }

    if (error.code == 112) {
      return res.status(409).json({ message: "တခြားဈေးတာ၀န်ခံ သူတစ်ဦးမှ အချက်အလက်ပြောင်းလဲမှုများ ပြုလုပ်ထားသည်။" });
    }

    res.status(500).json({ message: "ဆိုင်အခွန်ပြောင်းလဲချင်း မအောင်မြင်ပါ" });
  }
  finally{
    session.endSession()
    //Important
    // if (lock) {
    //   await lock.release().catch(() => {});
    // }
  }
}

