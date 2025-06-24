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
import { useProductCategories } from "@/hooks/useProductCategories.ts";
import { useProductTypes } from "@/hooks/useProductTypes.ts";
import { useProductSizes } from "@/hooks/useProductSizes.ts";

interface CreateOrderFormProps {
  setShowModal?: (value: ((prevState: boolean) => boolean) | boolean) => void;
}

export default function CreateOrderForm({
  setShowModal,
}: CreateOrderFormProps) {
  const [createOrder, { isLoading }] = orderApi.useCreateOrderMutation();

  const categories = useProductCategories();
  const typen = useProductTypes();
  const groessen = useProductSizes();

  const productCategory = categories[0] || "T-Shirt";

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
          price: "0,00",
          isFromTemplate: false,
          name:""
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
      console.log("📦 Gesendeter Body:", data);
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
        <Button type="submit" className={"ml-auto"} disabled={isLoading}>
          {isLoading ? "Wird erstellt..." : "Bestellung aufgeben"}
        </Button>
      </form>
    </Form>
  );
}
