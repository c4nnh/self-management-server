import { Prisma, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const defaultCurrencies: Prisma.CurrencyCreateManyInput[] = [
  {
    name: 'Việt Nam Đồng',
    symbol: '₫',
    code: 'VND',
  },
  {
    name: 'Dollar',
    symbol: '$',
    code: 'USD',
  },
  {
    name: 'Euro',
    symbol: '€',
    code: 'EUR',
  },
  {
    name: 'Pound',
    symbol: '£',
    code: 'GBP',
  },
];

async function main() {
  const existedCurrencies = await prisma.currency.findMany({
    where: {
      code: {
        in: defaultCurrencies.map((item) => item.code),
        mode: 'insensitive',
      },
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
      data: seedCurrencies.map((item) => ({
        ...item,
        code: item.code.toUpperCase(),
      })),
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
