import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Calendar } from "lucide-react";

export interface PracticeSession {
  id: string;
  date: Date;
  duration: number;
  notes?: string;
}

interface SessionListProps {
  sessions: PracticeSession[];
  onSessionClick?: (session: PracticeSession) => void;
}

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
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    }
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }
    return date.toLocaleDateString(undefined, {
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
          <ScrollArea className="h-64">
            <div className="space-y-2 pr-4">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-start gap-3 p-3 rounded-md bg-muted/50 hover-elevate active-elevate-2 cursor-pointer"
                  onClick={() => onSessionClick?.(session)}
                  data-testid={`session-item-${session.id}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <span className="text-sm font-medium">
                        {formatDate(session.date)}
                      </span>
                      <Badge variant="outline" className="font-mono text-xs">
                        {formatDuration(session.duration)}
                      </Badge>
                    </div>
                    {session.notes && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2 flex items-start gap-1">
                        <FileText className="h-3 w-3 mt-0.5 flex-shrink-0" />
                        <span>{session.notes}</span>
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
