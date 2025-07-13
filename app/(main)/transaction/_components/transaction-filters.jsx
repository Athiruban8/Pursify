"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Calendar, Filter, X } from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { categoryColors } from "@/data/categories";

export function TransactionFilters({ accounts }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [selectedAccount, setSelectedAccount] = useState(
    searchParams.get("account") || "all"
  );
  const [selectedType, setSelectedType] = useState(
    searchParams.get("type") || "all"
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all"
  );
  const [dateFrom, setDateFrom] = useState(
    searchParams.get("dateFrom") ? new Date(searchParams.get("dateFrom")) : null
  );
  const [dateTo, setDateTo] = useState(
    searchParams.get("dateTo") ? new Date(searchParams.get("dateTo")) : null
  );
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [recurringFilter, setRecurringFilter] = useState(
    searchParams.get("recurring") || "all"
  );

  const updateFilters = useCallback(() => {
    const params = new URLSearchParams();
    
    if (selectedAccount !== "all") {
      params.set("account", selectedAccount);
    }
    if (selectedType !== "all") {
      params.set("type", selectedType);
    }
    if (selectedCategory !== "all") {
      params.set("category", selectedCategory);
    }
    if (dateFrom) {
      params.set("dateFrom", dateFrom.toISOString().split('T')[0]);
    }
    if (dateTo) {
      params.set("dateTo", dateTo.toISOString().split('T')[0]);
    }
    if (searchTerm) {
      params.set("search", searchTerm);
    }
    if (recurringFilter !== "all") {
      params.set("recurring", recurringFilter);
    }
    
    const queryString = params.toString();
    const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
    router.replace(newUrl, { scroll: false });
  }, [selectedAccount, selectedType, selectedCategory, dateFrom, dateTo, searchTerm, recurringFilter, pathname, router]);

  const clearFilters = () => {
    setSelectedAccount("all");
    setSelectedType("all");
    setSelectedCategory("all");
    setDateFrom(null);
    setDateTo(null);
    setSearchTerm("");
    setRecurringFilter("all");
    router.replace(pathname, { scroll: false });
  };

  useEffect(() => {
    updateFilters();
  }, [selectedAccount, selectedType, selectedCategory, dateFrom, dateTo, searchTerm, recurringFilter, updateFilters]);

  // Get all available categories from the data
  const categories = Object.keys(categoryColors);

  // Check if any filters are active
  const hasActiveFilters = selectedAccount !== "all" || 
                          selectedType !== "all" || 
                          selectedCategory !== "all" || 
                          dateFrom || 
                          dateTo || 
                          searchTerm || 
                          recurringFilter !== "all";

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Filter className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Filters</h3>
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="ml-auto"
            >
              <X className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {/* Search Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Search</label>
            <Input
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Account Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Account</label>
            <Select value={selectedAccount} onValueChange={setSelectedAccount}>
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Accounts</SelectItem>
                {accounts.map((account) => (
                  <SelectItem key={account.id} value={account.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{account.name}</span>
                      <span className="text-xs text-muted-foreground hidden sm:inline">
                        (₹{parseFloat(account.balance).toFixed(2)})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Transaction Type Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Type</label>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="EXPENSE">Expense</SelectItem>
                <SelectItem value="INCOME">Income</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Category</label>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: categoryColors[category] }}
                      />
                      {category}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Date From Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">From Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateFrom ? format(dateFrom, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={dateFrom}
                  onSelect={setDateFrom}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Date To Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">To Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateTo ? format(dateTo, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={dateTo}
                  onSelect={setDateTo}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Recurring Filter */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Recurring</label>
            <Select value={recurringFilter} onValueChange={setRecurringFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="recurring">Recurring Only</SelectItem>
                <SelectItem value="non-recurring">Non-recurring Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 