import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchInput({
  value,
  onChange,
  placeholder = "Suchen ...",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative w-full", className)}>
      <Search className="text-muted-foreground absolute top-2.5 left-2.5 size-4" />
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="pr-8 pl-8"
      />
      {value && (
        <button
          onClick={() => onChange("")}
          className="text-muted-foreground hover:bg-muted absolute top-2.5 right-2.5 rounded-md p-0.5"
        >
          <X className="size-4" />
        </button>
      )}
    </div>
  );
}
