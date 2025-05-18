import { BaseContentLayout } from "@/common/BaseContentLayout.tsx";
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";
import BaseTabsLayout from "@/common/BaseTabsLayout.tsx";
import ProducedOrderTable from "@/feature/produced-order/ProducedOrderTable.tsx";
import VisualCheckTable from "@/feature/produced-order/VisualCheckTable.tsx";
import ProducedOrderForm from "@/feature/produced-order/ProducedOrderForm.tsx";

const ProducedOrder = () => {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <BaseContentLayout title="Fertigware">
        <BaseTabsLayout
          tabs={[
            { title: "Fertigware im Lager", content: <ProducedOrderTable /> },
            { title: "Offene Sichtprüfungen", content: <VisualCheckTable /> },
          ]}
        ></BaseTabsLayout>
      </BaseContentLayout>
      <DialogContent>
        <ProducedOrderForm />
      </DialogContent>
    </Dialog>
  );
};

export default ProducedOrder;
