import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Calendar, Smile, Meh, Frown, Brain, Target } from "lucide-react";

export interface PracticeSession {
  id: string;
  name: string;
  description?: string | null;
  notes?: string | null;
  focusArea?: string | null;
  mood: number;
  focus: number;
  duration: number;
  date: Date;
}

interface SessionListProps {
  sessions: PracticeSession[];
  onSessionClick?: (session: PracticeSession) => void;
}

const getMoodIcon = (mood: number) => {
  if (mood <= 2) return Frown;
  if (mood <= 3) return Meh;
  return Smile;
};

const getMoodColor = (mood: number) => {
  const colors = ["", "text-red-500", "text-orange-500", "text-yellow-500", "text-lime-500", "text-green-500"];
  return colors[mood] || "text-muted-foreground";
};

const getFocusLabel = (focus: number) => {
  const labels = ["", "Very Distracted", "Distracted", "Neutral", "Focused", "Deeply Focused"];
  return labels[focus] || "";
};

export function SessionList({ sessions, onSessionClick }: SessionListProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatDate = (date: Date) => {
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return "Today";
    }
    if (d.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Recent Sessions
        </CardTitle>
        <Badge variant="secondary" className="text-xs">
          {sessions.length} sessions
        </Badge>
      </CardHeader>
      <CardContent>
        {sessions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-10 w-10 mx-auto mb-3 opacity-50" />
            <p>No practice sessions yet</p>
            <p className="text-sm">Start practicing to see your history here</p>
          </div>
        ) : (
          <ScrollArea className="h-80">
            <div className="space-y-3 pr-4">
              {sessions.map((session) => {
                const MoodIcon = getMoodIcon(session.mood);
                return (
                  <div
                    key={session.id}
                    className="p-3 rounded-md bg-muted/50 hover-elevate active-elevate-2 cursor-pointer space-y-2"
                    onClick={() => onSessionClick?.(session)}
                    data-testid={`session-item-${session.id}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{session.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(session.date)}
                        </p>
                      </div>
                      <Badge variant="outline" className="font-mono text-xs flex-shrink-0">
                        {formatDuration(session.duration)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 flex-wrap text-xs">
                      {session.focusArea && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Target className="h-3 w-3" />
                          <span>{session.focusArea}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <MoodIcon className={`h-3 w-3 ${getMoodColor(session.mood)}`} />
                      </div>
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Brain className="h-3 w-3" />
                        <span>{getFocusLabel(session.focus)}</span>
                      </div>
                    </div>

                    {(session.notes || session.description) && (
                      <p className="text-xs text-muted-foreground line-clamp-2 flex items-start gap-1">
                        <FileText className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <span>{session.description || session.notes}</span>
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
