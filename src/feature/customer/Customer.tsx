import { BaseContentLayout } from "@/common/BaseContentLayout.tsx";
import { UserPlus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";
import CreateCustomerForm from "@/feature/customer/CreateCustomerForm.tsx";
import React from "react";
import CustomerTable from "@/feature/customer/CustomerTable.tsx";
import BaseTabsLayout from "@/common/BaseTabsLayout.tsx";
import CustomerTablePrivate from "@/feature/customer/CustomerTablePrivate.tsx";

const Customer = () => {
  const [showModal, setShowModal] = React.useState(false);
  return (
    <Dialog open={showModal} onOpenChange={setShowModal}>
      <BaseContentLayout
        title="Kunden"
        primaryCallToActionButton={{
          text: "Kunde hinzufügen",
          icon: UserPlus,
          onClick: () => {
            setShowModal(true);
          },
          isLoading: false,
        }}
      >
        <BaseTabsLayout
          tabs={[
            { title: "Firmenkunden", content: <CustomerTable /> },
            {
              title: "Privatkunden",
              content: <CustomerTablePrivate />,
            },
          ]}
        />
      </BaseContentLayout>
      <DialogContent>
        <CreateCustomerForm />
      </DialogContent>
    </Dialog>
  );
};

export default Customer;