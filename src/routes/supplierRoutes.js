const express = require("express");
const router = express.Router();
const {
  getSuppliers,
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} = require("../controllers/supplierController");
const { auth, authorize } = require("../middleware/auth");

// All routes require authentication
router.use(auth);

router
  .route("/")
  .get(getSuppliers)
  .post(authorize("admin", "manager"), createSupplier);

router
  .route("/:id")
  .get(getSupplier)
  .put(authorize("admin", "manager"), updateSupplier)
  .delete(authorize("admin"), deleteSupplier);

module.exports = router;
