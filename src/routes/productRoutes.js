const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { auth, authorize } = require("../middleware/auth");

router.use(auth);

router
  .route("/")
  .get(getProducts)
  .post(authorize("admin", "manager"), createProduct);

router
  .route("/:id")
  .get(getProduct)
  .put(authorize("admin", "manager"), updateProduct)
  .delete(authorize("admin"), deleteProduct);

module.exports = router;
