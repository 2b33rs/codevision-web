import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { SquarePlus } from "lucide-react";
import React from "react";
import { StandardProduct } from "@/models/standardProduct.ts";

const WarehouseOrderCell = ({ product }: { product: StandardProduct }) => {
  const [inputValue, setInputValue] = React.useState(
    product.minStock.toString(),
  );

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <span title="Produktionsauftrag erstellen">
            <SquarePlus className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white" />
          </span>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="right"
          align="start"
          sideOffset={-95}
          className="z-50 w-36 space-y-2 rounded-md border border-gray-200 bg-white p-2 shadow-md dark:border-zinc-700 dark:bg-zinc-900"
        >
          <DropdownMenuLabel className="px-1 text-xs font-medium text-gray-700 dark:text-gray-300">
            Produktionsauftrag
          </DropdownMenuLabel>
          <div className="flex flex-col gap-1">
            <input
              type="number"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="w-full rounded-sm border border-gray-300 bg-gray-100 px-1.5 py-1 text-xs text-gray-900 dark:border-gray-600 dark:bg-zinc-800 dark:text-white"
            />
            <button
              onClick={() => {
                console.log(
                  `Produktionsauftrag für ${product.id}:`,
                  inputValue,
                );
              }}
              className="w-full rounded-sm bg-gray-200 px-2 py-0.5 text-[11px] font-medium text-gray-800 transition hover:bg-gray-300 dark:bg-zinc-700 dark:text-white dark:hover:bg-zinc-600"
            >
              Beauftragen
            </button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default WarehouseOrderCell;
