import { BaseContentLayout } from "@/common/BaseContentLayout.tsx";
import {Grid2x2Plus, UserPlus} from "lucide-react";
import { orderApi } from "@/api/endpoints/orderApi.ts";
import ProducedOrderTable from "@/feature/produced_order/ProducedOrderTable.tsx";
import ProducedOrderForm from "@/feature/produced_order/ProducedOrderForm.tsx"
import React from "react";
import {Dialog, DialogContent} from "@/components/ui/dialog.tsx";
import BaseTabsLayout from "@/common/BaseTabsLayout.tsx";
import VisualCheckTable from "@/feature/produced_order/VisualCheckTable.tsx";


const ProducedOrder = () => {
  //const [, { isLoading }] = orderApi.useCreateOrderMutation();
    const [showModal, setShowModal] = React.useState(false);
  return (
      <Dialog open={showModal} onOpenChange={setShowModal}>
          <BaseContentLayout
              title="Fertigware"
              primaryCallToActionButton={{
                  text: "Fertigware anfordern",
                  icon: Grid2x2Plus,
                  onClick: () => {
                      setShowModal(true);
                  },
                  isLoading: false,
              }}
          >
              <BaseTabsLayout tabs={[{title:"Fertigware im Lager", content: <ProducedOrderTable />},{title:"Offene Sichtprüfungen", content: <VisualCheckTable />} ]}>
              </BaseTabsLayout>
          </BaseContentLayout>
          <DialogContent>
              <ProducedOrderForm />
          </DialogContent>
      </Dialog>
  );
};

export default ProducedOrder;
