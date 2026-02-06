import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent
} from "@/components/ui/chart";
import ChartData from "./ChartData";
import { useState, useEffect } from "react";

export default function BankChart() {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    fetch("http://localhost:8090/getchart")
      .then((res) => res.json())
      .then((json) => {
        for (const element of json) {
          const newChartData: ChartData = {
            month: element.month,
            year: element.year,
            food: element.food,
            bank: element.bank,
          };
          setChartData((current) => [...current, newChartData]);
        }
      });
  }, []);

  const chartConfig = {
    food: {
      label: "Alimentacao",
      color: "#2563eb",
    },
    bank: {
      label: "Banco",
      color: "#60a5fa",
    },
  } satisfies ChartConfig;

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] size-50%">
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="food" fill="var(--color-food)" radius={4} />
        <Bar dataKey="bank" fill="var(--color-bank)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
