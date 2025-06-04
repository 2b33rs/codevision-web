import { orderApi } from "@/api/endpoints/orderApi.ts";
import Fuse from "fuse.js";
import SelectablePositionsTable from "@/feature/produced-order/SelectPositionTable.tsx";
import { Position } from "@/models/order.ts";
import { pdf } from "@react-pdf/renderer";
import InvoicePDF from "@/feature/order/InvoicePDF.tsx";


interface InvoicesTableProps {
    searchValue?: string;
}
const downloadInvoicePDF = async (positions: Position[], orderNumber: string) => {
    const blob = await pdf(
        <InvoicePDF positions={positions} orderNumber={orderNumber} />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Rechnung_${orderNumber}.pdf`;
    link.click();

    URL.revokeObjectURL(url);
};


const InvoicesTable = ({ searchValue}: InvoicesTableProps) => {
    const { data: completedOrders = [] } =
        orderApi.useGetOrdersWithPositionStatusQuery("COMPLETED");



    const filteredOrders =
        searchValue && completedOrders.length > 0
            ? new Fuse(completedOrders, {
                keys: [
                    "orderNumber",
                    "positions.name",
                    "positions.color",
                    "positions.shirtSize",
                ],
                threshold: 0.3,
                ignoreLocation: true,
            })
                .search(searchValue)
                .map((result) => result.item)
            : completedOrders;

    const ordersWithCompletedCount = filteredOrders.map((order) => {
        const completedCount = order.positions.filter(
            (pos) => pos.Status === "COMPLETED"
        ).length;
        return { ...order, completedCount };
    });

    const sortedOrders = ordersWithCompletedCount.sort(
        (a, b) => b.completedCount - a.completedCount
    );

    return (
        <div className="space-y-1">
            {sortedOrders.map((order) => (
                <div key={order.id} className="bg-muted-foreground/2 p-1">
                    <SelectablePositionsTable
                        positions={order.positions}
                        orderNumber={order.orderNumber}
                        selectableStatus="COMPLETED"
                        singleSelect={false}
                        actions={[
                            {
                                label: "Rechnung erstellen",
                                onConfirm: async (selected, orderNumber) => {
                                    await downloadInvoicePDF(selected, orderNumber); // ✅ Await here
                                },
                                renderDropdown: false,
                            },
                        ]}


                    />
                </div>
            ))}


        </div>
    );
};

export default InvoicesTable;
