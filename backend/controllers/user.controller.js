import User from "../models/user.model.js";
import Shop from "../models/shop.model.js";

// Create a new user
export const createUser = async (req, res) => {
  try {
    const {
      username, password, confirmPassword, NRC,
      phoneNo, gender
    } = req.body;

    // const shop = await Shop.findById(shopId);
    // if (!shop) {
    //   return res.status(404).json({ message: "Shop not found" });
    // }
    if (
      !username?.trim() || !password?.trim() || !confirmPassword?.trim() ||
      !NRC?.trim() || !phoneNo?.trim() || !gender?.trim()
    ) {
      return res.status(400).json({ message: "Fill all required fields" });
    }
    

    if(password.trim() != confirmPassword.trim()){
      return res.status(400).json({message: "Check your password again"})
    }

    const profilePhoto = `https://avatar.iran.liara.run/username?username=${username}`
    
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
    delete userObj.password

    res.status(201).json(userObj);

  } catch (error) {
    console.error("Create User Error:", error);

    // duplicate key error
    if (error.code == 11000) {
      return res.status(409).json({ message: "NRC already registered." });
    }

    res.status(500).json({ message: "Server Error" });
  }
};

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).json(users);
  } catch (error) {
    console.error("Get Users Error:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get one user by ID
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (error) {
    console.error("Get User Error:", error);
    res.status(500).json({ message: "Server Error" });
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
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const userObj = user.toObject();
    delete userObj.password;

    res.status(200).json(userObj);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
