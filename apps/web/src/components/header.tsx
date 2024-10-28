"use client";

import Image from "next/image";
import Link from "next/link";

import {usePathname, useRouter} from "next/navigation";
import {Button} from "@v1/ui/button";
import {useAuth} from "@/auth/AuthContext";

export function Header() {
  const pathname = usePathname();

  const { isLoggedIn, logout } = useAuth();

  const router = useRouter();

  return (
    <header className="absolute top-0 w-full flex items-center justify-between p-4 z-10">
      <span className="hidden md:block text-sm font-medium">swallet.demo</span>

      <Link href="/">
        <Image
          src="/logo.png"
          alt="Secure Wallet Demo logo"
          width={60}
          quality={100}
          height={60}
          className="md:absolute md:left-1/2 md:top-5 md:-translate-x-1/2"
        />
      </Link>

      {pathname !== "login" && (
        <nav className="md:mt-2">
          <ul className="flex items-center gap-4">
            <li>
              {isLoggedIn ? (
                <Button
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                  className="text-sm px-4 py-2 bg-primary text-secondary rounded-full font-medium"
                >
                  Logout
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    router.push("/login");
                  }}
                  className="text-sm px-4 py-2 bg-primary text-secondary rounded-full font-medium"
                >
                  Login
                </Button>
              )}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
