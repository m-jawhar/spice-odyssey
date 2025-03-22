const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Supplier name is required"],
    trim: true,
    unique: true,
  },
  code: {
    type: String,
    required: [true, "Supplier code is required"],
    unique: true,
    uppercase: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    trim: true,
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
  },
  contactPerson: {
    name: String,
    phone: String,
    email: String,
    position: String,
  },
  category: {
    type: String,
    enum: ["raw-materials", "packaging", "equipment", "services", "other"],
    default: "other",
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    default: 3,
  },
  paymentTerms: {
    type: String,
    enum: ["net-15", "net-30", "net-45", "net-60", "immediate"],
    default: "net-30",
  },
  isActive: {
    type: Boolean,
    default: true,
  },
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

// Update timestamp on save
supplierSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Supplier", supplierSchema);
