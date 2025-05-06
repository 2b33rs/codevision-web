"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

const schema = z.object({
  product: z.object({
    id: z.coerce.number().int().positive(),
    prodCat: z.string().min(1),
    shirtSize: z.string().min(1),
    color: z.string().min(1),
    minStock: z.coerce.number().positive(),
  }),
});

type OrderForm = z.infer<typeof schema>;

export default function AddStandardProductForm() {
  const form = useForm<OrderForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      product: {
        id: 0,
        prodCat: "T-Shirt",
        shirtSize: "",
        color: "",
        minStock: 0,
      },
    },
  });

  const onSubmit = form.handleSubmit(
    (data) => {
      console.log("✅ Form data:", data);
    },
    (errors) => {
      console.error("❌ Validation errors:", errors);
    }
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="space-y-4 w-[95%] mx-auto px-2">

        {/* product fields */}
        <FormField
          control={form.control}
          name="product.id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID</FormLabel>
              <FormControl>
                <Input type="number" placeholder="ID" {...field} className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="product.prodCat"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Produkt Kategorie</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="product.shirtSize"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Größe</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Größe auswählen" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="XS">XS</SelectItem>
                    <SelectItem value="S">S</SelectItem>
                    <SelectItem value="M">M</SelectItem>
                    <SelectItem value="L">L</SelectItem>
                    <SelectItem value="XL">XL</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="product.color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Farbe (CMYK)</FormLabel>
              <FormControl>
                <Input placeholder={"C:0, M:0, Y:0, K:0"} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="product.minStock"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mindest Lagerbestand</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Mindestbestand" {...field} className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Speichern</Button>
      </form>
    </Form>
  );
}
