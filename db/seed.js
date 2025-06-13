import db from "#db/client";

import { createUser } from "#db/queries/users";
import { createProduct } from "#db/queries/products";
import { createOrder } from "#db/queries/orders";
import { addProductToOrder } from "#db/queries/orders_products";

await db.connect();
await seed();
await db.end();
console.log("🌱 Database seeded.");

async function seed() {
  // TODO

  const user = await createUser("christian", "password");

  const productIds = [];
  for (let i = 1; i <= 10; i++) {
    const product = await createProduct(
      `Title ${i}`,
      `Description ${i}`,
      (i * 4.5).toFixed(2)
    );
    productIds.push(product.id);
  }

  const order = await createOrder(new Date(), "Test order", user.id);

  for (let i = 0; i < 5; i++) {
    await addProductToOrder(order.id, productIds[i], i + 1);
  }
}
