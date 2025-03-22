const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: [true, "Order number is required"],
    unique: true,
    uppercase: true,
  },
  type: {
    type: String,
    enum: ["purchase", "sales", "transfer"],
    required: [true, "Order type is required"],
  },
  supplier: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Supplier",
  },
  warehouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Warehouse",
    required: [true, "Warehouse is required"],
  },
  items: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      unitPrice: {
        type: Number,
        required: true,
        min: 0,
      },
      totalPrice: {
        type: Number,
        required: true,
      },
    },
  ],
  totalAmount: {
    type: Number,
    required: true,
    default: 0,
  },
  currency: {
    type: String,
    default: "USD",
    uppercase: true,
  },
  status: {
    type: String,
    enum: [
      "draft",
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ],
    default: "draft",
  },
  priority: {
    type: String,
    enum: ["low", "normal", "high", "urgent"],
    default: "normal",
  },
  expectedDeliveryDate: Date,
  actualDeliveryDate: Date,
  notes: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  approvedBy: {
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

// Calculate total amount before saving
orderSchema.pre("save", function (next) {
  if (this.items && this.items.length > 0) {
    this.totalAmount = this.items.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );
  }
  this.updatedAt = Date.now();
  next();
});

// Generate order number if not provided
orderSchema.pre("save", async function (next) {
  if (!this.orderNumber) {
    const prefix =
      this.type === "purchase" ? "PO" : this.type === "sales" ? "SO" : "TO";
    const count = await this.constructor.countDocuments();
    this.orderNumber = `${prefix}-${Date.now()}-${String(count + 1).padStart(
      5,
      "0"
    )}`;
  }
  next();
});

module.exports = mongoose.model("Order", orderSchema);
