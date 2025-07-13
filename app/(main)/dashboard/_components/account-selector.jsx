"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Wallet } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

export function AccountSelector({ accounts }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedAccountId, setSelectedAccountId] = useState("all");

  // Always default to 'all' (All Accounts) unless a valid account is in the URL
  useEffect(() => {
    const urlAccount = searchParams.get("account");
    if (urlAccount && (urlAccount === "all" || accounts.some(a => a.id === urlAccount))) {
      setSelectedAccountId(urlAccount);
    } else {
      setSelectedAccountId("all");
    }
  }, [searchParams, accounts]);

  const handleAccountChange = (accountId) => {
    setSelectedAccountId(accountId);
    // Update URL with account filter
    const params = new URLSearchParams(searchParams);
    if (accountId && accountId !== "all") {
      params.set("account", accountId);
    } else {
      params.delete("account");
    }
    const newUrl = params.toString() ? `?${params.toString()}` : "";
    router.replace(`/dashboard${newUrl}`, { scroll: false });
  };

  const selectedAccount = accounts.find(a => a.id === selectedAccountId);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <Wallet className="h-5 w-5 text-muted-foreground" />
            <div>
              <h3 className="text-sm font-medium">Active Account</h3>
              <p className="text-xs text-muted-foreground hidden sm:block">
                Switch between accounts to view different data
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {selectedAccount && selectedAccountId !== "all" ? (
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium">{selectedAccount.name}</div>
                <div className="text-xs text-muted-foreground">
                  ₹{selectedAccount.balance.toFixed(2)}
                </div>
              </div>
            ) : (
              <div className="text-right hidden sm:block">
                <div className="text-sm font-medium">All Accounts</div>
                <div className="text-xs text-muted-foreground">
                  Combined view
                </div>
              </div>
            )}
            <Select value={selectedAccountId} onValueChange={handleAccountChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <span>{account.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 