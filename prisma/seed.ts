import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const NETWORKS = [
  { name: "Ethereum", slug: "ethereum" },
  { name: "Tron", slug: "tron" },
  { name: "Polygon", slug: "polygon" },
  { name: "Bitcoin", slug: "bitcoin" },
  { name: "BNB Smart Chain", slug: "binance" },
  { name: "Solana", slug: "solana" },
];

const TOKENS = [
  { symbol: "BTC", name: "Bitcoin", displayOrder: 1 },
  {
    symbol: "ETH",
    name: "Ethereum",
    displayOrder: 2,
    isUnderMaintenance: true,
  },
  { symbol: "USDT", name: "Tether", displayOrder: 3 },
  { symbol: "USDC", name: "USD Coin", displayOrder: 4 },
  { symbol: "BNB", name: "BNB", displayOrder: 5 },
  { symbol: "SOL", name: "Solana", displayOrder: 6 },
  { symbol: "XRP", name: "XRP", displayOrder: 7 },
  { symbol: "ADA", name: "Cardano", displayOrder: 8, isEnabled: false },
  { symbol: "TRX", name: "TRON", displayOrder: 10 },
  { symbol: "DOT", name: "Polkadot", displayOrder: 11 },
  { symbol: "MATIC", name: "Polygon", displayOrder: 13 },
  { symbol: "LINK", name: "Chainlink", displayOrder: 14 },
  {
    symbol: "SHIB",
    name: "Shiba Inu",
    displayOrder: 15,
    isUnderMaintenance: true,
  },
  { symbol: "UNI", name: "Uniswap", displayOrder: 16 },
  { symbol: "AVAX", name: "Avalanche", displayOrder: 17 },
  { symbol: "PEPE", name: "Pepe", displayOrder: 18 },
];

function getNetworkLogo(slug: string) {
  return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${slug}/info/logo.png`;
}

function getTokenLogo(symbol: string) {
  // Most main coins use their blockchain logo
  const mainCoins: Record<string, string> = {
    BTC: "bitcoin",
    ETH: "ethereum",
    BNB: "binance",
    SOL: "solana",
    XRP: "ripple",
    ADA: "cardano",
    TRX: "tron",
    DOT: "polkadot",
    MATIC: "polygon",
    AVAX: "avalanchec",
  };

  if (mainCoins[symbol]) {
    return getNetworkLogo(mainCoins[symbol]);
  }

  // Tokens on Ethereum (using common contract addresses for logos)
  const ethTokens: Record<string, string> = {
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    LINK: "0x514910771AF9Ca656af840dff83E8264EcF986CA",
    SHIB: "0x95aD61b0a150d79219dCF64E1E6Cc01f0B64C4cE",
    UNI: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984",
    PEPE: "0x6982508145454Ce325dDbE47a25d4ec3d2311933",
  };

  if (ethTokens[symbol]) {
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/assets/${ethTokens[symbol]}/logo.png`;
  }

  return null;
}

async function main() {
  console.log("Upserting networks...");
  const networkMap: Record<string, number> = {};
  for (const n of NETWORKS) {
    const network = await prisma.network.upsert({
      where: { slug: n.slug },
      update: { iconUrl: getNetworkLogo(n.slug) },
      create: { ...n, iconUrl: getNetworkLogo(n.slug) },
    });
    networkMap[n.slug] = network.id;
  }

  console.log("Upserting tokens...");
  const tokenMap: Record<string, number> = {};
  for (const t of TOKENS) {
    const token = await prisma.token.upsert({
      where: { symbol: t.symbol },
      update: {
        name: t.name,
        displayOrder: t.displayOrder,
        isEnabled: t.isEnabled ?? true,
        isUnderMaintenance: t.isUnderMaintenance ?? false,
        iconUrl: getTokenLogo(t.symbol),
      },
      create: {
        ...t,
        iconUrl: getTokenLogo(t.symbol),
      },
    });
    tokenMap[t.symbol] = token.id;
  }

  console.log("Upserting token-network mappings...");
  const mappings = [
    // BTC
    {
      symbol: "BTC",
      slug: "bitcoin",
      address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
      min: "0.0005",
    },
    // ETH
    {
      symbol: "ETH",
      slug: "ethereum",
      address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      min: "0.01",
    },
    // USDT
    {
      symbol: "USDT",
      slug: "ethereum",
      address: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
      min: "10",
    },
    {
      symbol: "USDT",
      slug: "tron",
      address: "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t",
      min: "1",
    },
    {
      symbol: "USDT",
      slug: "polygon",
      address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
      min: "1",
    },
    {
      symbol: "USDT",
      slug: "binance",
      address: "0x55d398326f99059fF775485246999027B3197955",
      min: "1",
    },
    // USDC
    {
      symbol: "USDC",
      slug: "ethereum",
      address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
      min: "10",
    },
    {
      symbol: "USDC",
      slug: "solana",
      address: "EPjFWdd5AufqztE2n678n1qrnd7m8ifp0j84f1gh8l9",
      min: "1",
    },
    // SOL
    {
      symbol: "SOL",
      slug: "solana",
      address: "7vK8a8L8vK8a8L8vK8a8L8vK8a8L8vK8a8L8vK8a8L8v",
      min: "0.1",
    },
    // TRX
    {
      symbol: "TRX",
      slug: "tron",
      address: "TY67TY67TY67TY67TY67TY67TY67TY67TY67",
      min: "10",
    },
    // MATIC
    {
      symbol: "MATIC",
      slug: "polygon",
      address: "0x0000000000000000000000000000000000001010",
      min: "1",
    },
    // LINK
    {
      symbol: "LINK",
      slug: "ethereum",
      address: "0x514910771af9ca656af840dff83e8264ecf986ca",
      min: "1",
    },
    // BNB
    {
      symbol: "BNB",
      slug: "binance",
      address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
      min: "0.05",
    },
    // XRP
    {
      symbol: "XRP",
      slug: "ethereum",
      address: "0x1d2f0da1690b98c50777a1b233a921d7b0f2070b",
      min: "10",
    },
    // DOT
    {
      symbol: "DOT",
      slug: "ethereum",
      address: "0x7083609fce4d1d8dc0c979aab8c869ea2c873402",
      min: "1",
    },
    // AVAX
    {
      symbol: "AVAX",
      slug: "ethereum",
      address: "0x85f1300958e9322930ef27d7f2740941e10af45d",
      min: "1",
    },
    // UNI
    {
      symbol: "UNI",
      slug: "ethereum",
      address: "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984",
      min: "1",
    },
    // PEPE
    {
      symbol: "PEPE",
      slug: "ethereum",
      address: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
      min: "1000000",
    },
    // SHIB
    {
      symbol: "SHIB",
      slug: "ethereum",
      address: "0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce",
      min: "500000",
    },
  ];

  for (const m of mappings) {
    if (!tokenMap[m.symbol] || !networkMap[m.slug]) continue;

    await prisma.tokenNetwork.upsert({
      where: {
        tokenId_networkId: {
          tokenId: tokenMap[m.symbol],
          networkId: networkMap[m.slug],
        },
      },
      update: {
        depositAddress: m.address,
        minDeposit: m.min,
      },
      create: {
        tokenId: tokenMap[m.symbol],
        networkId: networkMap[m.slug],
        depositAddress: m.address,
        minDeposit: m.min,
      },
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
