import { useState, useCallback, useMemo } from "react";
import {
  Expense,
  Category,
  detectAnomalies,
  getMonthKey,
  getMonthLabel,
} from "@/lib/expense-utils";

// Generate a simple unique id
function uid(): string {
  return Math.random().toString(36).slice(2, 11) + Date.now().toString(36);
}

// Sample data
const SAMPLE_EXPENSES: Omit<Expense, "id" | "isAnomaly">[] = [
  { date: "2026-03-01", amount: 12.5, vendor: "Starbucks", description: "Morning coffee", category: "Food" },
  { date: "2026-03-02", amount: 45.0, vendor: "Uber", description: "Airport ride", category: "Transport" },
  { date: "2026-03-03", amount: 89.99, vendor: "Amazon", description: "Headphones", category: "Shopping" },
  { date: "2026-03-04", amount: 15.99, vendor: "Netflix", description: "Monthly subscription", category: "Entertainment" },
  { date: "2026-03-05", amount: 320.0, vendor: "Swiggy", description: "Team lunch x10", category: "Food" },
  { date: "2026-03-06", amount: 8.5, vendor: "Swiggy", description: "Dinner", category: "Food" },
  { date: "2026-03-07", amount: 55.0, vendor: "Shell", description: "Gas refill", category: "Transport" },
  { date: "2026-03-08", amount: 120.0, vendor: "Electricity", description: "Monthly bill", category: "Utilities" },
  { date: "2026-03-09", amount: 25.0, vendor: "Spotify", description: "Family plan", category: "Entertainment" },
  { date: "2026-03-10", amount: 199.99, vendor: "Amazon", description: "Keyboard", category: "Shopping" },
  { date: "2026-02-15", amount: 42.0, vendor: "Zomato", description: "Weekend order", category: "Food" },
  { date: "2026-02-20", amount: 30.0, vendor: "Uber", description: "City ride", category: "Transport" },
  { date: "2026-02-25", amount: 75.0, vendor: "Internet", description: "Broadband", category: "Utilities" },
];

export function useExpenses() {
  const [rawExpenses, setRawExpenses] = useState<Expense[]>(() => {
    return SAMPLE_EXPENSES.map((e) => ({ ...e, id: uid(), isAnomaly: false }));
  });

  const expenses = useMemo(() => detectAnomalies(rawExpenses), [rawExpenses]);

  const addExpense = useCallback(
    (data: Omit<Expense, "id" | "isAnomaly">) => {
      setRawExpenses((prev) => [...prev, { ...data, id: uid(), isAnomaly: false }]);
    },
    []
  );

  const addExpenses = useCallback(
    (data: Omit<Expense, "id" | "isAnomaly">[]) => {
      setRawExpenses((prev) => [
        ...prev,
        ...data.map((d) => ({ ...d, id: uid(), isAnomaly: false })),
      ]);
    },
    []
  );

  const anomalies = useMemo(() => expenses.filter((e) => e.isAnomaly), [expenses]);

  const monthlyTotals = useMemo(() => {
    const map: Record<string, Record<string, number>> = {};
    for (const e of expenses) {
      const mk = getMonthKey(e.date);
      if (!map[mk]) map[mk] = {};
      map[mk][e.category] = (map[mk][e.category] || 0) + e.amount;
    }
    return Object.entries(map)
      .sort(([a], [b]) => b.localeCompare(a))
      .map(([key, cats]) => ({
        month: getMonthLabel(key),
        monthKey: key,
        ...cats,
        total: Object.values(cats).reduce((s, v) => s + v, 0),
      }));
  }, [expenses]);

  const topVendors = useMemo(() => {
    const map: Record<string, number> = {};
    for (const e of expenses) {
      map[e.vendor] = (map[e.vendor] || 0) + e.amount;
    }
    return Object.entries(map)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([vendor, total]) => ({ vendor, total }));
  }, [expenses]);

  const totalSpent = useMemo(
    () => expenses.reduce((s, e) => s + e.amount, 0),
    [expenses]
  );

  return {
    expenses,
    anomalies,
    monthlyTotals,
    topVendors,
    totalSpent,
    addExpense,
    addExpenses,
  };
}
