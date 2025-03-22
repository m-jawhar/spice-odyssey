const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
    trim: true,
  },
  sku: {
    type: String,
    required: [true, "SKU is required"],
    unique: true,
    uppercase: true,
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ["spices", "herbs", "seasonings", "blends", "extracts", "other"],
    default: "other",
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
    required: [true, "Supplier is required"],
  },
  unit: {
    type: String,
    enum: ["kg", "g", "lb", "oz", "l", "ml", "piece"],
    default: "kg",
  },
  unitPrice: {
    type: Number,
    required: [true, "Unit price is required"],
    min: 0,
  },
  currency: {
    type: String,
    default: "USD",
    uppercase: true,
  },
  reorderLevel: {
    type: Number,
    default: 10,
    min: 0,
  },
  reorderQuantity: {
    type: Number,
    default: 50,
    min: 0,
  },
  leadTime: {
    type: Number,
    default: 7,
    comment: "Lead time in days",
  },
  specifications: {
    origin: String,
    color: String,
    grade: String,
    moisture: String,
    purity: String,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

productSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Index for faster searches
productSchema.index({ name: "text", sku: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);
