import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Clock, Calendar, TrendingUp, Flame, Award, Target, Smile, Brain, Meh, Frown } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { WeeklyChart } from "@/components/WeeklyChart";
import { PracticeCalendar } from "@/components/PracticeCalendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import type { PracticeSession } from "@/components/SessionList";
import { useState } from "react";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function Statistics() {
  const [timeRange, setTimeRange] = useState("30");

  const { data: sessions = [] } = useQuery<PracticeSession[]>({
    queryKey: ["/api/sessions"],
  });

  const stats = useMemo(() => {
    const days = parseInt(timeRange);
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    
    const filteredSessions = sessions.filter((s) => new Date(s.date) >= cutoff);
    const totalSeconds = filteredSessions.reduce((sum, s) => sum + s.duration, 0);
    
    const dayMap = new Map<string, number>();
    filteredSessions.forEach((s) => {
      const key = new Date(s.date).toDateString();
      dayMap.set(key, (dayMap.get(key) || 0) + s.duration);
    });
    
    const daysWithPractice = dayMap.size;
    const avgPerSession = filteredSessions.length > 0 ? totalSeconds / filteredSessions.length : 0;
    const avgPerDay = daysWithPractice > 0 ? totalSeconds / daysWithPractice : 0;
    
    let currentStreak = 0;
    const checkDate = new Date();
    const dateSet = new Set(filteredSessions.map((s) => new Date(s.date).toDateString()));
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

    const avgMood = filteredSessions.length > 0 
      ? filteredSessions.reduce((sum, s) => sum + s.mood, 0) / filteredSessions.length 
      : 0;
    const avgFocus = filteredSessions.length > 0 
      ? filteredSessions.reduce((sum, s) => sum + s.focus, 0) / filteredSessions.length 
      : 0;

    const focusAreaCounts = new Map<string, number>();
    filteredSessions.forEach((s) => {
      if (s.focusArea) {
        focusAreaCounts.set(s.focusArea, (focusAreaCounts.get(s.focusArea) || 0) + 1);
      }
    });
    const focusAreaData = Array.from(focusAreaCounts.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);

    const moodDistribution = [1, 2, 3, 4, 5].map((level) => ({
      level,
      count: filteredSessions.filter((s) => s.mood === level).length,
    }));

    const focusDistribution = [1, 2, 3, 4, 5].map((level) => ({
      level,
      count: filteredSessions.filter((s) => s.focus === level).length,
    }));
    
    return {
      totalSessions: filteredSessions.length,
      totalSeconds,
      daysWithPractice,
      avgPerSession,
      avgPerDay,
      currentStreak,
      longestStreak,
      avgMood,
      avgFocus,
      focusAreaData,
      moodDistribution,
      focusDistribution,
      practiceDays: Array.from(dayMap.entries()).map(([dateStr, duration]) => ({
        date: new Date(dateStr),
        duration,
      })),
      weeklyData: filteredSessions.map((s) => ({ date: new Date(s.date), duration: s.duration })),
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
      
      const daySessions = sessions.filter((s) => new Date(s.date).toDateString() === dateStr);
      const dayDuration = daySessions.reduce((sum, s) => sum + s.duration, 0);
      const dayMood = daySessions.length > 0 ? daySessions.reduce((sum, s) => sum + s.mood, 0) / daySessions.length : null;
      const dayFocus = daySessions.length > 0 ? daySessions.reduce((sum, s) => sum + s.focus, 0) / daySessions.length : null;
      
      data.push({
        date: date.toLocaleDateString(undefined, { month: "short", day: "numeric" }),
        minutes: Math.round(dayDuration / 60),
        mood: dayMood,
        focus: dayFocus,
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

  const getMoodLabel = (mood: number) => {
    const labels = ["", "Frustrated", "Tired", "Neutral", "Good", "Great"];
    return labels[Math.round(mood)] || "";
  };

  const getFocusLabel = (focus: number) => {
    const labels = ["", "Very Distracted", "Distracted", "Neutral", "Focused", "Deeply Focused"];
    return labels[Math.round(focus)] || "";
  };

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
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
        <StatCard
          title="Avg Mood"
          value={stats.avgMood.toFixed(1)}
          subtitle={getMoodLabel(stats.avgMood)}
          icon={Smile}
        />
        <StatCard
          title="Avg Focus"
          value={stats.avgFocus.toFixed(1)}
          subtitle={getFocusLabel(stats.avgFocus)}
          icon={Brain}
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

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smile className="h-5 w-5" />
              Mood Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData.filter((d) => d.mood !== null)}>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={[1, 5]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length && payload[0].value) {
                        return (
                          <div className="bg-popover border border-popover-border rounded-md p-2 shadow-md">
                            <p className="text-sm font-medium">{payload[0].payload.date}</p>
                            <p className="text-sm text-muted-foreground">
                              Mood: {(payload[0].value as number).toFixed(1)}/5
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="hsl(var(--chart-4))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              Focus Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData.filter((d) => d.focus !== null)}>
                  <XAxis
                    dataKey="date"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    interval="preserveStartEnd"
                  />
                  <YAxis
                    domain={[1, 5]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length && payload[0].value) {
                        return (
                          <div className="bg-popover border border-popover-border rounded-md p-2 shadow-md">
                            <p className="text-sm font-medium">{payload[0].payload.date}</p>
                            <p className="text-sm text-muted-foreground">
                              Focus: {(payload[0].value as number).toFixed(1)}/5
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="focus"
                    stroke="hsl(var(--chart-2))"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {stats.focusAreaData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Practice Focus Areas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.focusAreaData} layout="vertical">
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
                    width={120}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-popover border border-popover-border rounded-md p-2 shadow-md">
                            <p className="text-sm font-medium">{payload[0].payload.name}</p>
                            <p className="text-sm text-muted-foreground">{payload[0].value} sessions</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

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
