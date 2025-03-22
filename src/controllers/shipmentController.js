const Shipment = require("../models/Shipment");
const Order = require("../models/Order");

// @desc    Get all shipments
// @route   GET /api/shipments
// @access  Private
exports.getShipments = async (req, res) => {
  try {
    const { status, carrier } = req.query;
    const query = {};

    if (status) query.status = status;
    if (carrier) query["carrier.name"] = carrier;

    const shipments = await Shipment.find(query)
      .populate({
        path: "order",
        populate: {
          path: "warehouse",
          select: "name code",
        },
      })
      .populate("createdBy", "username")
      .sort("-createdAt");

    res.json({
      success: true,
      count: shipments.length,
      data: shipments,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single shipment
// @route   GET /api/shipments/:id
// @access  Private
exports.getShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id)
      .populate({
        path: "order",
        populate: [
          { path: "warehouse", select: "name code address" },
          { path: "supplier", select: "name code" },
          { path: "items.product", select: "name sku" },
        ],
      })
      .populate("createdBy", "username email");

    if (!shipment) {
      return res
        .status(404)
        .json({ success: false, message: "Shipment not found" });
    }

    res.json({ success: true, data: shipment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new shipment
// @route   POST /api/shipments
// @access  Private (Admin, Manager, Staff)
exports.createShipment = async (req, res) => {
  try {
    // Verify order exists
    const order = await Order.findById(req.body.order);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (order.status !== "confirmed" && order.status !== "processing") {
      return res.status(400).json({
        success: false,
        message: "Can only create shipments for confirmed or processing orders",
      });
    }

    req.body.createdBy = req.user.id;
    const shipment = await Shipment.create(req.body);

    // Update order status to shipped
    order.status = "shipped";
    await order.save();

    await shipment.populate("order", "orderNumber type");

    res.status(201).json({
      success: true,
      data: shipment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update shipment
// @route   PUT /api/shipments/:id
// @access  Private (Admin, Manager, Staff)
exports.updateShipment = async (req, res) => {
  try {
    const shipment = await Shipment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    }).populate("order", "orderNumber type");

    if (!shipment) {
      return res
        .status(404)
        .json({ success: false, message: "Shipment not found" });
    }

    // If shipment is delivered, update order status
    if (req.body.status === "delivered") {
      await Order.findByIdAndUpdate(shipment.order._id, {
        status: "delivered",
        actualDeliveryDate: req.body.actualDelivery || Date.now(),
      });
    }

    res.json({ success: true, data: shipment });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Add tracking update
// @route   POST /api/shipments/:id/tracking
// @access  Private (Admin, Manager, Staff)
exports.addTrackingUpdate = async (req, res) => {
  try {
    const shipment = await Shipment.findById(req.params.id);

    if (!shipment) {
      return res
        .status(404)
        .json({ success: false, message: "Shipment not found" });
    }

    shipment.trackingHistory.push({
      status: req.body.status,
      location: req.body.location,
      notes: req.body.notes,
      timestamp: req.body.timestamp || Date.now(),
    });

    await shipment.save();

    res.json({
      success: true,
      data: shipment,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
