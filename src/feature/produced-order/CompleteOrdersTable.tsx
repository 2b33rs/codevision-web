import OrdersTable from "@/feature/produced-order/OrdersTable.tsx";

interface Props {
  searchValue?: string;
}

const CompleteOrdersTable = ({ searchValue }: Props) => {
  return <OrdersTable searchValue={searchValue} type="complete" />;
};

export default CompleteOrdersTable;
