import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function SearchInput({
  value,
  onChange,
  placeholder = "Suche ...",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  const [internalValue, setInternalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(internalValue);
    }, 300);
    return () => clearTimeout(timeout);
  }, [internalValue]);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  return (
    <motion.div
      className={cn("relative", className)}
      animate={{ width: isFocused ? "100%" : "12rem" }}
      transition={{ duration: 0.3 }}
    >
      <Search className="text-muted-foreground absolute top-2.5 left-2.5 size-4" />
      <Input
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        placeholder={isFocused ? placeholder : "Suche ..."}
        className="pr-8 pl-8"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      {internalValue && (
        <button
          onClick={() => setInternalValue("")}
          className="text-muted-foreground hover:bg-muted absolute top-2.5 right-2.5 rounded-md p-0.5"
        >
          <X className="size-4" />
        </button>
      )}
    </motion.div>
  );
}
