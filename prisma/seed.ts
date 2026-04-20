import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const networks = await Promise.all([
    prisma.network.upsert({
      where: { slug: "ethereum" },
      update: {},
      create: { name: "Ethereum", slug: "ethereum" },
    }),
    prisma.network.upsert({
      where: { slug: "tron" },
      update: {},
      create: { name: "Tron", slug: "tron" },
    }),
    prisma.network.upsert({
      where: { slug: "polygon" },
      update: {},
      create: { name: "Polygon", slug: "polygon" },
    }),
    prisma.network.upsert({
      where: { slug: "bitcoin" },
      update: {},
      create: { name: "Bitcoin", slug: "bitcoin" },
    }),
  ]);

  const [ethereum, tron, polygon, bitcoin] = networks;

  const usdt = await prisma.token.upsert({
    where: { symbol: "USDT" },
    update: {},
    create: { symbol: "USDT", name: "Tether", displayOrder: 1 },
  });

  const usdc = await prisma.token.upsert({
    where: { symbol: "USDC" },
    update: {},
    create: { symbol: "USDC", name: "USD Coin", displayOrder: 2 },
  });

  const btc = await prisma.token.upsert({
    where: { symbol: "BTC" },
    update: {},
    create: { symbol: "BTC", name: "Bitcoin", displayOrder: 3 },
  });

  const tokenNetworks = [
    // USDT
    {
      tokenId: usdt.id,
      networkId: ethereum.id,
      depositAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      minDeposit: "1.00000000",
    },
    {
      tokenId: usdt.id,
      networkId: tron.id,
      depositAddress: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
      minDeposit: "1.00000000",
    },
    {
      tokenId: usdt.id,
      networkId: polygon.id,
      depositAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      minDeposit: "1.00000000",
    },
    // USDC
    {
      tokenId: usdc.id,
      networkId: ethereum.id,
      depositAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      minDeposit: "1.00000000",
    },
    {
      tokenId: usdc.id,
      networkId: polygon.id,
      depositAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
      minDeposit: "1.00000000",
    },
    // BTC
    {
      tokenId: btc.id,
      networkId: bitcoin.id,
      depositAddress: "0xadj9f8s9mfkjs9djmskdcmjjsd8778sdjfl3404fFD",
      minDeposit: "0.00000500",
    },
  ];

  for (const tn of tokenNetworks) {
    await prisma.tokenNetwork.upsert({
      where: {
        tokenId_networkId: { tokenId: tn.tokenId, networkId: tn.networkId },
      },
      update: {},
      create: tn,
    });
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
