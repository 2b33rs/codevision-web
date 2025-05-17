import { Product } from "@/models/product";
import { productApi } from "@/api/endpoints/productApi.ts";
import { EditableValueCell } from "@/components/EditableValueCell.tsx";

const EditableMinStockCell = ({ product }: { product: Product }) => {
  const [updateProduct] = productApi.useUpdateProductMutation();

  return (
    <EditableValueCell
      value={product.minAmount}
      onChange={(newValue) => {
        updateProduct({ id: product.id, data: { minAmount: newValue } });
      }}
      label="Mindestbestand ändern"
      title="Mindestbestand bearbeiten"
      inputType={"number"}
    />
  );
};

export default EditableMinStockCell;
