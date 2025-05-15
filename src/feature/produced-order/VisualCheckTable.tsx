import {ColumnDef} from "@tanstack/react-table";
import {DataTable} from "@/components/sidebar/data-table.tsx";
import {ProducedOrder} from "@/models/produced_order.ts";
import {Button} from "@/components/ui/button.tsx";
import {Play} from "lucide-react";

const ProducedOrderTable = () => {
    //const { data } = orderApi.useGetOrdersQuery();

    //DummyDaten
    const dummyProducedOrders: ProducedOrder[] = [
        {
            id: "1",
            createdAt: "2024-04-01T08:30:00Z",
            updatedAt: "2024-04-01T08:30:00Z",
            deletedAt: null,
            customerId: "CUST001",
            ordernumber: "ORD-1001",
            position: "T-Shirt Classic – Blau – M",
            count: 50,
            companyname: "BlueWear GmbH",
            address: "Fabrikstraße 12",
            postalcode: "70173",
            city: "Stuttgart",
        },
        {
            id: "2",
            createdAt: "2024-04-05T14:00:00Z",
            updatedAt: "2024-04-06T09:20:00Z",
            deletedAt: null,
            customerId: "CUST002",
            ordernumber: "ORD-1002",
            position: "T-Shirt Premium – Schwarz – L",
            count: 25,
            companyname: "StylePro AG",
            address: "Modering 45",
            postalcode: "20095",
            city: "Hamburg",
        },
        {
            id: "3",
            createdAt: "2024-04-10T11:45:00Z",
            updatedAt: "2024-04-10T11:45:00Z",
            deletedAt: null,
            customerId: "CUST003",
            ordernumber: "ORD-1003",
            position: "Poloshirt – Weiß – XL",
            count: 10,
            companyname: "SportZone KG",
            address: "Aktivallee 3",
            postalcode: "80331",
            city: "München",
        },
    ];


    const columns: ColumnDef<ProducedOrder>[] = [
        { accessorKey: "ordernumber", header: "Bestellnummer" },
        { accessorKey: "position", header: "Position" },
        { accessorKey: "count", header: "Anzahl" },
        { accessorKey: "companyname", header: "Firmenname" },
        { accessorKey: "address", header: "Adresse" },
        { accessorKey: "postalcode", header: "Postleitzahl" },
        { accessorKey: "city", header: "Ort" },
        {
            id: "actions",
            header: "",
            cell: ({ row }) => {
                const producedOrder = row.original;

                return (
                    <div className="flex gap-2 justify-end">
                        {/* Bearbeiten-Button */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(producedOrder)}
                        >
                            <Play className="w-4 h-4" />
                        </Button>
                    </div>
                );
            },
        }
    ];

    const handleEdit = (customer: ProducedOrder) => {
        console.log("Bearbeiten:", customer);
        //Bearbeiten Logik hinzufügen
    };

    return <DataTable <ProducedOrder> data={dummyProducedOrders} columns={columns} />;
    //return <DataTable data={data || []} columns={columns} />;
};

export default ProducedOrderTable;