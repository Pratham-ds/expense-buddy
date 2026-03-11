import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categorizeVendor, type Category } from "@/lib/expense-utils";
import { Plus } from "lucide-react";

interface AddExpenseFormProps {
  onAdd: (data: {
    date: string;
    amount: number;
    vendor: string;
    description: string;
    category: Category;
  }) => void;
}

export function AddExpenseForm({ onAdd }: AddExpenseFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [amount, setAmount] = useState("");
  const [vendor, setVendor] = useState("");
  const [description, setDescription] = useState("");

  const detectedCategory = vendor ? categorizeVendor(vendor) : null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!date || isNaN(parsedAmount) || parsedAmount <= 0 || !vendor.trim()) return;

    onAdd({
      date,
      amount: parsedAmount,
      vendor: vendor.trim(),
      description: description.trim(),
      category: categorizeVendor(vendor),
    });

    setAmount("");
    setVendor("");
    setDescription("");
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <Plus className="h-5 w-5 text-primary" />
          Add Expense
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="amount">Amount ($)</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="vendor">Vendor Name</Label>
            <div className="relative">
              <Input
                id="vendor"
                placeholder="e.g., Swiggy, Amazon, Uber..."
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                required
              />
              {detectedCategory && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                  {detectedCategory}
                </span>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              placeholder="Optional note..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">
            Add Expense
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
