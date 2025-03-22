const mongoose = require("mongoose");

const warehouseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Warehouse name is required"],
    trim: true,
    unique: true,
  },
  code: {
    type: String,
    required: [true, "Warehouse code is required"],
    unique: true,
    uppercase: true,
  },
  type: {
    type: String,
    enum: ["main", "regional", "distribution", "cold-storage"],
    default: "regional",
  },
  address: {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
  capacity: {
    type: Number,
    required: [true, "Capacity is required"],
    min: 0,
    comment: "Total capacity in cubic meters",
  },
  manager: {
    name: String,
    phone: String,
    email: String,
  },
  operatingHours: {
    openTime: String,
    closeTime: String,
    workingDays: [String],
  },
  isActive: {
    type: Boolean,
    default: true,
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

warehouseSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Warehouse", warehouseSchema);
