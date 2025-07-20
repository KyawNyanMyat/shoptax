import multer from "multer";
import path from "path";

// Configure storage location and filename
//Development
// const storage = multer({
//     storage: multer.memoryStorage(),
//     destination: function (req, file, cb) {
//         cb(null, path.join(path.resolve(),"backend", "uploads")); // You must create this folder
//     },
//     filename: function (req, file, cb) {
//         const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
//         cb(null, uniqueSuffix + path.extname(file.originalname)); // e.g., 12345678.png
//     },
// });

// const upload = multer({ storage });

// export default upload;


//Production

const upload = multer({
    storage: multer.memoryStorage(), // Only this is needed
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB limit (recommended)
    }
  });
  
  export default upload;
