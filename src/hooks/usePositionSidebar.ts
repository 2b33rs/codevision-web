import { useState } from "react";
import { Order } from "@/models/order";

export function usePositionSidebar() {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedPositionIndex, setSelectedPositionIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  const openSidebar = (order: Order, positionIndex: number = 0) => {
    setSelectedOrder(order);
    setSelectedPositionIndex(positionIndex);
    setIsOpen(true);
  };

  const closeSidebar = () => {
    setIsOpen(false);
    // Delay clearing data to allow animation to complete
    setTimeout(() => {
      setSelectedOrder(null);
      setSelectedPositionIndex(0);
    }, 300);
  };

  const changePosition = (index: number) => {
    setSelectedPositionIndex(index);
  };

  return {
    selectedOrder,
    selectedPositionIndex,
    isOpen,
    openSidebar,
    closeSidebar,
    changePosition,
  };
}
