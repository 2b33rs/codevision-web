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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";

const schema = z.object({
    orderId: z.string().min(1)
});

type OrderForm = z.infer<typeof schema>;

export default function AddStandardProductForm() {
  const form = useForm<OrderForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      orderId: undefined,
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
          name="orderId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bestellnummer</FormLabel>
              <FormControl>
                <Input type="string" placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" {...field} className="w-full [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Suchen</Button>
      </form>
    </Form>
  );
}
