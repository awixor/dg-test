export function truncateAddress(addr: string): string {
  if (addr.length <= 20) return addr;

  return `${addr.slice(0, 25)}...${addr.slice(-6)}`;
}
