const express = require("express");
const router = express.Router();
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const auth = require("../middleware/auth");

router.post("/", auth(["admin"]), createProduct);
router.get("/", getProducts);
router.get("/:id", auth(["admin"]), getProductById);
router.put("/:id", auth(["admin"]), updateProduct);
router.delete("/:id", auth(["admin"]), deleteProduct);

module.exports = router;
