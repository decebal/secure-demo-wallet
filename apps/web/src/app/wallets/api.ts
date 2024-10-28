import { apiClient } from "@/auth/httpClient";

type Key = string | number;
export type Selection = "all" | Set<Key>;
export interface WalletListResponse {
  id: string;
  name: string;
  network: string;
  account: string;
  balance: string;
}

export const createWallet = async (selectedNetwork: Selection) => {
  const networkId = Array.from(selectedNetwork)[0] as string;
  return await apiClient.post("wallets", { json: { networkId } }).json();
};

export const getWallets = async (page = 0, perPage = 10) => {
  return await apiClient("wallets", { searchParams: { page, perPage } }).json();
};
