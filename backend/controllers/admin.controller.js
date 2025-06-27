import Admin from '../models/admin.model.js';
import myanmarToEnglishInitial from '../utils/myanmarInitialMap.js';
// Create a new admin
export const createAdmin = async (req, res) => {
  try {
    const { adminName, adminPassword, phoneNo, division, position } = req.body;
    if (
      !adminName?.trim() || !adminPassword?.trim() || !division?.trim() ||
      !position?.trim() || !phoneNo?.trim()
    ) {
      return res.status(400).json({ message: "အချက်လက် အကုန်ဖြည့်ပါ" });
    }

    if(!/^[\u1000-\u109F\uAA60-\uAA7F\u102B-\u103E\u1039-\u103A\s၊။]+$/.test(adminName)) {
      return res.status(400).json({ message: "နာမည်သည် မြန်မာလိုပဲဖြစ်ရမယ်"})
    }

    if (!/^၀၉\-([၀-၉]{7}|[၀-၉]{9})$/.test(phoneNo)) {
      return res.status(400).json({  message: "ဖုန်းနံပါတ်သည် 09- နဲ့စပြီး ၇ သို့မဟုတ် ၉ လုံးရပါမည်။" });
    }


    if(!/^[\u1000-\u109F\uAA60-\uAA7F\u102B-\u103E\u1039-\u103A\s၊။]+$/.test(division)) {
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
      division,
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
    res.status(500).json({ message: "Server Error" });
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
    const { adminName, adminPassword, division } = req.body;

    // Check for required fields
    if (!adminName || !adminPassword || !division) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find admin
    const admin = await Admin.findOne({ adminName, adminPassword, division });
    if (!admin) {
      return res.status(404).json({ message: "Admin not found or invalid division" });
    }

    // Success response
    res.status(200).json({
      message: "Login successful",
      admin: {
        _id: admin._id,
        adminName: admin.adminName,
        division: admin.division,
        phoneNo: admin.phoneNo,
        profilePhoto: admin.profilePhoto
      },
    });
  } catch (error) {
    console.error("Login Admin Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
