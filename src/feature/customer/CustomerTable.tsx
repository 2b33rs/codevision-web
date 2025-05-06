import {ColumnDef} from "@tanstack/react-table";
import {DataTable} from "@/components/sidebar/data-table.tsx";
import {Pencil, Trash} from "lucide-react";
import {Customer} from "@/models/user.ts";
import {Button} from "@/components/ui/button.tsx";

const CustomerTable = () => {
  //const { data } = orderApi.useGetOrdersQuery();

    const data: Customer[] = [
        {
            id: "1",
            createdAt: "2024-01-01T10:00:00Z",
            updatedAt: "2024-01-01T10:00:00Z",
            deletedAt: null,
            customerId: "C001",
            companyname: "Musterfirma GmbH",
            address: "Musterstraße 12",
            postalcode: "12345",
            city: "Musterstadt",
            firstname: "Max",
            lastname: "Mustermann",
            phonenumber: "+49 123 4567890",
            mail: "max@musterfirma.de",
        },
        {
            id: "2",
            createdAt: "2024-02-15T14:30:00Z",
            updatedAt: "2024-02-15T14:30:00Z",
            deletedAt: null,
            customerId: "C002",
            companyname: "Beispiel AG",
            address: "Beispielweg 7",
            postalcode: "54321",
            city: "Beispielstadt",
            firstname: "Erika",
            lastname: "Beispiel",
            phonenumber: "+49 987 6543210",
            mail: "erika@beispiel-ag.de",
        },
    ];


    const columns: ColumnDef<Customer>[] = [
    { accessorKey: "customerId", header: "KundenId" },
        { accessorKey: "companyname", header: "Firmenname" },
        { accessorKey: "firstname", header: "Vorname" },
        { accessorKey: "lastname", header: "Nachname" },
        { accessorKey: "address", header: "Straße" },
        { accessorKey: "postalcode", header: "Postleitzahl" },
        { accessorKey: "city", header: "Ort" },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => {
                const customer = row.original;

                return (
                    <div className="flex gap-2 justify-end">
                        {/* Bearbeiten-Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(customer)}
                        >
                            <Pencil className="w-4 h-4" />
                        </Button>

                        {/* Löschen-Button */}
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(customer)}
                        >
                            <Trash className="w-4 h-4" />
                        </Button>
                    </div>
                );
            },
        }
    ];

  const handleEdit = (customer: Customer) => {
    console.log("Bearbeiten:", customer);
    //Bearbeiten Logik hinzufügen
    };

    const handleDelete = (customer: Customer) => {
        console.log("Löschen:", customer);
        // Löschen Logik hinzufügen
  };


    return <DataTable<Customer> data={data} columns={columns} />;
    //return <DataTable data={data || []} columns={columns} />;
};

export default CustomerTable;
