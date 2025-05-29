import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { customerApi } from "@/api/endpoints/customerApi.ts";
import { UseFormReturn } from "react-hook-form";
import { OrderForm } from "@/models/order.ts";
import { useState, useMemo } from "react";

export default function CustomerSelect({
                                         form,
                                       }: {
  form: UseFormReturn<OrderForm>;
}) {
  const { data: customers = [], isLoading } = customerApi.useListCustomersQuery();
  const [search, setSearch] = useState("");
  const [selectedCustomerLabel, setSelectedCustomerLabel] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const filteredCustomers = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term && isFocused) return customers;
    return customers.filter((c) =>
      `${c.name} ${c.email}`.toLowerCase().includes(term)
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
                placeholder="Kundenname oder E-Mail suchen"
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
                <div className="absolute left-0 right-0 mt-1 z-50">
                  <ScrollArea className="rounded-md border bg-background shadow max-h-[260px] overflow-auto">
                    {filteredCustomers.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        Kein Kunde gefunden
                      </div>
                    ) : (
                      filteredCustomers.map((c) => (
                        <Card
                          key={c.id}
                          onClick={() =>
                            handleSelectCustomer(c.id, `${c.name} (${c.email})`)
                          }
                          className="cursor-pointer p-2 hover:bg-accent"
                        >
                          <div className="space-y-0.5 leading-tight">
                            <div className="font-medium">{c.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {c.email}
                            </div>
                          </div>
                        </Card>
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
