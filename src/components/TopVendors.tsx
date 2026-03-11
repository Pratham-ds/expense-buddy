import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/expense-utils";
import { Store } from "lucide-react";

interface TopVendorsProps {
  vendors: { vendor: string; total: number }[];
  totalSpent: number;
}

export function TopVendors({ vendors, totalSpent }: TopVendorsProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Store className="h-4 w-4 text-primary" />
          Top 5 Vendors
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {vendors.map((v, i) => {
          const pct = totalSpent > 0 ? (v.total / totalSpent) * 100 : 0;
          return (
            <div key={v.vendor} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="font-mono text-xs text-muted-foreground w-4">
                    #{i + 1}
                  </span>
                  {v.vendor}
                </span>
                <span className="font-mono font-medium">
                  {formatCurrency(v.total)}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
        {vendors.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            No data yet
          </p>
        )}
      </CardContent>
    </Card>
  );
}
