import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/sidebar/data-table.tsx";
import type { Product } from "@/models/product.ts";

import { Trash } from "lucide-react";
import EditableMinStockCell from "@/feature/standard-products/EditableMinStockCell.tsx";
import { productApi } from "@/api/endpoints/productApi.ts";
import { WarehouseOrderCell } from "@/feature/standard-products/WarehouseOrderCell.tsx";
import { Row } from "@/common/flex/Flex.tsx";

const StandardProduct = () => {
  const { data, isLoading } = productApi.useListProductsQuery();

  const columns: ColumnDef<Product>[] = [
    { accessorKey: "shirtSize", header: "Größe" },
    { accessorKey: "color", header: "Farbe" },
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
            <Trash
              className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
              onClick={() => console.log("Löschen:", product.id)}
            />
          </Row>
        );
      },
    },
  ];
  return <DataTable data={data || []} columns={columns} loading={isLoading} />;
};

export default StandardProduct;
