import { BaseContentLayout } from "@/common/BaseContentLayout.tsx";
import { UserPlus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog.tsx";
import CreateCustomerForm from "@/feature/customer/CreateCustomerForm.tsx";
import React from "react";

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
        Huhu Kunden
      </BaseContentLayout>
      <DialogContent>
        <CreateCustomerForm />
      </DialogContent>
    </Dialog>
  );
};

export default Customer;
