import express from "express";
import requireUser from "#middleware/requireUser";
import { getProductById } from "#db/queries/products";
import { addProductToOrder } from "#db/queries/orders_products";
import {
  createOrder,
  getOrdersByUser,
  getOrderById,
  getProductsByOrderId,
} from "#db/queries/orders";

const router = express.Router();

export default router;

router.post("/", requireUser, async (req, res, next) => {
  try {
    const { date, note } = req.body;
    if (!date) {
      return res.status(400).send("Date is required");
    }

    const order = await createOrder(date, note || null, req.user.id);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

router.get("/", requireUser, async (req, res, next) => {
  try {
    const orders = await getOrdersByUser(req.user.id);
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", requireUser, async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) {
      return res.status(404).send("Order not found");
    }
    if (order.user_id !== req.user.id) {
      return res.status(403).send("Forbidden");
    }
    res.json(order);
  } catch (err) {
    next(err);
  }
});

router.post("/:id/products", requireUser, async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) {
      return res.status(404).send("Order not found");
    }
    if (order.user_id !== req.user.id) {
      return res.status(403).send("Forbidden");
    }

    const { productId, quantity } = req.body;
    if (!productId || !quantity) {
      return res.status(400).send("productId and quantity are required");
    }

    const product = await getProductById(productId);
    if (!product) {
      return res.status(400).send("Product does not exist");
    }

    const orderProduct = await addProductToOrder(order.id, productId, quantity);
    res.status(201).json(orderProduct);
  } catch (err) {
    next(err);
  }
});

router.get("/:id/products", requireUser, async (req, res, next) => {
  try {
    const order = await getOrderById(req.params.id);
    if (!order) {
      return res.status(404).send("Order not found");
    }
    if (order.user_id !== req.user.id) {
      return res.status(403).send("Forbidden");
    }

    const products = await getProductsByOrderId(order.id);
    res.json(products);
  } catch (err) {
    next(err);
  }
});
