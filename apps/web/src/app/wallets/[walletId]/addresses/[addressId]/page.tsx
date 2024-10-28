"use client";

import { type FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, ChevronLeft, ChevronRight } from "lucide-react";
import type { AddressResponse } from "@/app/wallets/[walletId]/addresses/[addressId]/api";
import {getAddress, sendTransaction} from "@/app/wallets/[walletId]/addresses/[addressId]/api";
import { SpinnerCloud } from "@/components/spinner-cloud";
import { Card, CardContent, CardHeader } from "@v1/ui/card";
import { Button } from "@v1/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@v1/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@v1/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@v1/ui/pagination";
import {Input} from "@v1/ui/input";

const BALANCES_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export default function AddressPage({
  params,
}: { params: { walletId: string; addressId: string } }) {
  const [address, setAddress] = useState<AddressResponse | null>(null);
  const [addressLoading, setAddressLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [destinationAddress, setDestinationAddress] = useState("");
  const [amount, setAmount] = useState("");
  const [transferLoading, setTransferLoading] = useState(false);
  const [transferError, setTransferError] = useState("");
  const [transferSuccess, setTransferSuccess] = useState("");
  const [balancesPerPage, setBalancesPerPage] = useState(
    BALANCES_PER_PAGE_OPTIONS[0],
  );

  const fetchAddress = async () => {
    try {
      setAddressLoading(true);
      const { data, status, error } = await getAddress(params.walletId);
      if (status) {
        data !== null && setAddress(data);
      }
      if (error) {
        console.error("Error fetching wallets:", error);
        setError("Failed to load wallet. Please try again later.");
      }
    } catch (err) {
      console.error("Error fetching wallet:", err);
      setError("Failed to load wallet. Please try again later.");
    } finally {
      setAddressLoading(false);
    }
  };

  useEffect(() => {
    void fetchAddress();
  }, [params.walletId, params.addressId]);

  const handleCreateTransfer = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setTransferLoading(true);
    setTransferError("");
    setTransferSuccess("");

    try {
      const response = await sendTransaction({
        walletId: params.walletId,
        addressId: params.addressId,
        destinationAddress,
        amount,
      })
      console.log({response})

      // setTransferSuccess(data.transactionLink);

      setDestinationAddress("");
      setAmount("");
    } catch (err) {
      console.error("Error creating transfer:", err);
      if (err instanceof Error) {
        setTransferError(err.message);
      } else {
        setTransferError("An unknown error occurred");
      }
    } finally {
      setTransferLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleBalancesPerPageChange = (key: string) => {
    setBalancesPerPage(Number(key));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  if (addressLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <SpinnerCloud />
      </div>
    );
  }

  if (error || !address) {
    return (
      <>
        <div className="py-10" />
        <Card className="max-w-2xl mx-auto mt-8">
          <CardContent className="p-6">
            <p className="text-red-500 align-middle">
              {error || "Address not found"}
            </p>
          </CardContent>
        </Card>
      </>
    );
  }

  const totalBalancePages = Math.ceil(
    Math.max(Object.keys(address?.balances || {}).length, 1) / balancesPerPage,
  );
  const startIndex = (currentPage - 1) * balancesPerPage;
  const endIndex = startIndex + balancesPerPage;
  let currentBalances = Object.entries(address?.balances || {}).slice(
    startIndex,
    endIndex,
  );

  // Add empty ETH balance if no balances exist
  if (currentBalances.length === 0) {
    currentBalances = [["eth", 0]];
  }

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <div className="py-10" />
      <Link
        href={`/wallets/${params.walletId}`}
        className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 mb-4"
      >
        <ArrowLeft className="mr-2" size={20} />
        <span>Back to Wallet</span>
      </Link>

      <Card className="mb-6 shadow-sm">
        <CardHeader className="flex px-6 py-4">
          <div className="flex items-center gap-3">
            <CreditCard
              size={24}
              className="text-blue-600 dark:text-blue-400"
            />
            <div>
              <h1 className="text-lg font-semibold">
                Address Details
              </h1>
              <p className="text-sm">
                ID: {address.id}
              </p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-6 py-4">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium mb-1">
                Network
              </p>
              <p className="text-base">
                {address.network}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">
                Wallet ID
              </p>
              <p className="text-base ">
                {address.account}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6 shadow-sm">
        <CardHeader className="flex justify-between items-center px-6 py-4">
          <h2 className="text-lg font-semibold">
            Balances
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-sm">
              Items per page:
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="secondary">{balancesPerPage}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent aria-label="Balances per page">
                {BALANCES_PER_PAGE_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    onClick={() =>
                      handleBalancesPerPageChange(option.toString())
                    }
                    key={option}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent className="px-6 py-4">
          <Table aria-label="Balances table" className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">
                  CURRENCY
                </TableHead>
                <TableHead className="text-right">
                  AMOUNT
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentBalances.map(([currency, amount]) => (
                <TableRow key={currency}>
                  <TableCell className="text-left text-base">
                    {currency}
                  </TableCell>
                  <TableCell className="text-right text-base">
                    {amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Pagination className="flex justify-center items-center mt-6">
            <PaginationContent>
              {currentPage !== 1 && (
                <PaginationItem>
                  <PaginationPrevious
                    onPress={() => handlePageChange(currentPage - 1)}
                  />
                </PaginationItem>
              )}
              {Array.from({ length: totalBalancePages }, (_, i) => i + 1).map(
                (page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={currentPage === page}
                      onPress={() => handlePageChange(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ),
              )}
              {currentPage !== totalBalancePages && (
                <PaginationItem>
                  <PaginationNext
                    isActive={currentPage !== totalBalancePages}
                    onPress={() => handlePageChange(currentPage + 1)}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        <Card className="shadow-sm">
          <CardHeader className="px-6 py-4">
            <h2 className="text-lg font-semibold">
              Create Transfer
            </h2>
          </CardHeader>
          <CardContent className="px-6 py-4">
            <form onSubmit={handleCreateTransfer} className="space-y-4">
              <Input
                label="Destination Address"
                value={destinationAddress}
                onChange={(e) => setDestinationAddress(e.target.value)}
                required
                placeholder="0x..."
              />
              <Input
                label="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                type="number"
                required
                min="0"
                step="any"
                placeholder="0.00"
              />
              <Button
                color="primary"
                type="submit"
                isLoading={transferLoading}
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                {transferLoading ? "Creating Transfer..." : "Create Transfer"}
              </Button>
            </form>
            {transferError && (
              <div className="mt-2 text-danger">
                <p>{transferError}</p>
                {transferError.toLowerCase().includes("insufficient funds") && (
                  <p className="mt-1">
                    Use the{" "}
                    <Link
                      href="#faucet-section"
                      className="text-blue-600 hover:underline"
                    >
                      faucet
                    </Link>{" "}
                    to get ETH.
                  </p>
                )}
              </div>
            )}
            {transferSuccess && (
              <div className="mt-2">
                <strong>Transaction Link:</strong>{" "}
                <Link
                  href={transferSuccess}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Transaction
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
