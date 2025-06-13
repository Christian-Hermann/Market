import db from "#db/client";

export async function addProductToOrder(orderId, productId, quantity) {
  const sql = `
    INSERT INTO orders_products
    (order_id, product_id, quantity)
    VALUES ($1, $2, $3)
    RETURNING *
  `;
  const {
    rows: [orders_products],
  } = await db.query(sql, [orderId, productId, quantity]);
  return orders_products;
}

export async function getProductsForOrder(orderId) {
  const sql = `
    SELECT p.*, op.quantity
    FROM orders_products op
    JOIN products p ON op.product_id = p.id
    WHERE op.order_id = $1
    `;
  const { rows: products } = await db.query(sql, [orderId]);
  return products;
}

export { addProductToOrder, getProductsForOrder };
