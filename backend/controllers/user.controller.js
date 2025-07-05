import User from "../models/user.model.js";
import Shop from "../models/shop.model.js";
import myanmarToEnglishInitial from "../utils/myanmarInitialMap.js";
import generateUserTokenAndCookie from "../utils/generateUserToken.js";
import { redis, redlock } from "../utils/redlock.js";
import jwt from "jsonwebtoken"
import { getIO } from "../socket/socket.js";

// Create a new user, In the future, check the same username
export const createUser = async (req, res) => {
  try {
    const {
      username, password, confirmPassword, NRC,
      phoneNo, gender
    } = req.body;
    
    if (
      !username?.trim() || !password?.trim() || !confirmPassword?.trim() ||
      !NRC?.trim() || !phoneNo?.trim() || !gender?.trim()
    ) {
      return res.status(400).json({ message: "အချက်လက် အကုန်ဖြည့်ပါ" });
    }
    
    if(!/^[\u1000-\u109F\uAA60-\uAA7F\u102B-\u103E\u1039-\u103A\s၊။]+$/.test(username)) {
      return res.status(400).json({ message: "နာမည်သည် မြန်မာလိုပဲဖြစ်ရမယ်"})
    }

    if(password.trim() != confirmPassword.trim()){
      return res.status(400).json({message: "လျို့၀ှက်နံပါတ်ကို ပြန်စစ်ပါ"})
    }
  

    const nrcRegex = /^(၁[၀-၄]|[၁-၉])\/[က-အ]{3}\((နိုင်|ဧည့်|ပြု|သာသနာ|ယာယီ|စ)\)([၀-၉]{6})$/;
    if (!nrcRegex.test(NRC)) {
      return res.status(400).json({  message: "မှတ်ပုံတင်နံပါတ်ပြန်စစ်ရန်" });
    }

    // if (!/^၀၉\-([၀-၉]{7}|[၀-၉]{9})$/.test(phoneNo)) {
    //   return res.status(400).json({  message: "ဖုန်းနံပါတ်သည် 09- နဲ့စပြီး ၉ သို့မဟုတ် ၁၁ လုံးပါရပါမည်။" });
    // }

    if (!/^09\-([0-9]{7}|[0-9]{9})$/.test(phoneNo)){
        return res.status(400).json({ message: "ဖုန်းနံပါတ်သည် 09- နဲ့စပြီး 9 သို့မဟုတ် 11 လုံးပါရပါမည်။" })
    }


    const getMyanmarInitials = (name) => {
      let initials = '';
      for (const char of name) {
        if (myanmarToEnglishInitial[char]) {
          initials += myanmarToEnglishInitial[char][0]; // first letter only
        }
      }
      return initials == '' ? 'New User' : initials.toUpperCase();
    };

    const avatarName = getMyanmarInitials(username)
    const profilePhoto = `https://ui-avatars.com/api/?name=${avatarName}&background=random`
    
    const newUser = new User({
        username,
        password,
        profilePhoto,
        NRC,
        phoneNo,
        gender,
    });

    await newUser.save();
    const userObj = newUser.toObject();
    delete userObj.password;

    const io = getIO();
    io.emit("newUserCreated", userObj)

    res.status(201).json(userObj);

  } catch (error) {
    console.error("Create User Error:", error);

    // duplicate key error
    if (error.code == 11000) {
      return res.status(409).json({ message: "NRC ရှိနေပြီးသားဖြစ်ပါသည်" });
    }

    res.status(500).json({ message: "ဆာဗာ အခက်အခဲ ဖြစ်ပွားနေပါသည်။" });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  const { search } = req.query;

  try {
    let query = {};

    if (search) {
      query.username = { $regex: search, $options: "i" }; // case-insensitive search
    }

    const users = await User.find(query);
    res.status(200).json(users);
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ message: "ဆာဗာ အခက်အခဲ ဖြစ်ပွားနေပါသည်။" });
  }
};


// Get one user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "အသုံပြုသူကိုမတွေ့ရှိပါ" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ message: "Server ပြဿနာဖြစ်ပေါ်နေပါသည်" });
  }
};

// Update user by ID
export const updateUser = async (req, res) => {
  try {
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true }
    ).select("-password");
    if (!updatedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Update User Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete user by ID
export const deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Delete User Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user || user.password !== password) {
      return res.status(401).json({ message: "အချက်လက်မှားယွင်းနေပါသည်" });
    }

    const userObj = user.toObject();
    delete userObj.password;
    
    // const lockkey = `locks:user:${userObj._id}`; // for every user that try to login
    // const locksession = `locks:user:active:${userObj._id}`;

    // const lock = await redlock.acquire([lockkey], 5000); // for every user that try to login

    // try{
    //   const existingToken = await redis.get(locksession);
    //   if(existingToken){
    //     return res.status(403).json({ message: "အကောင့်သည် တခြားတစ်နေရာတွင် အသုံးပြုနေသည်။" });
    //   }

    //   const token = generateUserTokenAndCookie(userObj._id, res)
    //   await redis.set(locksession, token, "EX", 60 * 60 * 24 * 15); // 15 days //In the future change this time

    //   res.status(200).json(userObj);
    // }finally{
    //   await lock.release()
    // }
    const token = generateUserTokenAndCookie(userObj._id, res)
    res.status(200).json(userObj);
    
  } catch (error) {
    console.error("Login error:", error);

    if (error.name === "LockError"|| error.name == "ExecutionError") {
      return res.status(423).json({ message: "အကောင့်သည် တခြားတစ်နေရာတွင် အသုံးပြုနေသည်။" });
    }
    res.status(500).json({ message: "Server error" });
  }
};


export const logoutUser = async (req, res) => {
  try {
    // const token = req.cookies.usertoken;
    // const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);

    res.clearCookie("usertoken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // use HTTPS in production
      sameSite: "strict",
    });

    //await redis.del(`locks:user:active:${decoded.UserId}`);

    res.status(200).json({ message: "ထွက်ခွာခြင်း အောင်မြင်ပါသည်။" });
  } catch (error) {
    console.error("Logout Error:", error.message);
    res.status(500).json({ message: "ထွက်ခွာမှု မအောင်မြင်ပါ။" });
  }
};

