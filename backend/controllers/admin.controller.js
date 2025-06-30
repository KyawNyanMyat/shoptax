import Admin from '../models/admin.model.js';
import generateAdminTokenAndCookie from '../utils/generateAdminToken.js';
import myanmarToEnglishInitial from '../utils/myanmarInitialMap.js';

// Create a new admin, In the future, check the same username
export const createAdmin = async (req, res) => {
  try {
    const { adminName, adminPassword, phoneNo, section, position } = req.body;
    if (
      !adminName?.trim() || !adminPassword?.trim() || !section?.trim() ||
      !position?.trim() || !phoneNo?.trim()
    ) {
      return res.status(400).json({ message: "အချက်လက် အကုန်ဖြည့်ပါ" });
    }

    if(!/^[\u1000-\u109F\uAA60-\uAA7F\u102B-\u103E\u1039-\u103A\s၊။]+$/.test(adminName)) {
      return res.status(400).json({ message: "နာမည်သည် မြန်မာလိုပဲဖြစ်ရမယ်"})
    }

    // if (!/^၀၉\-([၀-၉]{7}|[၀-၉]{9})$/.test(phoneNo)) {
    //   return res.status(400).json({  message: "ဖုန်းနံပါတ်သည် 09- နဲ့စပြီး ၉ သို့မဟုတ် ၁၁ လုံးပါရပါမည်။" });
    // }

    if (!/^09\-([0-9]{7}|[0-9]{9})$/.test(phoneNo)){
      return res.status(400).json({ message: "ဖုန်းနံပါတ်သည် 09- နဲ့စပြီး 9 သို့မဟုတ် 11 လုံးပါရပါမည်။" })
    }

    if(!/^[\u1000-\u109F\uAA60-\uAA7F\u102B-\u103E\u1039-\u103A\s၊။]+$/.test(section)) {
      return res.status(400).json({ message: "ဌာနသည် မြန်မာလိုပဲဖြစ်ရမယ်"})
    }

    if(!/^[\u1000-\u109F\uAA60-\uAA7F\u102B-\u103E\u1039-\u103A\s၊။]+$/.test(position)) {
      return res.status(400).json({ message: "ရာထူးသည် မြန်မာလိုပဲဖြစ်ရမယ်"})
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

    const avatarName = getMyanmarInitials(adminName)
    const profilePhoto = `https://ui-avatars.com/api/?name=${avatarName}&background=random`
    
    const newAdmin = new Admin({
      adminName,
      adminPassword,
      profilePhoto,
      phoneNo,
      section,
      position
    });

    await newAdmin.save();
    const adminObj = newAdmin.toObject();
    delete adminObj.adminPassword;

    res.status(201).json(adminObj);
  } catch (error) {
    console.error("Create Admin Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get all admins
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    console.error("Get Admins Error:", error);
    res.status(500).json({ message: "ဆာဗာ အခက်အခဲ ဖြစ်ပွားနေပါသည်။" });
  }
};

// Get one admin by ID
export const getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.status(200).json(admin);
  } catch (error) {
    console.error("Get Admin Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Update admin
export const updateAdmin = async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    }).select("-adminPassword");
    if (!updatedAdmin) return res.status(404).json({ message: "Admin not found" });

    res.status(200).json(updatedAdmin);
  } catch (error) {
    console.error("Update Admin Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Delete admin
export const deleteAdmin = async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) return res.status(404).json({ message: "Admin not found" });

    res.status(200).json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Delete Admin Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};


export const loginAdmin = async (req, res) => {
  try {
    const { adminName, adminPassword, position } = req.body;

    if (!adminName || !adminPassword || !position) {
      return res.status(400).json({ message: "အချက်အလက်များအားလုံး ဖြည့်ရန် လိုအပ်ပါသည်။" });
    }

    const admin = await Admin.findOne({ adminName, adminPassword, position });
    if (!admin) {
      return res.status(404).json({ message: "အချက်အလက်မှားနေပါသည်" });
    }

    generateAdminTokenAndCookie(admin._id, res);

    res.status(200).json({
      _id: admin._id,
      adminName: admin.adminName,
      section: admin.section,
      phoneNo: admin.phoneNo,
      position: admin.position,
      profilePhoto: admin.profilePhoto
    });
  } catch (error) {
    console.error("Login Admin Error:", error);
    res.status(500).json({ message: "ဆာဗာအတွင်း အမှားရှိနေသည်။" });
  }
};


export const logoutAdmin = async (req, res) => {
  try {
    res.clearCookie("admintoken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // use HTTPS in production
      sameSite: "strict",
    });

    res.status(200).json({ message: "ထွက်ခွာခြင်း အောင်မြင်ပါသည်။" });
  } catch (error) {
    console.error("Logout Error:", error.message);
    res.status(500).json({ message: "ထွက်ခွာမှု မအောင်မြင်ပါ။" });
  }
};
