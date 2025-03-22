const express = require("express");
const router = express.Router();
const {
  getShipments,
  getShipment,
  createShipment,
  updateShipment,
  addTrackingUpdate,
} = require("../controllers/shipmentController");
const { auth, authorize } = require("../middleware/auth");

router.use(auth);

router
  .route("/")
  .get(getShipments)
  .post(authorize("admin", "manager", "staff"), createShipment);

router
  .route("/:id")
  .get(getShipment)
  .put(authorize("admin", "manager", "staff"), updateShipment);

router.post(
  "/:id/tracking",
  authorize("admin", "manager", "staff"),
  addTrackingUpdate
);

module.exports = router;
