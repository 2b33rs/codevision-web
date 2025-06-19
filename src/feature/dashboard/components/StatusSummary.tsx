import { CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Col, Row } from "@/common/flex/Flex.tsx";
import { CheckCircle, Package, RefreshCw, XCircle } from "lucide-react";
import { motion } from "framer-motion";

interface StatusSummaryProps {
  metrics: {
    inProgressPositions: number;
    completedPositions: number;
    cancelledPositions: number;
    readyForPickupPositions: number;
  };
}

export function StatusSummary({ metrics }: StatusSummaryProps) {
  const statusItems = [
    {
      label: "In Bearbeitung",
      description: "Positionen in Bearbeitung",
      value: metrics.inProgressPositions,
      // Nur Badge bekommt Farbe als Highlight
      badgeColor: "bg-gradient-to-r from-amber-500/80 to-orange-500/80",
      icon: RefreshCw,
      bgColor: "bg-muted/20 dark:bg-muted/10",
      textColor: "text-foreground/90",
      borderColor: "border-border/30",
      iconAnimation: "animate-spin",
      iconColor: "text-amber-600/70", // Minimaler Farbhighlight für Icon
    },
    {
      label: "Abholbereit",
      description: "Abholbereite Positionen",
      value: metrics.readyForPickupPositions,
      // Nur Badge bekommt Farbe als Highlight
      badgeColor: "bg-gradient-to-r from-purple-500/80 to-violet-500/80",
      icon: Package,
      bgColor: "bg-muted/20 dark:bg-muted/10",
      textColor: "text-foreground/90",
      borderColor: "border-border/30",
      iconAnimation: "animate-bounce",
      iconColor: "text-purple-600/70", // Minimaler Farbhighlight für Icon
    },
    {
      label: "Abgeschlossen",
      description: "Abgeschlossene Positionen",
      value: metrics.completedPositions,
      // Nur Badge bekommt Farbe als Highlight
      badgeColor: "bg-gradient-to-r from-emerald-500/80 to-green-500/80",
      icon: CheckCircle,
      bgColor: "bg-muted/20 dark:bg-muted/10",
      textColor: "text-foreground/90",
      borderColor: "border-border/30",
      iconAnimation: "animate-pulse",
      iconColor: "text-emerald-600/70", // Minimaler Farbhighlight für Icon
    },
    {
      label: "Storniert",
      description: "Stornierte Positionen",
      value: metrics.cancelledPositions,
      // Nur Badge bekommt Farbe als Highlight
      badgeColor: "bg-gradient-to-r from-red-500/80 to-rose-500/80",
      icon: XCircle,
      bgColor: "bg-muted/20 dark:bg-muted/10",
      textColor: "text-foreground/90",
      borderColor: "border-border/30",
      iconAnimation: "animate-pulse",
      iconColor: "text-red-600/70", // Minimaler Farbhighlight für Icon
    },
  ];

  const totalPositions = statusItems.reduce((sum, item) => sum + item.value, 0);

  return (
    <motion.div transition={{ type: "spring", stiffness: 400, damping: 40 }}>
      <div className="from-muted/5 to-muted/2 pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent" />

      <CardContent>
        <div className={"grid grid-cols-4 gap-4"}>
          {statusItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <Col>
                <div
                  className={`relative rounded-lg p-3 ${item.bgColor} border ${item.borderColor} transition-all duration-200 hover:shadow-sm`}
                >
                  <motion.div
                    className="from-foreground/20 to-foreground/10 absolute top-0 bottom-0 left-0 w-0.5 rounded-r-full bg-gradient-to-b"
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ delay: 0.15 + index * 0.05, duration: 0.3 }}
                  />

                  <Row justify="between" align="center">
                    <Row gap={2} align="center">
                      <motion.div
                        whileHover={{ scale: 1.05, rotate: 2 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Badge
                          variant="outline"
                          className={`${item.badgeColor} border-0 px-2.5 py-1 text-white shadow-sm transition-shadow duration-200 hover:shadow-md`}
                        >
                          <item.icon
                            className={`mr-1.5 h-3.5 w-3.5 ${item.iconAnimation}`}
                          />
                          {item.label}
                        </Badge>
                      </motion.div>
                    </Row>

                    <Row gap={2} align="center">
                      {/* Progress bar */}
                      <div className="hidden flex-col items-end sm:flex">
                        <motion.div
                          className="bg-muted/40 h-1 w-12 overflow-hidden rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: 48 }}
                          transition={{
                            delay: 0.2 + index * 0.05,
                            duration: 0.3,
                          }}
                        >
                          <motion.div
                            className="from-foreground/60 to-foreground/40 h-full rounded-full bg-gradient-to-r"
                            initial={{ width: 0 }}
                            animate={{
                              width: `${totalPositions > 0 ? (item.value / totalPositions) * 100 : 0}%`,
                            }}
                            transition={{
                              delay: 0.3 + index * 0.05,
                              duration: 0.5,
                              ease: "easeOut",
                            }}
                          />
                        </motion.div>
                        <span className="text-muted-foreground/60 mt-0.5 text-xs">
                          {totalPositions > 0
                            ? Math.round((item.value / totalPositions) * 100)
                            : 0}
                          %
                        </span>
                      </div>

                      <motion.div
                        className={`text-lg font-semibold ${item.textColor}`}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          delay: 0.25 + index * 0.05,
                          type: "spring",
                          stiffness: 200,
                          damping: 15,
                        }}
                        whileHover={{ scale: 1.05 }}
                      >
                        {item.value}
                      </motion.div>
                    </Row>
                  </Row>
                </div>
              </Col>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </motion.div>
  );
}
