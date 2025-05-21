import { HTMLInputTypeAttribute, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { Button } from "@/components/ui/button.tsx";
import { LucideIcon, Plus } from "lucide-react";
import { Input } from "@/components/ui/input.tsx";

type EditableValueCellProps<T> = {
  value: T | undefined | null;
  onChange: (newValue: T) => void;
  label?: string;
  title?: string;
  inputType?: HTMLInputTypeAttribute | undefined;
  icon?: LucideIcon;
};

export function EditableValueCell<T extends string | number>({
  value,
  onChange,
  icon = Plus,
  label = "Wert ändern",
  title = "Bearbeiten",
  inputType = "text",
}: EditableValueCellProps<T>) {
  const [inputValue, setInputValue] = useState(value?.toString() ?? "");
  const [dropdownMenuOpen, setDropdownMenuOpen] = useState(false);

  const Icon = icon;

  return (
    <div className="group flex items-center gap-2">
      <span>{value ?? "—"}</span>

      <DropdownMenu onOpenChange={setDropdownMenuOpen} open={dropdownMenuOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            className="h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100"
            title={title}
            variant="ghost"
            size="icon"
          >
            <Icon className="text-muted-foreground hover:text-foreground h-4 w-4" />
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
            type={inputType}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="h-8 px-2 text-sm"
          />

          <Button
            size="sm"
            className="w-full text-xs"
            onClick={() => {
              let castValue: T;
              if (inputType === "number") {
                const num = parseFloat(inputValue);
                if (isNaN(num)) return;
                castValue = num as T;
              } else {
                castValue = inputValue as T;
              }
              onChange(castValue);
              setDropdownMenuOpen(false);
            }}
          >
            Speichern
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
