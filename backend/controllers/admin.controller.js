import Admin from '../models/admin.model.js';
// Create a new admin
export const createAdmin = async (req, res) => {
  try {
    const { adminName, adminPassword, phoneNo, division } = req.body;

    const profilePhoto = `https://avatar.iran.liara.run/username?username=${adminName}`
    
    const newAdmin = new Admin({
      adminName,
      adminPassword,
      profilePhoto,
      phoneNo,
      division,
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
