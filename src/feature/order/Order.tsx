import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";
import OrderTable from "@/feature/order/OrderTable.tsx";
import CreateOrderForm from "@/feature/order/CreateOrderForm.tsx";
import { BaseContentLayout } from "@/common/BaseContentLayout.tsx";
import BaseTabsLayout from "@/common/BaseTabsLayout.tsx";
import InvoicesTable from "@/feature/order/InvoicesTable.tsx";

const Order = () => {
    const [showModal, setShowModal] = React.useState(false);

    return (
        <Dialog open={showModal} onOpenChange={setShowModal}>
            <BaseContentLayout>
                <BaseTabsLayout
                    tabs={[
                        {
                            title: "Bestellungen",
                            content: <OrderTable setShowModal={setShowModal} />,
                        },
                        {
                            title: "Dokumente",
                            content: <InvoicesTable />,
                        },
                    ]}
                />
            </BaseContentLayout>

            <DialogContent className="w-[95vw] !max-w-[none] sm:w-[90vw] md:w-[80vw] lg:w-[1200px]">
                <CreateOrderForm setShowModal={setShowModal} />
            </DialogContent>
        </Dialog>
    );
};

export default Order;
