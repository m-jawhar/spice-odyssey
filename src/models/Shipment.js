const mongoose = require("mongoose");

const shipmentSchema = new mongoose.Schema({
  trackingNumber: {
    type: String,
    required: [true, "Tracking number is required"],
    unique: true,
    uppercase: true,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: [true, "Order reference is required"],
  },
  carrier: {
    name: {
      type: String,
      required: [true, "Carrier name is required"],
    },
    contact: String,
    service: {
      type: String,
      enum: ["standard", "express", "overnight", "international"],
      default: "standard",
    },
  },
  origin: {
    address: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
  },
  destination: {
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    zipCode: { type: String, required: true },
  },
  status: {
    type: String,
    enum: [
      "preparing",
      "picked-up",
      "in-transit",
      "out-for-delivery",
      "delivered",
      "delayed",
      "cancelled",
    ],
    default: "preparing",
  },
  estimatedDelivery: {
    type: Date,
    required: [true, "Estimated delivery date is required"],
  },
  actualDelivery: Date,
  weight: {
    value: Number,
    unit: {
      type: String,
      enum: ["kg", "lb"],
      default: "kg",
    },
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
    unit: {
      type: String,
      enum: ["cm", "in"],
      default: "cm",
    },
  },
  shippingCost: {
    type: Number,
    default: 0,
  },
  trackingHistory: [
    {
      status: String,
      location: String,
      timestamp: {
        type: Date,
        default: Date.now,
      },
      notes: String,
    },
  ],
  notes: String,
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

shipmentSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Generate tracking number if not provided
shipmentSchema.pre("save", async function (next) {
  if (!this.trackingNumber) {
    const count = await this.constructor.countDocuments();
    this.trackingNumber = `SH-${Date.now()}-${String(count + 1).padStart(
      6,
      "0"
    )}`;
  }
  next();
});

module.exports = mongoose.model("Shipment", shipmentSchema);
