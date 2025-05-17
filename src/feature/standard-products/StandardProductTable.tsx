import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/sidebar/data-table.tsx";
import type { Product } from "@/models/product.ts";
import EditableMinStockCell from "@/feature/standard-products/EditableMinStockCell.tsx";
import { productApi } from "@/api/endpoints/productApi.ts";
import { WarehouseOrderCell } from "@/feature/standard-products/WarehouseOrderCell.tsx";
import { Row } from "@/common/flex/Flex.tsx";
import { CMYKColorField } from "@/components/CMYKColorField.tsx";
import { DeleteDropdownButton } from "@/common/DeleteDropdownButton.tsx";
import EditableNameCell from "@/feature/standard-products/EditableNameCell.tsx";
import { Grid2x2Plus } from "lucide-react";

interface StandardProductTableProps {
  setShowModal?: (value: ((prevState: boolean) => boolean) | boolean) => void;
}

const StandardProduct = ({ setShowModal }: StandardProductTableProps) => {
  const { data, isLoading } = productApi.useListProductsQuery();
  const [deleteProduct] = productApi.useDeleteProductMutation();

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "color",
      header: "Farbe",
      cell: ({ row }) => (
        <CMYKColorField value={row.original.color ?? ""} disabled />
      ),
    },
    { accessorKey: "shirtSize", header: "Größe" },
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <EditableNameCell product={row.original} />,
    },
    {
      cell: ({ row }) => <EditableMinStockCell product={row.original} />,
      accessorKey: "minAmount",
      header: "Mindestbestand",
    },

    {
      accessorKey: "currentStock",
      header: "Menge",
      cell: ({ row }) => {
        return <WarehouseOrderCell product={row.original} />;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <Row className="gap-3">
            <DeleteDropdownButton onConfirm={() => deleteProduct(product.id)} />
          </Row>
        );
      },
    },
  ];
  return (
    <DataTable
      data={data || []}
      columns={columns}
      loading={isLoading}
      cta={{
        text: "Standartprodukt hinzufügen",
        icon: Grid2x2Plus,
        onClick: () => {
          setShowModal?.(true);
        },
        isLoading: false,
      }}
    />
  );
};

export default StandardProduct;
