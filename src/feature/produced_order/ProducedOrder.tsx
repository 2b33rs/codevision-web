import { BaseContentLayout } from "@/common/BaseContentLayout.tsx";
import {Grid2x2Plus, UserPlus} from "lucide-react";
import { orderApi } from "@/api/endpoints/orderApi.ts";
import ProducedOrderTable from "@/feature/produced_order/ProducedOrderTable.tsx";
import ProducedOrderForm from "@/feature/produced_order/ProducedOrderForm.tsx"
import React from "react";
import {Dialog, DialogContent} from "@/components/ui/dialog.tsx";
import CustomerTable from "@/feature/customer/CustomerTable.tsx";


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
              <ProducedOrderTable />
          </BaseContentLayout>
          <DialogContent>
              <ProducedOrderForm />
          </DialogContent>
      </Dialog>
  );
};

export default ProducedOrder;
