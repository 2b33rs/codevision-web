"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import CustomerSelect from "./CustomerSelect";
import PositionList from "./PositionList";
import { OrderForm, orderSchema } from "@/models/order.ts";
import { orderApi } from "@/api/endpoints/orderApi.ts";
import { toast } from "sonner";
import { mawiApi } from "@/api/endpoints/mawiApi.ts";

interface CreateOrderFormProps {
  setShowModal?: (value: ((prevState: boolean) => boolean) | boolean) => void;
}

export default function CreateOrderForm({
  setShowModal,
}: CreateOrderFormProps) {
  const [createOrder] = orderApi.useCreateOrderMutation();
  const { data: categoryData } = mawiApi.useGetCategoriesQuery();

  const fallbackGroessen = ["XS", "S", "M", "L", "XL"];
  const fallbackTypen = [
    "Sport",
    "Rundhals",
    "Oversize",
    "Top",
    "V-Ausschnitt",
    "Bedruckt",
  ];
  const fallbackKategorie = "T-Shirt";

  const groessen = categoryData?.[0]?.groessen?.length
    ? categoryData[0].groessen
    : fallbackGroessen;

  const typen = categoryData?.[0]?.typen?.length
    ? categoryData[0].typen
    : fallbackTypen;

  const productCategory = categoryData?.[0]?.kategorie || fallbackKategorie;

  const form = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      positions: [
        {
          productCategory,
          amount: 0,
          shirtSize: undefined,
          color: "cmyk(0,0,0,0)",
          design: "",
          price: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "positions",
  });

  const onSubmit = form.handleSubmit(
    async (data) => {
      console.log("📦 Gesendeter Body:", data); // <-- Hier wird der Body geloggt
      try {
        const result = await createOrder(data).unwrap();
        toast.success("Bestellung erstellt:", result);
        form.reset();
        setShowModal?.(false);
      } catch (err) {
        console.error("❌ Fehler beim Absenden:", err);
        toast.error(
          "Fehler beim Erstellen der Bestellung:" + JSON.stringify(err),
        );
      }
    },
    (errors) => {
      toast.error("❌ Validierungsfehler:" + JSON.stringify(errors));
    },
  );

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col space-y-4">
        <CustomerSelect form={form} />
        <PositionList
          form={form}
          fields={fields}
          append={append}
          remove={remove}
          groessen={groessen}
          typen={typen}
        />
        <Button type="submit" className={"ml-auto"}>
          Bestellung aufgeben
        </Button>
      </form>
    </Form>
  );
}
