import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const defaultCurrencies = ['VNĐ', '$'];

async function main() {
  const existedCurrencies = await prisma.currency.findMany({
    where: {
      name: {
        in: defaultCurrencies,
      },
    },
  });
  const seedCurrencies = defaultCurrencies.filter(
    (item) => !existedCurrencies.map((item) => item.name).includes(item),
  );
  if (seedCurrencies.length) {
    await prisma.currency.createMany({
      data: seedCurrencies.map((item) => ({ name: item })),
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
