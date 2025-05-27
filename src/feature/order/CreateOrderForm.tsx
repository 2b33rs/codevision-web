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

interface CreateOrderFormProps {
  setShowModal?: (value: ((prevState: boolean) => boolean) | boolean) => void;
}

export default function CreateOrderForm({
  setShowModal,
}: CreateOrderFormProps) {
  const [createOrder] = orderApi.useCreateOrderMutation();

  const form = useForm<OrderForm>({
    resolver: zodResolver(orderSchema),
    // Beispiel-Objekt für eine leere Position mit Standardwerten
    defaultValues: {
      positions: [
        {
          productCategory: "T_SHIRT",
          amount: 0,
          shirtSize: undefined,
          color: "",
          design: "",
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

      const formatted = {
        customerId: data.customerId,
        positions: data.positions.map((pos, i) => ({
          amount: pos.amount,
          pos_number: i,
          name: pos.name ,
          productCategory: pos.productCategory,
          design: pos.design ,
          color: pos.color ,
          shirtSize: pos.shirtSize ,
          description: pos.description,
          standardProductId:
            pos.standardProductId,
        })),
      };


      console.log(JSON.stringify(formatted, null, 2));

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
    (errors) => console.error("❌ Validierungsfehler:", errors),
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
        />
        <Button type="submit" className={"ml-auto"}>
          Bestellung aufgeben
        </Button>
      </form>
    </Form>
  );
}
