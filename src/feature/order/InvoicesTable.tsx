import React, { useState } from "react";
import Fuse from "fuse.js";
import { pdf } from "@react-pdf/renderer";
import type { JSX } from "react";

import { orderApi } from "@/api/endpoints/orderApi.ts";
import SelectablePositionsTable from "@/feature/produced-order/SelectPositionTable.tsx";
import InvoicePDF from "@/feature/order/InvoicePDF.tsx";
import DeliveryNotePDF from "@/feature/order/DeliveryNotePDF.tsx";
import { FileText, Truck, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import type { Position } from "@/models/order";
import { SearchInput } from "@/components/ui/search-input.tsx";

const downloadPDF = async (component: JSX.Element, fileName: string) => {
  const blob = await pdf(component).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
};

const InvoicesTable = () => {
  const { data: completedOrders = [] } =
    orderApi.useGetOrdersWithPositionStatusQuery("COMPLETED");

  const [searchValue, setSearchValue] = React.useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState<{
    positions: Position[];
    orderNumber: string;
  } | null>(null);

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

  const sortedOrders = filteredOrders
    .map((order) => ({
      ...order,
      completedCount: order.positions.filter(
        (pos) => pos.Status === "COMPLETED",
      ).length,
    }))
    .sort((a, b) => b.completedCount - a.completedCount);

  return (
    <div className="space-y-1">
      <SearchInput value={searchValue} onChange={setSearchValue} />
      {sortedOrders.map((order) => (
        <div key={order.id} className="bg-muted-foreground/2 p-1">
          <SelectablePositionsTable
            positions={order.positions}
            orderNumber={order.orderNumber}
            selectableStatus="COMPLETED"
            singleSelect={false}
            customerName={order.customer.name}
            actions={[
              {
                label: "Download-Option wählen",
                onConfirm: (selected, orderNumber) => {
                  setModalData({ positions: selected, orderNumber });
                  setModalOpen(true);
                },
              },
            ]}
          />
        </div>
      ))}

      {/* Modal für PDF-Auswahl */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-background max-w-md space-y-2 rounded-2xl p-6 shadow-xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">
              Download wählen
            </DialogTitle>
            <p className="text-muted-foreground text-sm">
              Für Bestellung {modalData?.orderNumber}
            </p>
          </DialogHeader>

          <div className="grid grid-cols-3 gap-3 text-center">
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center gap-1 py-6"
              onClick={async () => {
                if (!modalData) return;
                await downloadPDF(
                  <InvoicePDF
                    positions={modalData.positions}
                    orderNumber={modalData.orderNumber}
                  />,
                  `Rechnung_${modalData.orderNumber}.pdf`,
                );
                setModalOpen(false);
              }}
            >
              <FileText className="text-primary h-5 w-5" />
              <span className="text-xs">Rechnung</span>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col items-center justify-center gap-1 py-6"
              onClick={async () => {
                if (!modalData) return;
                await downloadPDF(
                  <DeliveryNotePDF
                    positions={modalData.positions}
                    orderNumber={modalData.orderNumber}
                  />,
                  `Lieferschein_${modalData.orderNumber}.pdf`,
                );
                setModalOpen(false);
              }}
            >
              <Truck className="text-primary h-5 w-5" />
              <span className="text-xs">Lieferschein</span>
            </Button>

            <Button
              variant="outline"
              className="flex flex-col items-center justify-center gap-1 py-6"
              onClick={async () => {
                if (!modalData) return;
                await downloadPDF(
                  <InvoicePDF
                    positions={modalData.positions}
                    orderNumber={modalData.orderNumber}
                  />,
                  `Rechnung_${modalData.orderNumber}.pdf`,
                );
                await downloadPDF(
                  <DeliveryNotePDF
                    positions={modalData.positions}
                    orderNumber={modalData.orderNumber}
                  />,
                  `Lieferschein_${modalData.orderNumber}.pdf`,
                );
                setModalOpen(false);
              }}
            >
              <PackageCheck className="text-primary h-5 w-5" />
              <span className="text-xs">Beides</span>
            </Button>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Abbrechen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InvoicesTable;
