import { BaseContentLayout } from "@/common/BaseContentLayout.tsx";
import CustomerTable from "@/components/customer/CustomerTable.tsx";
import BaseTabsLayout from "@/common/BaseTabsLayout.tsx";
import { CustomerType } from "@/models/customer.ts";

const Customer = () => {
  return (
    <BaseContentLayout>
      <BaseTabsLayout
        tabs={[
          {
            title: "Firmenkunden",
            content: <CustomerTable customerType={CustomerType.Business} />,
          },
          {
            title: "Privatkunden",
            content: <CustomerTable customerType={CustomerType.Webshop} />,
          },
        ]}
      />
    </BaseContentLayout>
  );
};

export default Customer;
