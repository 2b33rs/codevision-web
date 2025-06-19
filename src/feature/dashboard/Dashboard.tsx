import { orderApi } from "@/api/endpoints/orderApi.ts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useMemo } from "react";
import { ChartAreaInteractive } from "@/components/sidebar/chart-area-interactive";

const Dashboard = () => {
  const { data: orders, isLoading } = orderApi.useGetOrdersQuery({});

  // Define types for metrics
  type ProductCategories = Record<string, number>;

  // Calculate metrics from order data
  const metrics = useMemo(() => {
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
        productCategories: {} as ProductCategories,
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
  }, [orders, isLoading]);

  // Prepare data for the area chart
  const areaChartData = useMemo(() => {
    if (!orders || isLoading) {
      return [];
    }

    // Get the last 90 days
    const today = new Date();
    const dates = Array.from({ length: 90 }, (_, i) => {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      return date.toISOString().split("T")[0]; // Format as YYYY-MM-DD
    }).reverse();

    // Count positions by date and status
    const positionsByDate = dates.map((date) => {
      const orderArray = Array.isArray(orders) ? orders : [orders];
      const positionsOnDate: Array<any> = [];

      orderArray.forEach((order) => {
        const orderDate = new Date(order.createdAt).toISOString().split("T")[0];
        if (orderDate === date) {
          positionsOnDate.push(...order.positions);
        }
      });

      const inProgress = positionsOnDate.filter(
        (position) => position.Status === "IN_PROGRESS",
      ).length;
      const completed = positionsOnDate.filter(
        (position) => position.Status === "COMPLETED",
      ).length;

      return {
        date,
        desktop: completed, // Using "desktop" for completed positions
        mobile: inProgress, // Using "mobile" for in progress positions
      };
    });

    return positionsByDate;
  }, [orders, isLoading]);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Übersicht der Auftragsmetriken und Statistiken
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Übersicht</TabsTrigger>
          <TabsTrigger value="orders">Aufträge</TabsTrigger>
          <TabsTrigger value="revenue">Umsatz</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Key metrics */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Gesamtaufträge
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalOrders}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Gesamtpositionen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {metrics.totalPositions}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Gesamtumsatz
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  €{metrics.totalRevenue.toFixed(2)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Durchschn. Auftragswert
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  €{metrics.averageOrderValue.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order status chart */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Positionen nach Status</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartAreaInteractive
                  data={areaChartData}
                  title="Positionen nach Status im Zeitverlauf"
                  description={{
                    desktop:
                      "Abgeschlossene und in Bearbeitung befindliche Positionen im Zeitverlauf",
                    mobile: "Positionen im Zeitverlauf",
                  }}
                />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Auftragsstatus</CardTitle>
                <CardDescription>
                  Aufschlüsselung der Aufträge nach aktuellem Status
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-orange-500">In Bearbeitung</Badge>
                      <span>Positionen in Bearbeitung</span>
                    </div>
                    <div>{metrics.inProgressPositions}</div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-purple-500">Abholbereit</Badge>
                      <span>Abholbereite Positionen</span>
                    </div>
                    <div>{metrics.readyForPickupPositions}</div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500">Abgeschlossen</Badge>
                      <span>Abgeschlossene Positionen</span>
                    </div>
                    <div>{metrics.completedPositions}</div>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-red-500">Storniert</Badge>
                      <span>Stornierte Positionen</span>
                    </div>
                    <div>{metrics.cancelledPositions}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Auftragsdetails</CardTitle>
              <CardDescription>
                Detaillierte Aufschlüsselung von Aufträgen und Positionen
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Gesamtaufträge</h3>
                    <p className="text-2xl font-bold">{metrics.totalOrders}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Gesamtpositionen</h3>
                    <p className="text-2xl font-bold">
                      {metrics.totalPositions}
                    </p>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="mb-2 font-semibold">Produktkategorien</h3>
                  <div className="space-y-2">
                    {Object.entries(metrics.productCategories).map(
                      ([category, count]) => (
                        <div key={category} className="flex justify-between">
                          <span>{category}</span>
                          <span>{String(count)}</span>
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Umsatzanalyse</CardTitle>
              <CardDescription>
                Finanzkennzahlen und Umsatzaufschlüsselung
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold">Gesamtumsatz</h3>
                    <p className="text-2xl font-bold">
                      €{metrics.totalRevenue.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      Durchschnittlicher Auftragswert
                    </h3>
                    <p className="text-2xl font-bold">
                      €{metrics.averageOrderValue.toFixed(2)}
                    </p>
                  </div>
                </div>
                <Separator />
                <div>
                  <h3 className="mb-2 font-semibold">Umsatz nach Status</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Umsatz aus abgeschlossenen Positionen</span>
                      <span>
                        €
                        {(
                          metrics.totalRevenue *
                          (metrics.completedPositions /
                            metrics.totalPositions || 0)
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Umsatz aus Positionen in Bearbeitung</span>
                      <span>
                        €
                        {(
                          metrics.totalRevenue *
                          (metrics.inProgressPositions /
                            metrics.totalPositions || 0)
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Umsatz aus abholbereiten Positionen</span>
                      <span>
                        €
                        {(
                          metrics.totalRevenue *
                          (metrics.readyForPickupPositions /
                            metrics.totalPositions || 0)
                        ).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
