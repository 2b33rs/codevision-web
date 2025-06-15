import { useState } from "react";
import { Product } from "@/models/product";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { productApi } from "@/api/endpoints/productApi.ts";
import { toast } from "sonner";

export function WarehouseOrderCell({ product }: { product: Product }) {
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [createProductionOrder] = productApi.useCreateProductionOrderMutation();

  const handleSubmit = async () => {
    const num = parseInt(inputValue, 10);
    if (isNaN(num) || num <= 0) return;

    setIsLoading(true);
    setSuccess(false);

    try {
      await createProductionOrder({
        id: product.id,
        amount: num,
        name: product.name,
        productCategory: product.productCategory,
      });
      toast.success("Produktionsauftrag versendet!");
      setSuccess(true);
      setInputValue("");
    } catch (err) {
      toast.error("Fehler beim Erstellen des Auftrags" + err);
    } finally {
      setIsLoading(false);
    }
  };

  const productionInfo = product.amountInProduction
    ? `${product.amountInProduction} in Produktion`
    : null;

  return (
    <div className="flex items-center gap-3">
      <div className="text-sm font-medium">
        {product.currentStock ?? "—"}
        {productionInfo && (
          <span className="text-muted-foreground ml-2 text-xs">
            ({productionInfo})
          </span>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            title="Produktionsauftrag erstellen"
          >
            <Plus className="text-muted-foreground hover:text-foreground h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="right"
          align="start"
          sideOffset={-95}
          className="w-48 space-y-2 p-2"
        >
          <DropdownMenuLabel className="text-muted-foreground text-xs font-medium">
            Produktionsmenge eingeben
          </DropdownMenuLabel>

          <Input
            type="number"
            placeholder="z. B. 50"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="h-8 px-2 text-sm"
            disabled={isLoading}
          />

          <Button
            size="sm"
            className="w-full text-xs"
            disabled={isLoading}
            onClick={handleSubmit}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            ) : success ? (
              <Check className="mr-2 h-3 w-3 text-green-600" />
            ) : null}
            {success ? "Auftrag gesendet" : "Produktionsauftrag senden"}
          </Button>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
