const express = require("express");
const router = express.Router();
const {
  getWarehouses,
  getWarehouse,
  createWarehouse,
  updateWarehouse,
  deleteWarehouse,
} = require("../controllers/warehouseController");
const { auth, authorize } = require("../middleware/auth");

router.use(auth);

router
  .route("/")
  .get(getWarehouses)
  .post(authorize("admin", "manager"), createWarehouse);

router
  .route("/:id")
  .get(getWarehouse)
  .put(authorize("admin", "manager"), updateWarehouse)
  .delete(authorize("admin"), deleteWarehouse);

module.exports = router;
