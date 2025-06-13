import express from "express";
import { getAllProducts, getProductById } from "#db/queries/products";
import { getOrdersByUserAndProduct } from "#db/queries/orders";
import requireUser from "#middleware/requireUser";

const router = express.Router();
export default router;

// Public routes - no requireUser needed here
router.get("/", async (req, res, next) => {
  try {
    const products = await getAllProducts();
    res.send(products);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found.");
    }
    res.send(product);
  } catch (err) {
    next(err);
  }
});

// Protected route: user must be logged in to see orders for a product
router.get("/:id/orders", requireUser, async (req, res, next) => {
  try {
    const product = await getProductById(req.params.id);
    if (!product) {
      return res.status(404).send("Product not found.");
    }

    // Now req.user is guaranteed to exist because of requireUser middleware
    const orders = await getOrdersByUserAndProduct(req.user.id, req.params.id);
    res.send(orders);
  } catch (err) {
    next(err);
  }
});
