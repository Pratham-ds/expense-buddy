import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CATEGORY_COLORS, formatCurrency } from "@/lib/expense-utils";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface CategoryChartProps {
  monthlyTotals: Record<string, any>[];
}

export function CategoryChart({ monthlyTotals }: CategoryChartProps) {
  // Aggregate all categories across months
  const categoryTotals: Record<string, number> = {};
  const latestMonth = monthlyTotals[0];

  if (latestMonth) {
    for (const [key, val] of Object.entries(latestMonth)) {
      if (key !== "month" && key !== "monthKey" && key !== "total" && typeof val === "number") {
        categoryTotals[key] = (categoryTotals[key] || 0) + val;
      }
    }
  }

  const data = Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value: Math.round(value * 100) / 100,
      fill: CATEGORY_COLORS[name] || CATEGORY_COLORS.Other,
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">
          {latestMonth ? `${latestMonth.month} Breakdown` : "Category Breakdown"}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No data yet
          </p>
        ) : (
          <div className="flex items-center gap-4">
            <div className="w-40 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={35}
                    outerRadius={70}
                    strokeWidth={2}
                    stroke="hsl(var(--card))"
                  >
                    {data.map((entry) => (
                      <Cell key={entry.name} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(val: number) => formatCurrency(val)}
                    contentStyle={{
                      background: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: "13px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-2">
              {data.map((d) => (
                <div key={d.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: d.fill }}
                    />
                    <span>{d.name}</span>
                  </div>
                  <span className="font-mono font-medium">
                    {formatCurrency(d.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
