"use client";

import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@v1/ui/table";
import {useEffect, useState} from "react";

import {Spinner} from "@/components/spinner";
import {formatCurrency, formatNetworkId} from "@/utils/stringUtils";
import {Button} from "@v1/ui/button";
import {Card, CardContent, CardHeader} from "@v1/ui/card";
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@v1/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@v1/ui/pagination";
import {ChevronDownIcon, Wallet} from "lucide-react";
import type {Selection, WalletListResponse} from "@/app/wallets/api";
import {createWallet, getWallets} from "@/app/wallets/api";
import {SpinnerCloud} from "@/components/spinner-cloud";
import ShimmerButton from "@v1/ui/shimmer-button";
import {CopyText} from "@/components/copy-text";
import {useRouter} from "next/navigation";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger,} from "@v1/ui/tooltip";

const WALLETS_PER_PAGE_OPTIONS = [10, 20, 50, 100];
const SUPPORTED_NETWORKS = ["sepolia"];

export const metadata = {
  title: "Secure Demo Wallet | Wallet Manager",
};

export default function Wallets() {
  const [wallets, setWallets] = useState<WalletListResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNetwork, setSelectedNetwork] = useState<Selection>(
    new Set([SUPPORTED_NETWORKS[0]]),
  );
  const [walletsPerPage, setWalletsPerPage] = useState(
    WALLETS_PER_PAGE_OPTIONS[0],
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [createWalletLoading, setCreateWalletLoading] = useState(false);
  const [createWalletError, setCreateWalletError] = useState<string | null>(
    null,
  );
  const router = useRouter();

  useEffect(() => {
    void fetchWallets();
  }, []);

  async function fetchWallets() {
    try {
      const { data, status, error } = await getWallets(
        currentPage,
        walletsPerPage,
      );
      if (status) {
        data !== null && setWallets(data);
      }
      if (error) {
        console.error("Error fetching wallets:", error);
        setError("Failed to load wallets. Please try again later.");
      }
    } catch (err) {
      console.error("Error fetching wallets:", err);
      setError("Failed to load wallets. Please try again later.");
    } finally {
      setLoading(false);
    }
  }

  const handleCreateWallet = async () => {
    setCreateWalletLoading(true);
    setCreateWalletError(null);

    try {
      await createWallet(selectedNetwork);
      // router.push(`/wallets/${data.id}`);
    } catch (err) {
      setCreateWalletError(
        err instanceof Error ? err.message : "An unknown error occurred",
      );
    } finally {
      setCreateWalletLoading(false);
    }
  };

  const columns = [
    { name: "WALLET ADDRESS", uid: "account" },
    { name: "NETWORK", uid: "network" },
    { name: "BALANCE", uid: "balance" },
  ];

  const paginatedWallets = wallets.slice(
    (currentPage - 1) * walletsPerPage,
    currentPage * walletsPerPage,
  );

  const totalPages = Math.ceil(wallets.length / walletsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <SpinnerCloud />
      </div>
    );
  }

  if (error) {
    return (
        <>
          <div className="py-10" />
          <Card className="max-w-2xl mx-auto mt-8">
            <CardContent className="p-6">
              <p className="text-red-500 align-middle">{error}</p>
            </CardContent>
          </Card>
        </>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto p-4 space-y-6">
      <div className="py-6" />
      <h1 className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-pink-600">
        Wallet Manager
      </h1>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold flex items-center text-gray-800 dark:text-gray-200">
            <Wallet className="mr-2 h-6 w-6" /> Wallets
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-200">
              Wallets per page:
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="secondary">{walletsPerPage}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent aria-label="Wallets per page">
                {WALLETS_PER_PAGE_OPTIONS.map((option) => (
                  <DropdownMenuItem
                    onClick={() => setWalletsPerPage(Number(option))}
                    key={option}
                  >
                    {option}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          <Table aria-label="Wallets table">
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead key={column.uid}>{column.name}</TableHead>
                ))}
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedWallets.map((wallet) => (
                <TableRow key={wallet.id}>
                  <TableCell>
                    <CopyText value={wallet.account} />
                  </TableCell>
                  <TableCell>{formatNetworkId(wallet.network)}</TableCell>
                  <TableCell>{formatCurrency(wallet.balance)}</TableCell>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => router.push(`/wallets/${wallet.id}`)}
                          >
                            <Wallet className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>See wallet details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
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
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
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
              {currentPage !== totalPages && (
                <PaginationItem>
                  <PaginationNext
                    isActive={currentPage !== totalPages}
                    onPress={() => handlePageChange(currentPage + 1)}
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold flex items-center text-gray-800 dark:text-gray-200">
            Create New Wallet
          </h2>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant="outline"
                  endContent={<ChevronDownIcon className="h-4 w-4" />}
                >
                  {Array.from(selectedNetwork)[0] || "Select Network"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                aria-label="Select Network"
                disallowEmptySelection
                selectionMode="single"
                selectedKeys={selectedNetwork}
                onSelectionChange={setSelectedNetwork}
                className="bg-white dark:bg-gray-800"
              >
                {SUPPORTED_NETWORKS.map((network) => (
                  <DropdownMenuItem key={network}>{network}</DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="inline-block">
              <ShimmerButton
                disabled={
                  createWalletLoading ||
                  (selectedNetwork !== "all" && selectedNetwork.size === 0)
                }
                onClick={handleCreateWallet}
              >
                <span className="whitespace-pre-wrap text-center text-sm font-medium leading-none tracking-tight text-white dark:from-white dark:to-slate-900/10 lg:text-lg">
                  {createWalletLoading ? (
                    <Spinner size="sm" />
                  ) : (
                    "Create Wallet"
                  )}
                </span>
              </ShimmerButton>
            </div>
          </div>
          {createWalletError && (
            <p className="text-red-500 dark:text-red-400 mt-4 text-sm">
              {createWalletError}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
