import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parseCSV, type Expense } from "@/lib/expense-utils";
import { Upload, FileText, CheckCircle } from "lucide-react";

interface CSVUploadProps {
  onUpload: (data: Omit<Expense, "id" | "isAnomaly">[]) => void;
}

export function CSVUpload({ onUpload }: CSVUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [count, setCount] = useState(0);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCSV(text);
      if (parsed.length > 0) {
        onUpload(parsed);
        setCount(parsed.length);
        setStatus("success");
        setTimeout(() => setStatus("idle"), 3000);
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".csv")) handleFile(file);
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Upload CSV
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer"
          onClick={() => fileRef.current?.click()}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".csv"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          {status === "success" ? (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="h-8 w-8 text-primary" />
              <p className="text-sm font-medium text-primary">
                {count} expenses imported!
              </p>
            </div>
          ) : status === "error" ? (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-destructive" />
              <p className="text-sm text-destructive">
                Could not parse CSV. Need: date, amount, vendor columns.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Drop a CSV file or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Columns: date, amount, vendor/merchant, description (optional)
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
