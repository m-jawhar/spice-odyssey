const express = require("express");
const router = express.Router();
const {
  getInventory,
  getInventoryById,
  getLowStock,
  adjustInventory,
} = require("../controllers/inventoryController");
const { auth, authorize } = require("../middleware/auth");

router.use(auth);

router.get("/", getInventory);
router.get("/low-stock", getLowStock);
router.post("/adjust", authorize("admin", "manager", "staff"), adjustInventory);
router.get("/:id", getInventoryById);

module.exports = router;
