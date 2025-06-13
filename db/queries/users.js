import db from "#db/client";
import { hashPassword, comparePassword } from "#utils/hash";

export async function createUser(username, password) {
  const hashedPassword = await hashPassword(password);
  const sql = `
    INSERT INTO users
    (username, password)
    VALUES
    ($1, $2)
    RETURNING *
    `;
  const {
    rows: [user],
  } = await db.query(sql, [username, hashedPassword]);
  return user;
}

export async function getAllUsers() {
  const sql = `
    SELECT * 
    FROM users`;
  const { rows: users } = await db.query(sql);
  return users;
}

export async function getUserByUsernameAndPassword(username, password) {
  const sql = `
  SELECT *
  FROM users
  WHERE username = $1`;
  const {
    rows: [user],
  } = await db.query(sql, [username]);

  if (!user) return null;

  const isValid = await comparePassword(password, user.password);
  if (!isValid) return null;

  return user;
}

export async function getUserById(id) {
  const sql = `
  SELECT *
  FROM users
  WHERE id = $1
  `;
  const {
    rows: [user],
  } = await db.query(sql, [id]);
  return user;
}

export async function getOrdersByUserAndProduct(userId, productId) {
  const sql = `
    SELECT orders.*
    FROM orders
    JOIN order_items ON orders.id = order_items.order_id
    WHERE orders.user_id = $1 AND order_items.product_id = $2
  `;
  const { rows: orders } = await db.query(sql, [userId, productId]);
  return orders;
}
