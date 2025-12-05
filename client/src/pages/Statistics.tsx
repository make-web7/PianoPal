import { useState, useMemo } from "react";
import { Clock, Calendar, TrendingUp, Flame, Award, Target } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { WeeklyChart } from "@/components/WeeklyChart";
import { PracticeCalendar } from "@/components/PracticeCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import type { PracticeSession } from "@/components/SessionList";

// todo: remove mock functionality
const generateMockSessions = (): PracticeSession[] => {
  const sessions: PracticeSession[] = [];
  const today = new Date();
  
  for (let i = 0; i < 60; i++) {
    if (Math.random() > 0.3) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60));
      
      sessions.push({
        id: `session-${i}`,
        date,
        duration: Math.floor(Math.random() * 5400) + 600,
        notes: Math.random() > 0.5 ? "Practice notes here" : undefined,
      });
    }
  }
  
  return sessions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export default function Statistics() {
  const [timeRange, setTimeRange] = useState("30");
  const [sessions] = useState<PracticeSession[]>(generateMockSessions);

  const stats = useMemo(() => {
    const days = parseInt(timeRange);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    const filteredSessions = sessions.filter((s) => s.date >= cutoff);
    const totalSeconds = filteredSessions.reduce((sum, s) => sum + s.duration, 0);
    
    const dayMap = new Map<string, number>();
    filteredSessions.forEach((s) => {
      const key = s.date.toDateString();
      dayMap.set(key, (dayMap.get(key) || 0) + s.duration);
    });
    
    const daysWithPractice = dayMap.size;
    const avgPerSession = filteredSessions.length > 0 ? totalSeconds / filteredSessions.length : 0;
    const avgPerDay = daysWithPractice > 0 ? totalSeconds / daysWithPractice : 0;
    
    let currentStreak = 0;
    const checkDate = new Date();
    const dateSet = new Set(filteredSessions.map((s) => s.date.toDateString()));
    while (dateSet.has(checkDate.toDateString())) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    
    let longestStreak = 0;
    let tempStreak = 0;
    const allDates = Array.from(dayMap.keys()).map((d) => new Date(d)).sort((a, b) => b.getTime() - a.getTime());
    
    for (let i = 0; i < allDates.length; i++) {
      if (i === 0) {
        tempStreak = 1;
      } else {
        const diff = (allDates[i - 1].getTime() - allDates[i].getTime()) / (1000 * 60 * 60 * 24);
        if (diff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }
    }
    longestStreak = Math.max(longestStreak, tempStreak);
    
    return {
      totalSessions: filteredSessions.length,
      totalSeconds,
      daysWithPractice,
      avgPerSession,
      avgPerDay,
      currentStreak,
      longestStreak,
      practiceDays: Array.from(dayMap.entries()).map(([dateStr, duration]) => ({
        date: new Date(dateStr),
        duration,
      })),
      weeklyData: filteredSessions.map((s) => ({ date: s.date, duration: s.duration })),
    };
  }, [sessions, timeRange]);

  const trendData = useMemo(() => {
    const days = parseInt(timeRange);
    const data = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toDateString();
      
      const dayDuration = sessions
        .filter((s) => s.date.toDateString() === dateStr)
        .reduce((sum, s) => sum + s.duration, 0);
      
      data.push({
        date: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        minutes: Math.round(dayDuration / 60),
      });
    }
    
    return data;
  }, [sessions, timeRange]);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const weeklyGoalMinutes = 300;
  const weeklyProgress = Math.min(100, (stats.weeklyData.reduce((sum, d) => sum + d.duration, 0) / 60 / weeklyGoalMinutes) * 100);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold">Statistics</h1>
          <p className="text-muted-foreground">Track your progress and achievements</p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-36" data-testid="select-time-range">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Practice"
          value={formatDuration(stats.totalSeconds)}
          subtitle={`${stats.totalSessions} sessions`}
          icon={Clock}
        />
        <StatCard
          title="Days Practiced"
          value={`${stats.daysWithPractice}`}
          subtitle={`out of ${timeRange} days`}
          icon={Calendar}
        />
        <StatCard
          title="Avg per Day"
          value={formatDuration(stats.avgPerDay)}
          subtitle="when you practice"
          icon={TrendingUp}
        />
        <StatCard
          title="Current Streak"
          value={`${stats.currentStreak}`}
          subtitle={`Best: ${stats.longestStreak} days`}
          icon={Flame}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Weekly Goal
            </CardTitle>
            <span className="text-sm text-muted-foreground">
              {Math.round(stats.weeklyData.reduce((sum, d) => sum + d.duration, 0) / 60)}/{weeklyGoalMinutes} min
            </span>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={weeklyProgress} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {weeklyProgress >= 100 
                ? "Congratulations! You've reached your weekly goal!" 
                : `${Math.round(weeklyGoalMinutes - stats.weeklyData.reduce((sum, d) => sum + d.duration, 0) / 60)} minutes to go this week`}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Achievements
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-3">
              <div className={`text-center p-3 rounded-md ${stats.currentStreak >= 7 ? "bg-primary/10" : "bg-muted/50"}`}>
                <div className="text-2xl mb-1">7</div>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
              <div className={`text-center p-3 rounded-md ${stats.totalSessions >= 30 ? "bg-primary/10" : "bg-muted/50"}`}>
                <div className="text-2xl mb-1">30</div>
                <p className="text-xs text-muted-foreground">Sessions</p>
              </div>
              <div className={`text-center p-3 rounded-md ${stats.totalSeconds >= 36000 ? "bg-primary/10" : "bg-muted/50"}`}>
                <div className="text-2xl mb-1">10h</div>
                <p className="text-xs text-muted-foreground">Total Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Practice Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  interval="preserveStartEnd"
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value) => `${value}m`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-popover border border-popover-border rounded-md p-2 shadow-md">
                          <p className="text-sm font-medium">{payload[0].payload.date}</p>
                          <p className="text-sm text-muted-foreground">{payload[0].value} minutes</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="minutes"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <WeeklyChart data={stats.weeklyData} />
        <PracticeCalendar practiceDays={stats.practiceDays} />
      </div>
    </div>
  );
}
