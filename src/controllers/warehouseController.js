const Warehouse = require("../models/Warehouse");

// @desc    Get all warehouses
// @route   GET /api/warehouses
// @access  Private
exports.getWarehouses = async (req, res) => {
  try {
    const { type, isActive } = req.query;
    const query = {};

    if (type) query.type = type;
    if (isActive !== undefined) query.isActive = isActive === "true";

    const warehouses = await Warehouse.find(query).sort("-createdAt");

    res.json({
      success: true,
      count: warehouses.length,
      data: warehouses,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single warehouse
// @route   GET /api/warehouses/:id
// @access  Private
exports.getWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findById(req.params.id);

    if (!warehouse) {
      return res
        .status(404)
        .json({ success: false, message: "Warehouse not found" });
    }

    res.json({ success: true, data: warehouse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new warehouse
// @route   POST /api/warehouses
// @access  Private (Admin, Manager)
exports.createWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.create(req.body);

    res.status(201).json({
      success: true,
      data: warehouse,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update warehouse
// @route   PUT /api/warehouses/:id
// @access  Private (Admin, Manager)
exports.updateWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!warehouse) {
      return res
        .status(404)
        .json({ success: false, message: "Warehouse not found" });
    }

    res.json({ success: true, data: warehouse });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete warehouse
// @route   DELETE /api/warehouses/:id
// @access  Private (Admin)
exports.deleteWarehouse = async (req, res) => {
  try {
    const warehouse = await Warehouse.findByIdAndDelete(req.params.id);

    if (!warehouse) {
      return res
        .status(404)
        .json({ success: false, message: "Warehouse not found" });
    }

    res.json({ success: true, message: "Warehouse deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
