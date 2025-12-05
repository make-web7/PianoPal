import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { CalendarDays } from "lucide-react";

interface PracticeDay {
  date: Date;
  duration: number;
}

interface PracticeCalendarProps {
  practiceDays: PracticeDay[];
  weeks?: number;
}

export function PracticeCalendar({ practiceDays, weeks = 12 }: PracticeCalendarProps) {
  const calendarData = useMemo(() => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - (weeks * 7 - 1));
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const practiceMap = new Map<string, number>();
    practiceDays.forEach((pd) => {
      const key = pd.date.toISOString().slice(0, 10);
      practiceMap.set(key, (practiceMap.get(key) || 0) + pd.duration);
    });

    const maxDuration = Math.max(...Array.from(practiceMap.values()), 1);
    const days: { date: Date; duration: number; intensity: number }[] = [];

    const currentDate = new Date(startDate);
    while (currentDate <= today) {
      const key = currentDate.toISOString().slice(0, 10);
      const duration = practiceMap.get(key) || 0;
      days.push({
        date: new Date(currentDate),
        duration,
        intensity: duration / maxDuration,
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    const weeksData: typeof days[] = [];
    for (let i = 0; i < days.length; i += 7) {
      weeksData.push(days.slice(i, i + 7));
    }

    return weeksData;
  }, [practiceDays, weeks]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getIntensityClass = (intensity: number) => {
    if (intensity === 0) return "bg-muted";
    if (intensity < 0.25) return "bg-primary/25";
    if (intensity < 0.5) return "bg-primary/50";
    if (intensity < 0.75) return "bg-primary/75";
    return "bg-primary";
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="flex items-center gap-2">
          <CalendarDays className="h-5 w-5" />
          Practice Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1">
          <div className="flex flex-col gap-1 text-xs text-muted-foreground pr-2">
            {dayNames.map((day, i) => (
              <div key={day} className="h-3 flex items-center" style={{ visibility: i % 2 === 1 ? "visible" : "hidden" }}>
                {day}
              </div>
            ))}
          </div>
          <div className="flex gap-1 overflow-x-auto pb-2">
            {calendarData.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-1">
                {week.map((day) => (
                  <Tooltip key={day.date.toISOString()}>
                    <TooltipTrigger asChild>
                      <div
                        className={`w-3 h-3 rounded-sm ${getIntensityClass(day.intensity)} transition-colors`}
                        data-testid={`calendar-day-${day.date.toISOString().slice(0, 10)}`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="font-medium">
                        {day.date.toLocaleDateString(undefined, {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {day.duration > 0 ? formatDuration(day.duration) : "No practice"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 mt-3 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-muted" />
            <div className="w-3 h-3 rounded-sm bg-primary/25" />
            <div className="w-3 h-3 rounded-sm bg-primary/50" />
            <div className="w-3 h-3 rounded-sm bg-primary/75" />
            <div className="w-3 h-3 rounded-sm bg-primary" />
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
