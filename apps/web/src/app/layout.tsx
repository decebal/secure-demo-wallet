import "@v1/ui/globals.css";
import {Header} from "@/components/header";
import {cn} from "@v1/ui/cn";
import {GeistMono} from "geist/font/mono";
import {GeistSans} from "geist/font/sans";
import type {Metadata} from "next";
import localFont from "next/font/local";
import {AuthProvider} from "@/auth/AuthContext";

const DepartureMono = localFont({
  src: "../fonts/DepartureMono-Regular.woff2",
  variable: "--font-departure-mono",
});

export const metadata: Metadata = {
  title: "Demo Secure Wallet",
  description: "Demo Secure Wallet",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          `${DepartureMono.variable} ${GeistSans.variable} ${GeistMono.variable}`,
          "antialiased dark",
        )}
      >
        <AuthProvider>
          <Header />

          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
