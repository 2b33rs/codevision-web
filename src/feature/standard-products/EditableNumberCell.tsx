import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { useState } from "react";

type EditableNumberCellProps = {
  value: number | undefined | null;
  onChange: (newValue: number) => void;
  label?: string;
  title?: string;
};

export function EditableNumberCell({
  value,
  onChange,
  label = "Wert ändern",
  title = "Bearbeiten",
}: EditableNumberCellProps) {
  const [inputValue, setInputValue] = useState(value?.toString() ?? "0");

  return (
    <div className="flex items-center gap-2">
      <span>{value ?? "—"}</span>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" title={title}>
            <Plus className="text-muted-foreground hover:text-foreground h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="right"
          align="start"
          sideOffset={-95}
          className="w-40 space-y-2 p-2"
        >
          <DropdownMenuLabel className="text-muted-foreground text-xs font-medium">
            {label}
          </DropdownMenuLabel>

          <Input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="h-8 px-2 text-sm"
          />

          <Button
            size="sm"
            className="w-full text-xs"
            onClick={() => {
              const num = parseInt(inputValue, 10);
              if (!isNaN(num)) {
                onChange(num);
              }
            }}
          >
            Speichern
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
