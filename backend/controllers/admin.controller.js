import Admin from '../models/admin.model.js';
// Create a new admin
export const createAdmin = async (req, res) => {
  try {
    const { adminName, password, phoneNo, department, adminSignaturePhoto } = req.body;

    const profilePhoto = `https://avatar.iran.liara.run/username?username=${adminName}`
    
    const newAdmin = new Admin({
      adminName,
      password,
      profilePhoto,
      phoneNo,
      department,
      adminSignaturePhoto
    });

    await newAdmin.save();
    res.status(201).json(newAdmin);
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
    });
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
