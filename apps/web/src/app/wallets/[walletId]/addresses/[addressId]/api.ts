import { apiClient } from "@/auth/httpClient";

export interface AddressResponse {
  id: string;
  network: string;
  account: string;
  walletId: string;
  balances: Record<string, number>;
}

export const getAddress = async (walletId) => {
  // /api/wallets/${params.walletId}/addresses/${params.addressId}
  return await apiClient(`wallets/${walletId}`).json();
};

export const sendTransaction = async ({
  walletId,
  addressId,
  destinationAddress,
  amount,
}: {
  walletId: string;
  addressId: string;
  destinationAddress: string;
  amount: string;
}) => {
  try {
    const response = await apiClient
      .post(`wallets/${walletId}/addresses/${addressId}`, {
        json: {
          to: destinationAddress,
          value: amount,
        },
      })
      .json();

    if (!response.status) {
      throw new Error(response.message || "Failed to create transfer");
    }
    return response.data;
  } catch (e) {
    console.error(e);
    throw new Error(e.message);
  }
};
