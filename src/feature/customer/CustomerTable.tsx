import { Order } from "@/models/order.ts";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/sidebar/data-table.tsx";
import { orderApi } from "@/api/endpoints/orderApi.ts";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";

const CustomerTable = () => {
  const { data } = orderApi.useGetOrdersQuery();
  const columns: ColumnDef<Order>[] = [
    { accessorKey: "customerid", header: "KundenId" },
    { accessorKey: "companyname", header: "Firmenname" },
    { accessorKey: "firstname", header: "Vorname" },
    { accessorKey: "lastname", header: "Nachname" },
    { accessorKey: "address", header: "Straße" },
    { accessorKey: "postalcode", header: "Postleitzahl" },
    { accessorKey: "city", header: "Ort" },

    {
      id: "actions",
      header: "", // optional: leer lassen, damit keine Überschrift erscheint
      cell: ({ row }) => {
        const customer = row.original; // Zugriff auf die Daten der aktuellen Zeile

        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(customer)}
            className="ml-auto" // schiebt den Button nach rechts
          >
            <Pencil className="mr-2 h-4 w-4" />
            Bearbeiten
          </Button>
        );
      },
    },
  ];

  const handleEdit = (customer: Order) => {
    console.log("Bearbeiten:", customer);
    //Bearbeiten-Seite hinzufügen
  };

  return <DataTable data={data || []} columns={columns} />;
};

export default CustomerTable;
