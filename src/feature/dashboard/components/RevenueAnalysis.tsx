import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Col, Row } from "@/common/flex/Flex.tsx";
import {
  Banknote,
  CheckCircle,
  Package,
  RefreshCw,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { motion } from "framer-motion";

interface RevenueAnalysisProps {
  metrics: {
    totalRevenue: number;
    averageOrderValue: number;
    completedPositions: number;
    inProgressPositions: number;
    readyForPickupPositions: number;
    totalPositions: number;
  };
}

export function RevenueAnalysis({ metrics }: RevenueAnalysisProps) {
  // Calculate revenue by status
  const completedRevenue =
    metrics.totalRevenue *
    (metrics.completedPositions / metrics.totalPositions || 0);
  const inProgressRevenue =
    metrics.totalRevenue *
    (metrics.inProgressPositions / metrics.totalPositions || 0);
  const readyForPickupRevenue =
    metrics.totalRevenue *
    (metrics.readyForPickupPositions / metrics.totalPositions || 0);

  // Revenue data for visualization - nur Graustufen
  const revenueData = [
    {
      label: "Gesamtumsatz",
      value: metrics.totalRevenue,
      icon: Wallet,
      iconGradient: "from-emerald-600 to-teal-600", // Nur für Icon-Highlight
      bgGradient: "from-muted/30 to-muted/20",
      darkBgGradient: "from-muted/20 to-muted/10",
      textGradient: "from-foreground to-foreground/80",
    },
    {
      label: "Durchschnittlicher Auftragswert",
      value: metrics.averageOrderValue,
      icon: TrendingUp,
      iconGradient: "from-blue-600 to-indigo-600", // Nur für Icon-Highlight
      bgGradient: "from-muted/30 to-muted/20",
      darkBgGradient: "from-muted/20 to-muted/10",
      textGradient: "from-foreground to-foreground/80",
    },
  ];

  // Revenue by status data - Graustufen mit minimalen Farbhighlights
  const revenueByStatus = [
    {
      label: "Umsatz aus abgeschlossenen Positionen",
      value: completedRevenue,
      icon: CheckCircle,
      iconColor: "text-emerald-600/70", // Minimaler Farbhighlight nur für Icon
      textColor: "text-foreground/90",
      bgColor: "bg-muted/20 dark:bg-muted/10",
      borderColor: "border-border/30",
    },
    {
      label: "Umsatz aus Positionen in Bearbeitung",
      value: inProgressRevenue,
      icon: RefreshCw,
      iconColor: "text-amber-600/70", // Minimaler Farbhighlight nur für Icon
      textColor: "text-foreground/90",
      bgColor: "bg-muted/20 dark:bg-muted/10",
      borderColor: "border-border/30",
    },
    {
      label: "Umsatz aus abholbereiten Positionen",
      value: readyForPickupRevenue,
      icon: Package,
      iconColor: "text-purple-600/70", // Minimaler Farbhighlight nur für Icon
      textColor: "text-foreground/90",
      bgColor: "bg-muted/20 dark:bg-muted/10",
      borderColor: "border-border/30",
    },
  ];

  return (
    <motion.div
      transition={{ type: "spring", stiffness: 400, damping: 40 }}
      className="group"
    >
      <div className="from-muted/5 to-muted/2 pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent" />

      <CardContent className="relative">
        <Col gap={6}>
          {/* Main Revenue Cards */}
          <Row gap={4}>
            {revenueData.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
                }}
                className="group flex-1"
              >
                <Card
                  className={`relative overflow-hidden border-0 bg-gradient-to-br ${item.bgGradient} dark:${item.darkBgGradient} shadow-sm transition-all duration-200 hover:shadow-md`}
                >
                  <motion.div
                    className="from-background/10 absolute inset-0 bg-gradient-to-br to-transparent opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  />

                  <div className="relative p-4">
                    <Row gap={2} align="center" className="mb-3">
                      <motion.div
                        whileHover={{ rotate: 45 }}
                        transition={{ duration: 0.3 }}
                        className={`rounded-lg bg-gradient-to-br ${item.iconGradient} relative overflow-hidden p-1.5 shadow-sm`}
                      >
                        <item.icon className="relative z-10 h-4 w-4 text-white" />
                        {/* Sehr subtile Geldpartikel im Icon */}
                        <div className="absolute inset-0">
                          <Banknote className="animate-money-particle absolute top-0 right-0 h-2 w-2 text-white/10" />
                          <Banknote
                            className="animate-money-particle absolute bottom-1 left-1 h-1.5 w-1.5 text-white/8"
                            style={{ animationDelay: "3s" }}
                          />
                        </div>
                      </motion.div>
                      <h3 className="text-muted-foreground/80 text-xs font-medium">
                        {item.label}
                      </h3>
                    </Row>

                    <Row gap={2} align="center">
                      <motion.p
                        className={`bg-gradient-to-r text-2xl font-semibold ${item.textGradient} bg-clip-text text-transparent`}
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        transition={{
                          delay: 0.15 + index * 0.05,
                          type: "spring",
                          stiffness: 200,
                        }}
                      >
                        €{item.value.toFixed(2)}
                      </motion.p>
                      {/* Sehr dezente grüne Geldscheine neben dem Wert */}
                      <div className="relative h-4 w-4 overflow-hidden">
                        <Banknote className="money-icon animate-money-glow absolute h-4 w-4 text-emerald-600/12" />
                        <Banknote
                          className="money-icon animate-money-shimmer absolute h-4 w-4 text-emerald-500/8"
                          style={{ animationDelay: "1s" }}
                        />
                      </div>
                    </Row>
                  </div>
                </Card>
              </motion.div>
            ))}
          </Row>

          {/* Revenue by Status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Col gap={4}>
              <Col gap={2}>
                {revenueByStatus.map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + index * 0.05 }}
                    whileHover={{ scale: 1.01, x: 2 }}
                    className="group"
                  >
                    <Card
                      className={`relative overflow-hidden border ${item.borderColor} ${item.bgColor} transition-all duration-200 hover:shadow-sm`}
                    >
                      <motion.div
                        className="from-foreground/20 to-foreground/10 absolute top-0 bottom-0 left-0 w-0.5 bg-gradient-to-b"
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{
                          delay: 0.4 + index * 0.05,
                          duration: 0.3,
                        }}
                      />

                      <div className="p-3 pl-4">
                        <Row justify="between" align="center">
                          <Row gap={2} align="center">
                            <motion.div
                              whileHover={{ scale: 1.1 }}
                              className="bg-background/40 rounded-md p-1 backdrop-blur-sm"
                            >
                              <item.icon
                                className={`h-3.5 w-3.5 ${item.iconColor}`}
                              />
                            </motion.div>
                            <span
                              className={`text-sm font-medium ${item.textColor}`}
                            >
                              {item.label}
                            </span>
                          </Row>
                          <Row gap={1} align="center">
                            <motion.div
                              className={`font-semibold ${item.textColor}`}
                              initial={{ scale: 0.9 }}
                              animate={{ scale: 1 }}
                              transition={{
                                delay: 0.45 + index * 0.05,
                                type: "spring",
                                stiffness: 200,
                              }}
                            >
                              €{item.value.toFixed(2)}
                            </motion.div>
                            {/* Mini Geldschein - fast unsichtbar mit grünem Highlight */}
                            <div className="relative h-3 w-3 overflow-hidden">
                              <Banknote
                                className="money-icon animate-money-glow absolute h-3 w-3 text-emerald-600/10"
                                style={{ animationDelay: `${index * 2}s` }}
                              />
                            </div>
                          </Row>
                        </Row>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </Col>
            </Col>
          </motion.div>
        </Col>
      </CardContent>
      <CardHeader className="relative pb-3">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.05 }}
        >
          <Row gap={2} align="center">
            {/* Geldscheine nur als subtiler grüner Highlight */}
            <div className="relative h-5 w-5 overflow-hidden">
              <Banknote className="money-icon animate-money-glow absolute h-5 w-5 text-emerald-600/15" />
              <Banknote
                className="money-icon animate-money-float absolute h-5 w-5 text-emerald-500/10"
                style={{ animationDelay: "2s" }}
              />
              <Banknote
                className="money-icon animate-money-shimmer absolute h-5 w-5 text-emerald-400/8"
                style={{ animationDelay: "4s" }}
              />
            </div>
          </Row>
        </motion.div>
      </CardHeader>

      <Separator className="via-border/40 bg-gradient-to-r from-transparent to-transparent" />
    </motion.div>
  );
}
