import { BaseContentLayout } from "@/common/BaseContentLayout.tsx";
import React, { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";
import BaseTabsLayout from "@/common/BaseTabsLayout.tsx";
import ProducedOrderTable from "@/feature/produced-order/ProducedOrderTable.tsx";
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
              title: "Fertigware im Lager",
              content: <ProducedOrderTable searchValue={searchValue} />,
            },
            {
              title: "Offene Sichtprüfungen",
              content: <VisualCheckTable searchValue={searchValue} />,
            },
          ]}
          slot={
            <SearchInput
              value={searchValue}
              onChange={setSearchValue}
              placeholder="Suche nach Bestellnummer, Größe, Farbe..."
              className="max-w-sm"
            />
          }
        />
      </BaseContentLayout>
      <DialogContent>
        <ProducedOrderForm />
      </DialogContent>
    </Dialog>
  );
};

export default ProducedOrder;
