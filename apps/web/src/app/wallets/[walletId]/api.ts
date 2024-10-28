import { apiClient } from "@/auth/httpClient";

export interface WalletResponse {
  id: string;
  name: string;
  network: string;
  account: string;
  balance: string;
  addresses: string[];
  balances: Record<string, number>;
}

export const getWallet = async (walletId) => {
  return await apiClient(`wallets/${walletId}`).json();
};
