// utils/imageKit.js
import ImageKit from "imagekit";

const imagekit = new ImageKit({
    publicKey : "public_TfAXw4Ya7g0VpBmb0bxaun5cMeg=",
    privateKey : "private_ymnx73+VPOmxY1EHqeZKQ/sqRgI=",
    urlEndpoint : "https://ik.imagekit.io/see06p2fm"
});

// utils/imageKit.js
export const uploadImageToImageKit = async (file) => {
    try {
      if (!file || !file.buffer) {
        throw new Error("Invalid file object");
      }
  
      const result = await imagekit.upload({
        file: file.buffer.toString('base64'),
        fileName: `${Date.now()}-${file.originalname}`,
        folder: "/payment-photos/",
        useUniqueFileName: true // Ensure unique filenames
      });
  
      if (!result.url) {
        throw new Error("ImageKit upload failed - no URL returned");
      }
  
      return result.url;
    } catch (error) {
      console.error("ImageKit upload error:", error);
      throw new Error("Failed to upload payment photo");
    }
};