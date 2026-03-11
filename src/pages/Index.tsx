import { useExpenses } from "@/hooks/use-expenses";
import { StatsCards } from "@/components/StatsCards";
import { AddExpenseForm } from "@/components/AddExpenseForm";
import { CSVUpload } from "@/components/CSVUpload";
import { CategoryChart } from "@/components/CategoryChart";
import { TopVendors } from "@/components/TopVendors";
import { ExpenseTable } from "@/components/ExpenseTable";
import { CATEGORIES } from "@/lib/expense-utils";
import { Wallet } from "lucide-react";

const Index = () => {
  const {
    expenses,
    anomalies,
    monthlyTotals,
    topVendors,
    totalSpent,
    addExpense,
    addExpenses,
  } = useExpenses();

  const uniqueCategories = new Set(expenses.map((e) => e.category));

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Wallet className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">ExpenseIQ</h1>
            <p className="text-xs text-muted-foreground">
              Smart expense tracking with anomaly detection
            </p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <StatsCards
          totalSpent={totalSpent}
          expenseCount={expenses.length}
          anomalyCount={anomalies.length}
          categoryCount={uniqueCategories.size}
        />

        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-6">
          <AddExpenseForm onAdd={addExpense} />
          <CSVUpload onUpload={addExpenses} />
        </div>

        {/* Dashboard Charts */}
        <div className="grid md:grid-cols-2 gap-6">
          <CategoryChart monthlyTotals={monthlyTotals} />
          <TopVendors vendors={topVendors} totalSpent={totalSpent} />
        </div>

        {/* Anomalies */}
        {anomalies.length > 0 && (
          <ExpenseTable expenses={expenses} showOnlyAnomalies />
        )}

        {/* All Expenses */}
        <ExpenseTable expenses={expenses} />
      </main>
    </div>
  );
};

export default Index;
