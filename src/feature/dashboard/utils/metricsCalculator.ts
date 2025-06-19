import { Order } from "@/models/order";

// Define types for metrics
export type ProductCategories = Record<string, number>;

export interface DashboardMetrics {
  // Order metrics
  totalOrders: number;
  totalPositions: number;
  
  // Status metrics
  inProgressPositions: number;
  completedPositions: number;
  cancelledPositions: number;
  readyForPickupPositions: number;
  
  // Financial metrics
  totalRevenue: number;
  averageOrderValue: number;
  
  // Product metrics
  productCategories: ProductCategories;
}

/**
 * Calculates dashboard metrics from order data
 */
export function calculateDashboardMetrics(
  orders: Order[] | Order | undefined,
  isLoading: boolean
): DashboardMetrics {
  if (!orders || isLoading) {
    return {
      totalOrders: 0,
      inProgressPositions: 0,
      completedPositions: 0,
      cancelledPositions: 0,
      readyForPickupPositions: 0,
      totalRevenue: 0,
      averageOrderValue: 0,
      totalPositions: 0,
      productCategories: {},
    };
  }

  const orderArray = Array.isArray(orders) ? orders : [orders];

  // Count positions by status
  let inProgressPositions = 0;
  let completedPositions = 0;
  let cancelledPositions = 0;
  let readyForPickupPositions = 0;

  orderArray.forEach((order) => {
    order.positions.forEach((position) => {
      if (position.Status === "IN_PROGRESS") {
        inProgressPositions++;
      } else if (position.Status === "COMPLETED") {
        completedPositions++;
      } else if (position.Status === "CANCELLED") {
        cancelledPositions++;
      } else if (position.Status === "READY_FOR_PICKUP") {
        readyForPickupPositions++;
      }
    });
  });

  // Calculate total positions
  const totalPositions = orderArray.reduce(
    (sum, order) => sum + order.positions.length,
    0,
  );

  // Calculate revenue (assuming price is a string that can be converted to a number)
  const totalRevenue = orderArray.reduce((sum, order) => {
    const orderRevenue = order.positions.reduce((posSum, position) => {
      const price = parseFloat(position.price) || 0;
      return posSum + price * position.amount;
    }, 0);
    return sum + orderRevenue;
  }, 0);

  // Calculate average order value
  const averageOrderValue =
    orderArray.length > 0 ? totalRevenue / orderArray.length : 0;

  // Count product categories
  const productCategories: ProductCategories = {};
  orderArray.forEach((order) => {
    order.positions.forEach((position) => {
      const category = position.productCategory;
      productCategories[category] = (productCategories[category] || 0) + 1;
    });
  });

  return {
    totalOrders: orderArray.length,
    inProgressPositions,
    completedPositions,
    cancelledPositions,
    readyForPickupPositions,
    totalRevenue,
    averageOrderValue,
    totalPositions,
    productCategories,
  };
}