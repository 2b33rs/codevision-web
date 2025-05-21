import OrderTable from "@/feature/order/OrderTable.tsx";
import { BaseContentLayout } from "@/common/BaseContentLayout.tsx";
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";
import CreateOrderForm from "@/feature/order/CreateOrderForm.tsx";

const Order = () => {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <BaseContentLayout>
        <OrderTable setShowModal={setShowModal} />
      </BaseContentLayout>
      <DialogContent className="w-[95vw] !max-w-[none] sm:w-[90vw] md:w-[80vw] lg:w-[1200px]">
        <CreateOrderForm setShowModal={setShowModal} />
      </DialogContent>
    </Dialog>
  );
};

export default Order;
