import { orderApi } from "@/api/endpoints/orderApi.ts";
import { useMemo } from "react";
import { BaseContentLayout } from "@/common/BaseContentLayout.tsx";
import { Col } from "@/common/flex/Flex.tsx";
import { motion } from "framer-motion";

// Import dashboard components
import { StatusSummary } from "./components/StatusSummary";
import { RevenueAnalysis } from "./components/RevenueAnalysis";

// Import utilities
import { calculateDashboardMetrics } from "./utils/metricsCalculator";

const Dashboard = () => {
  const { data: orders, isLoading } = orderApi.useGetOrdersQuery({});

  // Calculate metrics from order data
  const metrics = useMemo(() => {
    return calculateDashboardMetrics(orders, isLoading);
  }, [orders, isLoading]);

  return (
    <BaseContentLayout>
      <Col f1 gap={4}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
          >
            <RevenueAnalysis metrics={metrics} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <StatusSummary metrics={metrics} />
          </motion.div>
        </motion.div>
      </Col>
    </BaseContentLayout>
  );
};

export default Dashboard;
