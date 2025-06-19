"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import { useIsMobile } from "@/hooks/use-mobile.ts";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.tsx";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";

export const description = "Ein interaktives Flächendiagramm";

// Sample chart data for fallback
const chartData = [
  { date: "2024-04-01", desktop: 5, mobile: 10 },
  { date: "2024-04-02", desktop: 7, mobile: 12 },
  { date: "2024-04-03", desktop: 10, mobile: 8 },
  { date: "2024-04-04", desktop: 12, mobile: 6 },
  { date: "2024-04-05", desktop: 15, mobile: 5 },
  { date: "2024-04-06", desktop: 18, mobile: 4 },
  { date: "2024-04-07", desktop: 20, mobile: 3 },
];

const chartConfig = {
  visitors: {
    label: "Positionen",
  },
  desktop: {
    label: "Abgeschlossene Positionen",
    color: "rgba(75, 192, 192, 0.7)", // Green for completed
  },
  mobile: {
    label: "Positionen in Bearbeitung",
    color: "rgba(255, 159, 64, 0.7)", // Orange for in progress
  },
} satisfies ChartConfig;

export interface ChartAreaInteractiveProps {
  data?: typeof chartData;
  title?: string;
  description?: {
    desktop?: string;
    mobile?: string;
  };
}

export function ChartAreaInteractive({
  data = chartData,
  title = "Gesamtbesucher",
  description = {
    desktop: "Abgeschlossene und in Bearbeitung befindliche Positionen im Zeitverlauf",
    mobile: "Positionen im Zeitverlauf"
  },
}: ChartAreaInteractiveProps) {
  const isMobile = useIsMobile();
  const [timeRange, setTimeRange] = React.useState("90d");

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7d");
    }
  }, [isMobile]);

  const filteredData = data.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date("2024-06-30");
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            {description.desktop}
          </span>
          <span className="@[540px]/card:hidden">{description.mobile}</span>
        </CardDescription>
        <CardAction>
          <ToggleGroup
            type="single"
            value={timeRange}
            onValueChange={setTimeRange}
            variant="outline"
            className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
          >
            <ToggleGroupItem value="90d">Letzte 3 Monate</ToggleGroupItem>
            <ToggleGroupItem value="30d">Letzte 30 Tage</ToggleGroupItem>
            <ToggleGroupItem value="7d">Letzte 7 Tage</ToggleGroupItem>
          </ToggleGroup>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
              size="sm"
              aria-label="Wert auswählen"
            >
              <SelectValue placeholder="Letzte 3 Monate" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Letzte 3 Monate
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Letzte 30 Tage
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Letzte 7 Tage
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="rgba(75, 192, 192, 0.7)" // Green for completed
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="rgba(75, 192, 192, 0.7)" // Green for completed
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="rgba(255, 159, 64, 0.7)" // Orange for in progress
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="rgba(255, 159, 64, 0.7)" // Orange for in progress
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("de-DE", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("de-DE", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="mobile"
              type="natural"
              fill="url(#fillMobile)"
              stroke="rgba(255, 159, 64, 0.7)" // Orange for in progress
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="rgba(75, 192, 192, 0.7)" // Green for completed
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
