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
}: {
  form: UseFormReturn<OrderForm>;
  fields: FieldArrayWithId<OrderForm, "positions", "id">[];
  append: UseFieldArrayAppend<OrderForm>;
  remove: UseFieldArrayRemove;
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium">Positionen</h3>
      <div className="max-h-[400px] space-y-6 overflow-y-auto pr-2">
        {fields.map((field, index) => (
          <PositionItem
            key={field.id}
            form={form}
            index={index}
            remove={remove}
          />
        ))}
      </div>
      <Button
        type="button"
        variant={"ghost"}
        size="icon"
        onClick={() =>
          append({
            amount: 1,
            pos_number: fields.length + 1,
            name: "",
            productCategory: "T_SHIRT",
            color: "cmyk(0,0,0,100)",
            shirtSize: "M",
            design: "",
            description: null,
          })
        }
      >
        <Plus></Plus>
      </Button>
    </div>
  );
}
