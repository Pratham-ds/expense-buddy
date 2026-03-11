import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency, type Expense, CATEGORY_COLORS } from "@/lib/expense-utils";
import { AlertTriangle, List } from "lucide-react";

interface ExpenseTableProps {
  expenses: Expense[];
  showOnlyAnomalies?: boolean;
}

export function ExpenseTable({ expenses, showOnlyAnomalies }: ExpenseTableProps) {
  const filtered = showOnlyAnomalies
    ? expenses.filter((e) => e.isAnomaly)
    : expenses;

  const sorted = [...filtered].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          {showOnlyAnomalies ? (
            <>
              <AlertTriangle className="h-4 w-4 text-anomaly" />
              Anomalies ({sorted.length})
            </>
          ) : (
            <>
              <List className="h-4 w-4 text-primary" />
              Recent Expenses
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-auto max-h-96">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs">Date</TableHead>
                <TableHead className="text-xs">Vendor</TableHead>
                <TableHead className="text-xs">Category</TableHead>
                <TableHead className="text-xs">Description</TableHead>
                <TableHead className="text-xs text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                    {showOnlyAnomalies ? "No anomalies detected 🎉" : "No expenses yet"}
                  </TableCell>
                </TableRow>
              ) : (
                sorted.map((exp) => (
                  <TableRow
                    key={exp.id}
                    className={exp.isAnomaly ? "bg-anomaly-bg" : ""}
                  >
                    <TableCell className="font-mono text-xs">
                      {new Date(exp.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell className="font-medium text-sm">
                      <div className="flex items-center gap-1.5">
                        {exp.isAnomaly && (
                          <AlertTriangle className="h-3.5 w-3.5 text-anomaly flex-shrink-0" />
                        )}
                        {exp.vendor}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="text-xs font-normal"
                        style={{
                          borderLeft: `3px solid ${CATEGORY_COLORS[exp.category] || CATEGORY_COLORS.Other}`,
                        }}
                      >
                        {exp.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                      {exp.description || "—"}
                    </TableCell>
                    <TableCell className="text-right font-mono font-medium text-sm">
                      {formatCurrency(exp.amount)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
