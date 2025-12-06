import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Clock, Calendar, TrendingUp, Flame, Smile, Brain } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { PracticeTimer } from "@/components/PracticeTimer";
import { SessionList, type PracticeSession } from "@/components/SessionList";
import { PracticeCalendar } from "@/components/PracticeCalendar";
import { WeeklyChart } from "@/components/WeeklyChart";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

export default function Dashboard() {
  const { toast } = useToast();
  
  const { data: sessions = [], isLoading } = useQuery<PracticeSession[]>({
    queryKey: ["/api/sessions"],
  });

  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: {
      name: string;
      description: string;
      notes: string;
      focusArea: string;
      mood: number;
      focus: number;
      duration: number;
    }) => {
      const res = await apiRequest("POST", "/api/sessions", sessionData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sessions"] });
      toast({
        title: "Session saved!",
        description: "Your practice session has been recorded.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const practiceDays = sessions.map((s) => ({
    date: new Date(s.date),
    duration: s.duration,
  }));
  
  const totalSeconds = sessions.reduce((sum, s) => sum + s.duration, 0);
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
  
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - 7);
  const weekSessions = sessions.filter((s) => new Date(s.date) >= weekStart);
  
  const weeklyData = weekSessions.map((s) => ({ date: new Date(s.date), duration: s.duration }));
  
  const calculateStreak = () => {
    let streak = 0;
    const dateSet = new Set(sessions.map((s) => new Date(s.date).toDateString()));
    const checkDate = new Date();
    
    while (dateSet.has(checkDate.toDateString())) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    return streak;
  };

  const avgMood = sessions.length > 0 
    ? (sessions.reduce((sum, s) => sum + s.mood, 0) / sessions.length).toFixed(1)
    : "0";

  const avgFocus = sessions.length > 0 
    ? (sessions.reduce((sum, s) => sum + s.focus, 0) / sessions.length).toFixed(1)
    : "0";

  const handleSaveSession = useCallback((sessionData: {
    name: string;
    description: string;
    notes: string;
    focusArea: string;
    mood: number;
    focus: number;
    duration: number;
  }) => {
    createSessionMutation.mutate(sessionData);
  }, [createSessionMutation]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Ready to practice?</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard
          title="Total Practice"
          value={`${totalHours}h ${totalMinutes}m`}
          subtitle="All time"
          icon={Clock}
        />
        <StatCard
          title="This Week"
          value={`${weekSessions.length}`}
          subtitle="sessions completed"
          icon={Calendar}
        />
        <StatCard
          title="Average Session"
          value={`${sessions.length > 0 ? Math.floor(totalSeconds / sessions.length / 60) : 0}m`}
          subtitle="per session"
          icon={TrendingUp}
        />
        <StatCard
          title="Current Streak"
          value={`${calculateStreak()}`}
          subtitle="days in a row"
          icon={Flame}
        />
        <StatCard
          title="Avg Mood"
          value={avgMood}
          subtitle="out of 5"
          icon={Smile}
        />
        <StatCard
          title="Avg Focus"
          value={avgFocus}
          subtitle="out of 5"
          icon={Brain}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PracticeTimer onSave={handleSaveSession} />
        <WeeklyChart data={weeklyData} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <SessionList sessions={sessions.slice(0, 10)} />
        <PracticeCalendar practiceDays={practiceDays} />
      </div>
    </div>
  );
}
