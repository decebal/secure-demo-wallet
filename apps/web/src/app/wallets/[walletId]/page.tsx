"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Wallet } from "lucide-react";
import { formatNetworkId } from "@/utils/stringUtils";
import type { WalletResponse } from "@/app/wallets/[walletId]/api";
import { getWallet } from "@/app/wallets/[walletId]/api";
import { SpinnerCloud } from "@/components/spinner-cloud";
import { Card, CardContent, CardHeader } from "@v1/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@v1/ui/dropdown-menu";
import { Button } from "@v1/ui/button";
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

const BALANCES_PER_PAGE_OPTIONS = [5, 10, 20, 50];

export default function WalletPage({
  params,
}: { params: { walletId: string } }) {
  const [wallet, setWallet] = useState<WalletResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [balancesPerPage, setBalancesPerPage] = useState(
    BALANCES_PER_PAGE_OPTIONS[0],
  );

  useEffect(() => {
    async function fetchWallet() {
      try {
        const { data, status, error } = await getWallet(params.walletId);
        if (status) {
          data !== null &&
            setWallet({ balances: [], addresses: [[data.account]], ...data });
        }
        if (error) {
          console.error("Error fetching wallets:", error);
          setError("Failed to load wallet. Please try again later.");
        }
      } catch (err) {
        console.error("Error fetching wallet:", err);
        setError("Failed to load wallet. Please try again later.");
      } finally {
        setLoading(false);
      }
    }
    void fetchWallet();
  }, [params.walletId]);

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <SpinnerCloud />
      </div>
    );
  }

  if (error || !wallet) {
    return (
      <>
        <div className="py-10" />
        <Card className="max-w-2xl mx-auto mt-8">
          <CardContent className="p-6">
            <p className="text-red-500 align-middle">
              {error || "Wallet not found"}
            </p>
          </CardContent>
        </Card>
      </>
    );
  }

  const totalBalancePages = Math.ceil(
    Math.max(Object.keys(wallet.balances).length, 1) / balancesPerPage,
  );

  const startIndex = (currentPage - 1) * balancesPerPage;
  const endIndex = startIndex + balancesPerPage;
  let currentBalances = Object.entries(wallet.balances).slice(
    startIndex,
    endIndex,
  );

  // Add empty ETH balance if no balances exist
  if (currentBalances.length === 0) {
    currentBalances = [["eth", 0]];
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleBalancesPerPageChange = (key: string) => {
    setBalancesPerPage(Number(key));
    setCurrentPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="container max-w-4xl mx-auto p-4">
      <div className="py-10" />
      <Link
        href="/wallets"
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft className="mr-2" size={20} />
        <span>Back to Wallets</span>
      </Link>

      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Wallet size={24} className="text-blue-600" />
            <div>
              <h1 className="text-lg font-semibold">
                Wallet Details
              </h1>
              <p className="text-sm">ID: {params.walletId}</p>
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
                {formatNetworkId(wallet.network)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">
                Default Address
              </p>
              <p className="text-sm">
                {wallet.account}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-sm mb-6">
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
          <Table aria-label="Balances table">
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">CURRENCY</TableHead>
                <TableHead className="text-right">AMOUNT</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentBalances.map(([currency, amount]) => (
                <TableRow key={currency}>
                  <TableCell className="text-left">{currency}</TableCell>
                  <TableCell className="text-right">{amount}</TableCell>
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

      <Card className="shadow-sm">
        <CardHeader className="px-6 py-4 justify-between items-center">
          <h2 className="text-lg font-semibold">
            Addresses
          </h2>
        </CardHeader>
        <CardContent className="px-6 py-4">
          <Table aria-label="Addresses table" className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/6">
                  INDEX
                </TableHead>
                <TableHead>
                  ADDRESS
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {wallet.addresses.map((address, index) => (
                <TableRow key={address}>
                  <TableCell>
                    {index}
                  </TableCell>
                  <TableCell>
                    <Link
                      href={`/wallets/${wallet.id}/addresses/${address}`}
                      className="hover:underline cursor-pointer"
                    >
                      {address}
                    </Link>
                    {/*{address === wallet.account && (*/}
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 py-1 px-2 rounded-full dark:bg-blue-900 dark:text-blue-400">
                        Default
                      </span>
                    {/*)}*/}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
