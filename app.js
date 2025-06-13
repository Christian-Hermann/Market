import dotenv from "dotenv";
dotenv.config();

import express from "express";
const app = express();
export default app;

app.use(express.json());

import getUserFromToken from "#middleware/getUserFromToken";
app.use(getUserFromToken);

import usersRouter from "#api/users";
app.use("/users", usersRouter);

import productsRouter from "#api/products";
app.use("/products", productsRouter);

import ordersRouter from "#api/orders";
app.use("/orders", ordersRouter);

app.use((err, req, res, next) => {
  switch (err.code) {
    case "22P02":
      return res.status(400).send(err.message);
    case "23505":
    case "23503":
      return res.status(400).send(err.detail);
    default:
      next(err);
  }
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
