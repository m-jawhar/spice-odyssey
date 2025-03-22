const Order = require("../models/Order");
const Inventory = require("../models/Inventory");

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
exports.getOrders = async (req, res) => {
  try {
    const { type, status, supplier, warehouse } = req.query;
    const query = {};

    if (type) query.type = type;
    if (status) query.status = status;
    if (supplier) query.supplier = supplier;
    if (warehouse) query.warehouse = warehouse;

    const orders = await Order.find(query)
      .populate("supplier", "name code")
      .populate("warehouse", "name code")
      .populate("items.product", "name sku")
      .populate("createdBy", "username")
      .sort("-createdAt");

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("supplier")
      .populate("warehouse")
      .populate("items.product")
      .populate("createdBy", "username email")
      .populate("approvedBy", "username email");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Admin, Manager, Staff)
exports.createOrder = async (req, res) => {
  try {
    // Calculate item totals
    if (req.body.items) {
      req.body.items = req.body.items.map((item) => ({
        ...item,
        totalPrice: item.quantity * item.unitPrice,
      }));
    }

    req.body.createdBy = req.user.id;
    const order = await Order.create(req.body);

    await order.populate("supplier", "name code");
    await order.populate("warehouse", "name code");
    await order.populate("items.product", "name sku");

    res.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private (Admin, Manager)
exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate("supplier", "name code")
      .populate("warehouse", "name code")
      .populate("items.product", "name sku");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // If order is delivered, update inventory
    if (req.body.status === "delivered" && order.type === "purchase") {
      for (const item of order.items) {
        await Inventory.findOneAndUpdate(
          { product: item.product._id, warehouse: order.warehouse },
          { $inc: { quantity: item.quantity } },
          { upsert: true }
        );
      }
    }

    res.json({ success: true, data: order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private (Admin)
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.status !== "draft" && order.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "Cannot delete orders that are being processed or completed",
      });
    }

    await order.deleteOne();

    res.json({ success: true, message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
