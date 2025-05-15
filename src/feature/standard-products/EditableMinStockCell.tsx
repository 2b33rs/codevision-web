import { Product } from "@/models/product";
import { EditableNumberCell } from "@/feature/standard-products/EditableNumberCell.tsx";

const EditableMinStockCell = ({ product }: { product: Product }) => {
  return (
    <EditableNumberCell
      value={product.minAmount}
      onChange={(newValue) => {
        console.log(`Neuer Mindestbestand für ${product.id}:`, newValue);
        // TODO: hier RTK Mutation oder API-Call
      }}
      label="Mindestbestand ändern"
      title="Mindestbestand bearbeiten"
    />
  );
};

export default EditableMinStockCell;
