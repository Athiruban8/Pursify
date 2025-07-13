"use client";

import { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { format, subDays, eachDayOfInterval } from "date-fns";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

function CashFlowCard({ income, expense, net, percentChange }) {
  const netNegative = net < 0;
  const absIncome = Math.abs(income);
  const absExpense = Math.abs(expense);
  let incomeBar = 0, expenseBar = 0;
  if (absIncome === 0 && absExpense === 0) {
    incomeBar = 0;
    expenseBar = 0;
  } else if (absIncome >= absExpense) {
    incomeBar = 100;
    expenseBar = absExpense / absIncome * 100;
  } else {
    incomeBar = absIncome / absExpense * 100;
    expenseBar = 100;
  }
  return (
    <Card>
      <CardHeader className="pb-2 flex flex-col items-start">
        <CardTitle className="text-lg font-semibold">Cash Flow</CardTitle>
        <div className="w-full flex items-center justify-between mt-2">
          <div>
            <div className="text-xs text-muted-foreground">THIS MONTH</div>
            <div className={`text-3xl font-bold ${netNegative ? "text-red-700" : "text-green-700"}`}>{netNegative ? "-" : ""}₹{Math.abs(net).toFixed(2)}</div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-muted-foreground">vs previous period</span>
            <span className={`flex items-center gap-1 text-xs font-medium ${percentChange < 0 ? "text-red-600" : "text-green-600"}`}>
              {percentChange < 0 ? <ArrowDownRight className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
              {Math.abs(percentChange).toFixed(0)}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm font-medium mb-2">
          <span>Income</span>
          <span className="text-green-600">₹{absIncome.toFixed(2)}</span>
        </div>
        <div className="w-full h-6 bg-gray-100 rounded-lg mb-4 relative overflow-hidden">
          <div className="h-6 bg-green-500 absolute left-0 top-0 transition-all duration-300" style={{ width: `${incomeBar}%` }} />
          {absIncome < absExpense && (
            <div className="h-6 bg-gray-300 absolute left-0 top-0" style={{ width: `${100 - incomeBar}%`, left: `${incomeBar}%` }} />
          )}
        </div>
        <div className="flex items-center justify-between text-sm font-medium mb-2">
          <span>Expense</span>
          <span className="text-red-600">-₹{absExpense.toFixed(2)}</span>
        </div>
        <div className="w-full h-6 bg-gray-100 rounded-lg relative overflow-hidden">
          <div className="h-6 bg-red-500 absolute left-0 top-0 transition-all duration-300" style={{ width: `${expenseBar}%` }} />
          {absExpense < absIncome && (
            <div className="h-6 bg-gray-300 absolute left-0 top-0" style={{ width: `${100 - expenseBar}%`, left: `${expenseBar}%` }} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function TransactionChart({ transactions}) {
  const searchParams = useSearchParams();
  const [chartType, setChartType] = useState("line");
  const [timeRange, setTimeRange] = useState("30");

  // Get URL-based filters
  const urlAccountFilter = searchParams.get("account");
  const urlTypeFilter = searchParams.get("type");
  const urlDateFrom = searchParams.get("dateFrom");
  const urlDateTo = searchParams.get("dateTo");

  // Filter transactions based on URL params
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // account filter
    if (urlAccountFilter && urlAccountFilter !== "all") {
      result = result.filter((transaction) => transaction.accountId === urlAccountFilter);
    }

    // type filter
    if (urlTypeFilter && urlTypeFilter !== "all") {
      result = result.filter((transaction) => transaction.type === urlTypeFilter);
    }

    // date filters
    if (urlDateFrom) {
      const fromDate = new Date(urlDateFrom);
      result = result.filter((transaction) => new Date(transaction.date) >= fromDate);
    }

    if (urlDateTo) {
      const toDate = new Date(urlDateTo);
      toDate.setHours(23, 59, 59, 999);
      result = result.filter((transaction) => new Date(transaction.date) <= toDate);
    }

    return result;
  }, [transactions, urlAccountFilter, urlTypeFilter, urlDateFrom, urlDateTo]);

  // data for line/bar chart
  const chartData = useMemo(() => {
    const days = parseInt(timeRange);
    const endDate = new Date();
    const startDate = subDays(endDate, days - 1);

    const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

    return dateRange.map(date => {
      const dayTransactions = filteredTransactions.filter(t => {
        const transactionDate = new Date(t.date);
        return (
          transactionDate.getDate() === date.getDate() &&
          transactionDate.getMonth() === date.getMonth() &&
          transactionDate.getFullYear() === date.getFullYear()
        );
      });

      const income = dayTransactions
        .filter(t => t.type === "INCOME")
        .reduce((sum, t) => sum + t.amount, 0);

      const expense = dayTransactions
        .filter(t => t.type === "EXPENSE")
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        date: format(date, "MMM dd"),
        income,
        expense,
        net: income - expense,
      };
    });
  }, [filteredTransactions, timeRange]);


  // Calc summary stats
  const summary = useMemo(() => {
    const totalIncome = filteredTransactions
      .filter(t => t.type === "INCOME")
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = filteredTransactions
      .filter(t => t.type === "EXPENSE")
      .reduce((sum, t) => sum + t.amount, 0);

    return {
      totalIncome,
      totalExpense,
      netAmount: totalIncome - totalExpense,
      transactionCount: filteredTransactions.length,
    };
  }, [filteredTransactions]);

  // Calculate prev period for percent change
  const prevPeriod = useMemo(() => {
    const days = parseInt(timeRange);
    const endDate = subDays(new Date(), days);
    const startDate = subDays(endDate, days - 1);
    const prev = transactions.filter(t => {
      const d = new Date(t.date);
      return d >= startDate && d < endDate;
    });
    const prevIncome = prev.filter(t => t.type === "INCOME").reduce((sum, t) => sum + t.amount, 0);
    const prevExpense = prev.filter(t => t.type === "EXPENSE").reduce((sum, t) => sum + t.amount, 0);
    return { prevIncome, prevExpense, prevNet: prevIncome - prevExpense };
  }, [transactions, timeRange]);

  const percentChange = useMemo(() => {
    if (prevPeriod.prevNet === 0) return 0;
    return ((summary.netAmount - prevPeriod.prevNet) / Math.abs(prevPeriod.prevNet)) * 100;
  }, [summary.netAmount, prevPeriod]);

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              ₹{summary.totalIncome.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              ₹{summary.totalExpense.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${summary.netAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₹{summary.netAmount.toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {summary.transactionCount}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cash Flow Card */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CashFlowCard
          income={summary.totalIncome}
          expense={-summary.totalExpense}
          net={summary.netAmount}
          percentChange={percentChange}
        />

        {/* Transaction Trends Chart */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-lg font-semibold">Transaction Trends</CardTitle>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Select value={chartType} onValueChange={setChartType}>
                  <SelectTrigger className="w-full sm:w-[120px]">
                    <SelectValue placeholder="Chart type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-full sm:w-[120px]">
                    <SelectValue placeholder="Time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">Last 7 days</SelectItem>
                    <SelectItem value="30">Last 30 days</SelectItem>
                    <SelectItem value="90">Last 90 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                {chartType === "line" ? (
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => `₹${value.toFixed(2)}`}
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="income"
                      stroke="#22c55e"
                      strokeWidth={2}
                      name="Income"
                    />
                    <Line
                      type="monotone"
                      dataKey="expense"
                      stroke="#ef4444"
                      strokeWidth={2}
                      name="Expense"
                    />
                    <Line
                      type="monotone"
                      dataKey="net"
                      stroke="#3b82f6"
                      strokeWidth={2}
                      name="Net"
                    />
                  </LineChart>
                ) : (
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip
                      formatter={(value) => `₹${value.toFixed(2)}`}
                      contentStyle={{
                        backgroundColor: "hsl(var(--popover))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "var(--radius)",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="income" fill="#22c55e" name="Income" />
                    <Bar dataKey="expense" fill="#ef4444" name="Expense" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 