import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/sidebar/data-table.tsx";
import type { Product } from "@/models/product.ts";
import EditableMinStockCell from "@/feature/standard-products/EditableMinStockCell.tsx";
import { productApi } from "@/api/endpoints/productApi.ts";
import { WarehouseOrderCell } from "@/feature/standard-products/WarehouseOrderCell.tsx";
import { Col, Row } from "@/common/flex/Flex.tsx";
import { CMYKColorField } from "@/components/CMYKColorField.tsx";
import { DeleteDropdownButton } from "@/common/DeleteDropdownButton.tsx";
import { ProductOrdersCell } from "@/feature/standard-products/ProductOrdersCell.tsx";
import { SearchInput } from "@/components/ui/search-input.tsx";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Grid2x2Plus } from "lucide-react";

interface StandardProductTableProps {
  setShowModal?: (value: ((prevState: boolean) => boolean) | boolean) => void;
}

const StandardProduct = ({ setShowModal }: StandardProductTableProps) => {
  const [search, setSearch] = useState("");
  const { data, isLoading } = productApi.useListProductsQuery({
    query: search,
  });
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
      cell: ({ row }) => row.original.name,
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
      accessorKey: "orders",
      header: "",
      cell: ({ row }) => {
        return <ProductOrdersCell product={row.original} />;
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
    <Col f1 gap={0}>
      <DataTable
        toolbar={
          <Row className="w-full justify-between gap-2">
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Suche nach Name oder Farbe ..."
              className="max-w-sm"
            />
            <Button onClick={() => setShowModal?.(true)} variant="default">
              <Grid2x2Plus className="mr-2 h-4 w-4" />
              Standardprodukt hinzufügen
            </Button>
          </Row>
        }
        data={data || []}
        columns={columns}
        loading={isLoading}
        initialSorting={[{ id: "name", desc: false }]}
      />
    </Col>
  );
};

export default StandardProduct;
