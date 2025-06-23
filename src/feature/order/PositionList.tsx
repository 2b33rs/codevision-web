import { Button } from "@/components/ui/button";
import PositionItem from "@/feature/order/PositionItem.tsx";
import {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormReturn,
} from "react-hook-form";
import { OrderForm } from "@/models/order.ts";
import { Plus } from "lucide-react";

export default function PositionList({
  form,
  fields,
  append,
  remove,
  groessen,
  typen,
}: {
  form: UseFormReturn<OrderForm>;
  fields: FieldArrayWithId<OrderForm, "positions", "id">[];
  append: UseFieldArrayAppend<OrderForm>;
  remove: UseFieldArrayRemove;
  groessen: string[];
  typen: string[];
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Positionen</h3>
      <div className="max-h-[60vh] space-y-6 overflow-y-auto pr-2">
        {fields.map((field, index) => (
          <PositionItem
            key={field.id}
            form={form}
            index={index}
            remove={remove}
            groessen={groessen}
            typen={typen}
          />
        ))}
        <Button
          type="button"
          variant={"ghost"}
          size="icon"
          onClick={() =>
            append({
              amount: 1,
              pos_number: fields.length + 1,
              name: "",
              productCategory: "T-Shirt",
              color: "cmyk(0,0,0,100)",
              shirtSize: groessen[0] ?? "",
              design: typen[0] ?? "",
              typ: typen[0] ? [typen[0]] : [],
              description: null,
              price: "0,00",
            })
          }
        >
          <Plus></Plus>
        </Button>
      </div>
    </div>
  );
}
