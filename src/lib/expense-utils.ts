// Vendor-to-category mapping
export const VENDOR_CATEGORY_MAP: Record<string, string> = {
  // Food & Dining
  swiggy: "Food",
  zomato: "Food",
  uber_eats: "Food",
  doordash: "Food",
  grubhub: "Food",
  mcdonalds: "Food",
  starbucks: "Food",
  dominos: "Food",
  subway: "Food",
  kfc: "Food",
  pizza_hut: "Food",

  // Transport
  uber: "Transport",
  lyft: "Transport",
  ola: "Transport",
  rapido: "Transport",
  shell: "Transport",
  bp: "Transport",
  parking: "Transport",

  // Shopping
  amazon: "Shopping",
  flipkart: "Shopping",
  walmart: "Shopping",
  target: "Shopping",
  ebay: "Shopping",
  ikea: "Shopping",

  // Entertainment
  netflix: "Entertainment",
  spotify: "Entertainment",
  disney: "Entertainment",
  hulu: "Entertainment",
  youtube: "Entertainment",
  cinema: "Entertainment",
  steam: "Entertainment",

  // Utilities
  electricity: "Utilities",
  water: "Utilities",
  gas: "Utilities",
  internet: "Utilities",
  phone: "Utilities",
  verizon: "Utilities",
  att: "Utilities",
  comcast: "Utilities",
};

export const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Entertainment",
  "Utilities",
  "Other",
] as const;

export type Category = (typeof CATEGORIES)[number];

export const CATEGORY_COLORS: Record<string, string> = {
  Food: "hsl(160, 84%, 39%)",
  Transport: "hsl(200, 80%, 50%)",
  Shopping: "hsl(280, 70%, 55%)",
  Entertainment: "hsl(38, 92%, 50%)",
  Utilities: "hsl(340, 75%, 55%)",
  Other: "hsl(220, 10%, 60%)",
};

export interface Expense {
  id: string;
  date: string;
  amount: number;
  vendor: string;
  description: string;
  category: Category;
  isAnomaly: boolean;
}

export function categorizeVendor(vendor: string): Category {
  const normalized = vendor.toLowerCase().replace(/[\s\-_.]+/g, "_").trim();
  for (const [key, cat] of Object.entries(VENDOR_CATEGORY_MAP)) {
    if (normalized.includes(key)) return cat as Category;
  }
  return "Other";
}

export function detectAnomalies(expenses: Expense[]): Expense[] {
  const categoryAverages: Record<string, { total: number; count: number }> = {};

  for (const exp of expenses) {
    if (!categoryAverages[exp.category]) {
      categoryAverages[exp.category] = { total: 0, count: 0 };
    }
    categoryAverages[exp.category].total += exp.amount;
    categoryAverages[exp.category].count += 1;
  }

  return expenses.map((exp) => {
    const stats = categoryAverages[exp.category];
    const avg = stats ? stats.total / stats.count : 0;
    return { ...exp, isAnomaly: avg > 0 && exp.amount > 3 * avg };
  });
}

export function parseCSV(csvText: string): Omit<Expense, "id" | "isAnomaly">[] {
  const lines = csvText.trim().split("\n");
  if (lines.length < 2) return [];

  const header = lines[0].toLowerCase().split(",").map((h) => h.trim());
  const dateIdx = header.findIndex((h) => h.includes("date"));
  const amountIdx = header.findIndex((h) => h.includes("amount"));
  const vendorIdx = header.findIndex(
    (h) => h.includes("vendor") || h.includes("merchant") || h.includes("name")
  );
  const descIdx = header.findIndex(
    (h) => h.includes("desc") || h.includes("note") || h.includes("memo")
  );

  if (dateIdx === -1 || amountIdx === -1 || vendorIdx === -1) return [];

  const results: Omit<Expense, "id" | "isAnomaly">[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
    if (cols.length < 3) continue;

    const amount = parseFloat(cols[amountIdx]);
    if (isNaN(amount) || amount <= 0) continue;

    const vendor = cols[vendorIdx] || "Unknown";
    const category = categorizeVendor(vendor);

    results.push({
      date: cols[dateIdx] || new Date().toISOString().split("T")[0],
      amount,
      vendor,
      description: descIdx !== -1 ? cols[descIdx] || "" : "",
      category,
    });
  }

  return results;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function getMonthKey(date: string): string {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function getMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}
