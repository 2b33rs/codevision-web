"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";

const schema = z.object({
  name: z.string().nonempty("Pflichtfeld"),
});

type ProducedOrderForm = z.infer<typeof schema>;

export default function CreateCustomerForm() {
  const form = useForm<ProducedOrderForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = form.handleSubmit((data) => {
    console.log(data);
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="grid max-w-md gap-4">
        Folgende Ware(n) anfordern?
        <ul className="list-inside list-disc">
          <li>Erste Ware mit Farbe und Anzahl</li>
          <li>Zweite Ware mit Farbe und Anzahl</li>
          <li>Dritte Ware mit Farbe und Anzahl</li>
        </ul>
        <Button type="submit">Ware(n) anfordern</Button>
      </form>
    </Form>
  );
}
