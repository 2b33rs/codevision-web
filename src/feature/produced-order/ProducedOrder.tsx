import { BaseContentLayout } from "@/common/BaseContentLayout.tsx";
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";
import BaseTabsLayout from "@/common/BaseTabsLayout.tsx";
import CompleteOrdersTable from "@/feature/produced-order/CompleteOrdersTable.tsx";
import PartialOrdersTable from "@/feature/produced-order/PartialOrdersTable.tsx";
import VisualCheckTable from "@/feature/produced-order/VisualCheckTable.tsx";
import ProducedOrderForm from "@/feature/produced-order/ProducedOrderForm.tsx";
import { SearchInput } from "@/components/ui/search-input.tsx";

const ProducedOrder = () => {
  const [showModal, setShowModal] = React.useState(false);
  const [searchValue, setSearchValue] = useState("");

  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <BaseContentLayout>
        <BaseTabsLayout
          tabs={[
            {
              title: "Komplett produziert",
              content: (
                <div className="space-y-4">
                  <div className="flex justify-start">
                    <SearchInput
                      value={searchValue}
                      onChange={setSearchValue}
                      placeholder="Suche nach Bestellnummer, Größe, Farbe..."
                      className="max-w-sm"
                    />
                  </div>
                  <CompleteOrdersTable searchValue={searchValue} />
                </div>
              ),
            },
            {
              title: "Teillieferungen",
              content: (
                <div className="space-y-4">
                  <div className="flex justify-start">
                    <SearchInput
                      value={searchValue}
                      onChange={setSearchValue}
                      placeholder="Suche nach Bestellnummer, Größe, Farbe..."
                      className="max-w-sm"
                    />
                  </div>
                  <PartialOrdersTable searchValue={searchValue} />
                </div>
              ),
            },
            {
              title: "Offene Sichtprüfungen",
              content: (
                <div className="space-y-4">
                  <div className="flex justify-start">
                    <SearchInput
                      value={searchValue}
                      onChange={setSearchValue}
                      placeholder="Suche nach Bestellnummer, Größe, Farbe..."
                      className="max-w-sm"
                    />
                  </div>
                  <VisualCheckTable searchValue={searchValue} />
                </div>
              ),
            },
          ]}
        />
      </BaseContentLayout>

      <DialogContent>
        <ProducedOrderForm />
      </DialogContent>
    </Dialog>
  );
};

export default ProducedOrder;
