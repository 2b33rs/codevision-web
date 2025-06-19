import OrdersTable from "@/feature/produced-order/OrdersTable.tsx";

interface Props {
  searchValue?: string;
}

const PartialOrdersTable = ({ searchValue }: Props) => {
  return <OrdersTable searchValue={searchValue} type="partial" />;
};

export default PartialOrdersTable;
