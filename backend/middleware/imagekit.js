// utils/imageKit.js
import dotenv from "dotenv"
dotenv.config()

import ImageKit from "imagekit";

const imagekit = new ImageKit({
    publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint : process.env.IMAGE_CDN_URL
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