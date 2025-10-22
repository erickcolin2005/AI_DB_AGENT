import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const categories = ['Cuidado personal', 'Belleza', 'Hogar'];

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function main() {
  await prisma.product.createMany({
    data: Array.from({ length: 20 }).map((_, i) => ({
      sku: `SKU-${1000 + i}`,
      name: `Producto ${i + 1}`,
      category: rand(categories),
      price: (Math.floor(Math.random() * 4000) + 1000) / 100,
    }))
  });

  const start = new Date('2024-01-01');

  for (let m = 0; m < 12; m++) {
    for (let d = 0; d < 50; d++) {
      const date = new Date(start.getFullYear(), m, Math.floor(Math.random() * 28) + 1);
      const order = await prisma.order.create({ data: { orderDate: date, customer: `Cliente ${m}-${d}` } });
      const itemCount = Math.floor(Math.random() * 4) + 1;
      for (let k = 0; k < itemCount; k++) {
        const productId = Math.floor(Math.random() * 20) + 1;
        const unitPrice = Number((Math.random() * 30 + 5).toFixed(2));
        const quantity = Math.floor(Math.random() * 5) + 1;
        await prisma.orderItem.create({
          data: { orderId: order.id, productId, quantity, unitPrice }
        });
      }
    }
  }

  console.log('Seed completed');
}

main().finally(() => prisma.$disconnect());
