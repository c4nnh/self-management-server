import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const defaultCurrencies: Prisma.CurrencyCreateManyInput[] = [
  {
    name: 'Việt Nam Đồng',
    symbol: 'VNĐ',
  },
  {
    name: 'Dollar',
    symbol: '$',
  },
  {
    name: 'Euro',
    symbol: '€',
  },
  {
    name: 'Pound',
    symbol: '£',
  },
];

async function main() {
  const existedCurrencies = await prisma.currency.findMany({
    where: {
      OR: [
        {
          name: {
            in: defaultCurrencies.map((item) => item.name),
            mode: 'insensitive',
          },
        },
        {
          symbol: {
            in: defaultCurrencies.map((item) => item.symbol),
            mode: 'insensitive',
          },
        },
      ],
    },
  });
  const seedCurrencies = defaultCurrencies.filter(
    (item) =>
      !existedCurrencies.filter(
        (el) => el.name === item.name || el.symbol === item.symbol,
      ).length,
  );
  if (seedCurrencies.length) {
    await prisma.currency.createMany({
      data: seedCurrencies,
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
