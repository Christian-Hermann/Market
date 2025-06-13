import db from "#db/client";

export async function createOrder(date, note, userId) {
  const sql = `
    INSERT INTO orders
    (date, note, user_id)
    VALUES 
    ($1, $2, $3)
    RETURNING *
    `;
  const {
    rows: [orders],
  } = await db.query(sql, [date, note, userId]);
  return orders;
}

export async function getOrderById(orderId) {
  const sql = `
    SELECT *
    FROM orders
    WHERE id = $1
  `;
  const {
    rows: [order],
  } = await db.query(sql, [orderId]);
  return order;
}

export async function getOrdersByUser(userId) {
  const sql = `
      SELECT *
      FROM orders
      WHERE user_id = $1
      `;
  const { rows: orders } = await db.query(sql, [userId]);
  return orders;
}

export async function getOrdersByUserAndProduct(userId, productId) {
  const sql = `
    SELECT o.*
    FROM orders o
    JOIN orders_products op ON o.id = op.order_id
    WHERE o.user_id = $1 AND op.product_id = $2
  `;
  const { rows: orders } = await db.query(sql, [userId, productId]);
  return orders;
}

export async function addProductToOrder(orderId, productId, quantity) {
  const sql = `
    INSERT INTO order_products
    (order_id, product_id, quantity)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const {
    rows: [orders_products],
  } = await db.query(sql, [orderId, productId, quantity]);
  return orders_products;
}

export async function getProductsByOrderId(orderId) {
  const sql = `
    SELECT p.*, op.quantity
    FROM products p
    JOIN orders_products op ON p.id = op.product_id
    WHERE op.order_id = $1
  `;
  const { rows: products } = await db.query(sql, [orderId]);
  return products;
}
