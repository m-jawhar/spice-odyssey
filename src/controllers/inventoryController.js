const Inventory = require("../models/Inventory");
const Product = require("../models/Product");

// @desc    Get all inventory
// @route   GET /api/inventory
// @access  Private
exports.getInventory = async (req, res) => {
  try {
    const { warehouse, product, status } = req.query;
    const query = {};

    if (warehouse) query.warehouse = warehouse;
    if (product) query.product = product;
    if (status) query.status = status;

    const inventory = await Inventory.find(query)
      .populate("product", "name sku category reorderLevel")
      .populate("warehouse", "name code")
      .sort("-lastUpdated");

    res.json({
      success: true,
      count: inventory.length,
      data: inventory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get low stock items
// @route   GET /api/inventory/low-stock
// @access  Private
exports.getLowStock = async (req, res) => {
  try {
    const inventory = await Inventory.find()
      .populate("product", "name sku reorderLevel")
      .populate("warehouse", "name code");

    const lowStock = inventory.filter((item) => {
      return item.product && item.quantity <= item.product.reorderLevel;
    });

    res.json({
      success: true,
      count: lowStock.length,
      data: lowStock,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Adjust inventory
// @route   POST /api/inventory/adjust
// @access  Private (Admin, Manager, Staff)
exports.adjustInventory = async (req, res) => {
  try {
    const { product, warehouse, quantity, type, reason } = req.body;

    // Find existing inventory record
    let inventory = await Inventory.findOne({ product, warehouse });

    if (!inventory) {
      // Create new inventory record
      inventory = await Inventory.create({
        product,
        warehouse,
        quantity: type === "add" ? quantity : 0,
      });
    } else {
      // Update existing inventory
      if (type === "add") {
        inventory.quantity += quantity;
      } else if (type === "remove") {
        if (inventory.quantity < quantity) {
          return res.status(400).json({
            success: false,
            message: "Insufficient quantity in inventory",
          });
        }
        inventory.quantity -= quantity;
      } else if (type === "set") {
        inventory.quantity = quantity;
      }

      await inventory.save();
    }

    // Populate references
    await inventory.populate("product", "name sku");
    await inventory.populate("warehouse", "name code");

    res.json({
      success: true,
      message: "Inventory adjusted successfully",
      data: inventory,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get inventory by ID
// @route   GET /api/inventory/:id
// @access  Private
exports.getInventoryById = async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id)
      .populate("product")
      .populate("warehouse");

    if (!inventory) {
      return res
        .status(404)
        .json({ success: false, message: "Inventory record not found" });
    }

    res.json({ success: true, data: inventory });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
