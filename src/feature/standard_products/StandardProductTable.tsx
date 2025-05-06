import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/sidebar/data-table.tsx";
//import { orderApi } from "@/api/endpoints/orderApi.ts";
import type { StandardProduct } from "@/models/standardProduct.ts";
import EditableMinStockCell from "@/feature/standard_products/EditableMinStockCell.tsx";
import WarehouseOrderCell from "@/feature/standard_products/WarehouseOrderCell.tsx";
import { Trash } from "lucide-react";

const StandardProduct = () => {
  //const { data } = orderApi.useGetOrdersQuery();
  const dummyData: StandardProduct[] = [
    {
      id: "1",
      ProdCat: "T-Shirt",
      shirtSize: "M",
      color: "0, 0, 0, 0",
      minStock: 10,
      currentStock: 50,
    },
    {
      id: "2",
      ProdCat: "T-Shirt",
      shirtSize: "L",
      color: "50, 50, 50, 50",
      minStock: 5,
      currentStock: 20,
    },
    {
      id: "3",
      ProdCat: "T-Shirt",
      shirtSize: "S",
      color: "20, 20, 20",
      minStock: 3,
      currentStock: 15,
    },
  ];

  const data = dummyData;

  const columns: ColumnDef<StandardProduct>[] = [
    { accessorKey: "id", header: "ProduktID" },
    { accessorKey: "ProdCat", header: "Kategorie" },
    { accessorKey: "shirtSize", header: "Größe" },
    { accessorKey: "color", header: "Farbe (CMYK)" },
    {
      cell: ({ row }) => <EditableMinStockCell product={row.original} />,
      accessorKey: "minStock",
      header: "Mindest Lagermenge",
    },

    { accessorKey: "currentStock", header: "Aktuelle Lagermenge" },
    {
      id: "actions",
      header: "Aktionen",
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex gap-3">
            <WarehouseOrderCell product={product} />
            <span title="Standartprodukt löschen">
              <Trash
                className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"
                onClick={() => console.log("Löschen:", product.id)}
              />
            </span>
          </div>
        );
      },
    },
  ];
  return <DataTable data={data} columns={columns} />;

  //return <DataTable data={data || []} columns={columns} />;
};

export default StandardProduct;
