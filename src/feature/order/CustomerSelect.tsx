import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { customerApi } from "@/api/endpoints/customerApi.ts";
import { UseFormReturn } from "react-hook-form";
import { OrderForm } from "@/models/order.ts";
import { useMemo, useState } from "react";

export default function CustomerSelect({
  form,
}: {
  form: UseFormReturn<OrderForm>;
}) {
  const { data: customers = [], isLoading } =
    customerApi.useListCustomersQuery();
  const [search, setSearch] = useState("");
  const [selectedCustomerLabel, setSelectedCustomerLabel] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const filteredCustomers = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term && isFocused) return customers;
    return customers.filter((c) =>
      `${c.name} ${c.email}`.toLowerCase().includes(term),
    );
  }, [customers, search, isFocused]);

  const handleSelectCustomer = (id: string, label: string) => {
    form.setValue("customerId", id);
    setSelectedCustomerLabel(label);
    setSearch(""); // schließt Dropdown
    setIsFocused(false); // Dropdown schließen
  };

  return (
    <FormField
      control={form.control}
      name="customerId"
      render={() => (
        <FormItem>
          <FormLabel>Kunde</FormLabel>
          <FormControl>
            <div className="relative">
              <Input
                tabIndex={-1}
                autoComplete="off"
                placeholder="Nach Kunde suchen..."
                value={search || selectedCustomerLabel}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setTimeout(() => setIsFocused(false), 100)} // kurz verzögern, damit Klicks funktionieren
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSelectedCustomerLabel(""); // Reset beim Tippen
                }}
                disabled={isLoading}
              />

              {isFocused && (
                <div className="absolute right-0 left-0 z-50 mt-1">
                  <ScrollArea className="bg-background max-h-[260px] overflow-auto rounded-md border shadow">
                    {filteredCustomers.length === 0 ? (
                      <div className="text-muted-foreground p-2 text-sm">
                        Kein Kunde gefunden
                      </div>
                    ) : (
                      filteredCustomers.map((c) => (
                        <button
                          type="button"
                          key={c.id}
                          onPointerDown={() =>
                            handleSelectCustomer(c.id, `${c.name} (${c.email})`)
                          }
                          className="hover:bg-accent hover:text-accent-foreground relative flex w-full cursor-default items-start gap-2 rounded-sm px-2 py-1.5 text-left text-sm outline-none select-none"
                        >
                          <div className="space-y-0.5 leading-tight">
                            <div>{c.name}</div>
                            <div className="text-muted-foreground text-sm">
                              {c.email}
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </ScrollArea>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
