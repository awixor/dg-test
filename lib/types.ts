type NetworkEntry = {
  depositAddress: string;
  minDeposit: string;
  network: {
    id: number;
    name: string;
    slug: string;
    iconUrl: string | null;
  };
};

export type PaginationMeta = {
  page: number;
  hasNextPage: boolean;
};

export type TokenData = {
  id: number;
  symbol: string;
  name: string;
  iconUrl: string | null;
  isUnderMaintenance: boolean;
  displayOrder: number;
  networks: NetworkEntry[];
};
