import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, type Expense } from "@/lib/expense-utils";
import { DollarSign, AlertTriangle, TrendingUp, BarChart3 } from "lucide-react";

interface StatsCardsProps {
  totalSpent: number;
  expenseCount: number;
  anomalyCount: number;
  categoryCount: number;
}

export function StatsCards({
  totalSpent,
  expenseCount,
  anomalyCount,
  categoryCount,
}: StatsCardsProps) {
  const stats = [
    {
      label: "Total Spent",
      value: formatCurrency(totalSpent),
      icon: DollarSign,
      accent: "text-primary",
      bg: "bg-primary/10",
    },
    {
      label: "Expenses",
      value: expenseCount.toString(),
      icon: BarChart3,
      accent: "text-chart-transport",
      bg: "bg-chart-transport/10",
    },
    {
      label: "Categories",
      value: categoryCount.toString(),
      icon: TrendingUp,
      accent: "text-chart-shopping",
      bg: "bg-chart-shopping/10",
    },
    {
      label: "Anomalies",
      value: anomalyCount.toString(),
      icon: AlertTriangle,
      accent: anomalyCount > 0 ? "text-anomaly" : "text-muted-foreground",
      bg: anomalyCount > 0 ? "bg-anomaly/10" : "bg-muted",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((s) => (
        <Card key={s.label}>
          <CardContent className="p-4 flex items-center gap-3">
            <div className={`p-2 rounded-lg ${s.bg}`}>
              <s.icon className={`h-5 w-5 ${s.accent}`} />
            </div>
            <div>
              <p className="text-2xl font-bold tracking-tight">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
