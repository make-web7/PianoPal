import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { BarChart3 } from "lucide-react";

interface ChartDataPoint {
  date: Date;
  duration: number;
}

interface WeeklyChartProps {
  data: ChartDataPoint[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const chartData = useMemo(() => {
    const today = new Date();
    const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const result = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const dayData = data.find(
        (d) => d.date.toDateString() === date.toDateString()
      );

      result.push({
        day: dayNames[date.getDay()],
        minutes: dayData ? Math.round(dayData.duration / 60) : 0,
        isToday: i === 0,
      });
    }

    return result;
  }, [data]);

  const totalMinutes = chartData.reduce((sum, d) => sum + d.minutes, 0);
  const avgMinutes = Math.round(totalMinutes / 7);

  const formatMinutes = (mins: number) => {
    if (mins >= 60) {
      const hours = Math.floor(mins / 60);
      const remaining = mins % 60;
      return remaining > 0 ? `${hours}h ${remaining}m` : `${hours}h`;
    }
    return `${mins}m`;
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5" />
          This Week
        </CardTitle>
        <div className="text-right">
          <div className="text-2xl font-bold font-mono tabular-nums">
            {formatMinutes(totalMinutes)}
          </div>
          <p className="text-xs text-muted-foreground">
            avg {formatMinutes(avgMinutes)}/day
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                tickFormatter={(value) => `${value}m`}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-popover border border-popover-border rounded-md p-2 shadow-md">
                        <p className="text-sm font-medium">
                          {payload[0].payload.day}
                          {payload[0].payload.isToday && " (Today)"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatMinutes(payload[0].value as number)}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="minutes"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
