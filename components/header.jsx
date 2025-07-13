"use client";

import React from "react";
import { Button } from "./ui/button";
import { PenBox, LayoutDashboard, Receipt } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b">
      <nav className="container mx-auto px-2 py-2 flex flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-4 sm:gap-8">
          <SignedIn>
            <Link href="/dashboard">
              <Image
                src="/pursify_logo.png"
                alt="Pursify Logo"
                width={120}
                height={60}
                className="w-auto max-h-[40px] object-contain sm:max-h-[60px]"
              />
            </Link>
          </SignedIn>
          <SignedOut>
            <Link href="/">
              <Image
                src="/pursify_logo.png"
                alt="Pursify Logo"
                width={120}
                height={60}
                className="w-auto max-h-[40px] object-contain sm:max-h-[60px]"
              />
            </Link>
          </SignedOut>
          <SignedIn>
            <Link
              href="/dashboard"
              className={`flex items-center gap-2 text-base transition-colors ${
                pathname === "/dashboard" 
                  ? "text-green-600" 
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              <LayoutDashboard size={20} />
              <span className="hidden md:inline">Dashboard</span>
            </Link>
            <Link
              href="/transaction"
              className={`flex items-center gap-2 text-base transition-colors ${
                pathname === "/transaction" 
                  ? "text-green-600" 
                  : "text-gray-600 hover:text-green-600"
              }`}
            >
              <Receipt size={20} />
              <span className="hidden md:inline">Transactions</span>
            </Link>
          </SignedIn>
        </div>
        <div className="flex items-center gap-4">
          <SignedIn>
            <Link href="/transaction/create">
              <Button className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 text-base" type="button">
                <PenBox size={18} />
                <span className="hidden md:inline">Add Transaction</span>
              </Button>
            </Link>
          </SignedIn>
          <SignedOut>
            <SignInButton forceRedirectUrl="/dashboard">
              <Button variant="outline" className="px-4 py-2 text-base">Login</Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10",
                },
              }}
            />
          </SignedIn>
        </div>
      </nav>
    </header>
  );
};

export default Header;
