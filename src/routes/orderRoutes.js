const express = require("express");
const router = express.Router();
const {
  getOrders,
  getOrder,
  createOrder,
  updateOrder,
  deleteOrder,
} = require("../controllers/orderController");
const { auth, authorize } = require("../middleware/auth");

router.use(auth);

router
  .route("/")
  .get(getOrders)
  .post(authorize("admin", "manager", "staff"), createOrder);

router
  .route("/:id")
  .get(getOrder)
  .put(authorize("admin", "manager"), updateOrder)
  .delete(authorize("admin"), deleteOrder);

module.exports = router;
