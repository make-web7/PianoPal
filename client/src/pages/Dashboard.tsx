import { useState, useCallback } from "react";
import { Clock, Calendar, TrendingUp, Flame } from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { PracticeTimer } from "@/components/PracticeTimer";
import { SessionList, type PracticeSession } from "@/components/SessionList";
import { PracticeCalendar } from "@/components/PracticeCalendar";
import { WeeklyChart } from "@/components/WeeklyChart";
import { useToast } from "@/hooks/use-toast";

// todo: remove mock functionality
const generateMockSessions = (): PracticeSession[] => {
  const sessions: PracticeSession[] = [];
  const today = new Date();
  
  for (let i = 0; i < 15; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - Math.floor(i / 2));
    date.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60));
    
    sessions.push({
      id: `session-${i}`,
      date,
      duration: Math.floor(Math.random() * 5400) + 600,
      notes: i % 3 === 0 ? "Worked on scales and arpeggios" : i % 3 === 1 ? "Practiced Chopin pieces" : undefined,
    });
  }
  
  return sessions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

const generateMockPracticeDays = (sessions: PracticeSession[]) => {
  const dayMap = new Map<string, number>();
  
  sessions.forEach((session) => {
    const key = session.date.toISOString().slice(0, 10);
    dayMap.set(key, (dayMap.get(key) || 0) + session.duration);
  });
  
  return Array.from(dayMap.entries()).map(([dateStr, duration]) => ({
    date: new Date(dateStr),
    duration,
  }));
};

export default function Dashboard() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<PracticeSession[]>(generateMockSessions);

  const practiceDays = generateMockPracticeDays(sessions);
  
  const totalSeconds = sessions.reduce((sum, s) => sum + s.duration, 0);
  const totalHours = Math.floor(totalSeconds / 3600);
  const totalMinutes = Math.floor((totalSeconds % 3600) / 60);
  
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(weekStart.getDate() - 7);
  const weekSessions = sessions.filter((s) => s.date >= weekStart);
  
  const weeklyData = weekSessions.map((s) => ({ date: s.date, duration: s.duration }));
  
  const calculateStreak = () => {
    let streak = 0;
    const dateSet = new Set(sessions.map((s) => s.date.toDateString()));
    const checkDate = new Date();
    
    while (dateSet.has(checkDate.toDateString())) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }
    return streak;
  };

  const handleSaveSession = useCallback((duration: number, notes: string) => {
    const newSession: PracticeSession = {
      id: `session-${Date.now()}`,
      date: new Date(),
      duration,
      notes: notes || undefined,
    };
    
    setSessions((prev) => [newSession, ...prev]);
    toast({
      title: "Session saved!",
      description: `Great practice! You practiced for ${Math.floor(duration / 60)} minutes.`,
    });
  }, [toast]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Ready to practice?</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
