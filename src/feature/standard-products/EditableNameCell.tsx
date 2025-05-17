import { EditableValueCell } from "@/components/EditableValueCell.tsx";
import { productApi } from "@/api/endpoints/productApi.ts";
import { Product } from "@/models/product.ts";
import { Pencil } from "lucide-react";

export default function EditableNameCell({ product }: { product: Product }) {
  const [updateProduct] = productApi.useUpdateProductMutation();

  return (
    <EditableValueCell
      value={product.name}
      onChange={(newValue) =>
        updateProduct({ id: product.id, data: { name: newValue } })
      }
      label="Produktname ändern"
      title="Produktname bearbeiten"
      inputType="text"
      icon={Pencil}
    />
  );
}
