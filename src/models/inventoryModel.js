import mongoose from "mongoose";
import multer from "multer";
import path from "path";

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
      trim: true,
    },
    quantity: {
      type: Number,
      require: true,
    },
    category: {
      type: String,
      require: true,
      trim: true,
    },
    supplierName: {
      type: String,
      require: true,
      trim: true,
    },
    contactNumber: {
      type: String,
      require: true,
      trim: true,
    },
  },
  { timestamps: true }
);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.resolve(process.cwd(), "public/uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// CSV File Filter
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname);
  if (ext !== ".csv") {
    return cb(new Error("Only CSV files are allowed!"), false);
  }
  cb(null, true);
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single("csvFile");

const inventoryModel = mongoose.model("Inventory", inventorySchema);
export default inventoryModel;
