const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product is required"],
  },
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: [true, "Warehouse is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Quantity is required"],
    min: 0,
    default: 0,
  },
  reservedQuantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  availableQuantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  lastRestocked: {
    type: Date,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  location: {
    aisle: String,
    rack: String,
    shelf: String,
    bin: String,
  },
  batchNumber: String,
  expiryDate: Date,
  status: {
    type: String,
    enum: ["in-stock", "low-stock", "out-of-stock", "discontinued"],
    default: "in-stock",
  },
});

// Compound index for unique product-warehouse combination
inventorySchema.index({ product: 1, warehouse: 1 }, { unique: true });

// Calculate available quantity before saving
inventorySchema.pre("save", function (next) {
  this.availableQuantity = this.quantity - this.reservedQuantity;
  this.lastUpdated = Date.now();

  // Update status based on quantity
  if (this.quantity === 0) {
    this.status = "out-of-stock";
  } else {
    this.status = "in-stock";
  }

  next();
});

// Virtual for checking if stock is low
inventorySchema.virtual("isLowStock").get(function () {
  return (
    this.populated("product") && this.quantity <= this.product.reorderLevel
  );
});

module.exports = mongoose.model("Inventory", inventorySchema);
