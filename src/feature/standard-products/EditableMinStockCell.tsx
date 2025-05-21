import { Product } from "@/models/product";
import { productApi } from "@/api/endpoints/productApi.ts";
import { EditableValueCell } from "@/components/EditableValueCell.tsx";
import { PencilRuler } from "lucide-react";

const EditableMinStockCell = ({ product }: { product: Product }) => {
  const [updateProduct] = productApi.useUpdateProductMutation();

  return (
    <EditableValueCell
      value={product.minAmount}
      onChange={(newValue) => {
        updateProduct({ id: product.id, data: { minAmount: newValue } });
      }}
      label="Mindestbestand ändern"
      icon={PencilRuler}
      title="Mindestbestand bearbeiten"
      inputType={"number"}
    />
  );
};

export default EditableMinStockCell;
