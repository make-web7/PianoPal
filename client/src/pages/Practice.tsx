import { useState, useCallback } from "react";
import { PracticeTimer } from "@/components/PracticeTimer";
import { SessionList, type PracticeSession } from "@/components/SessionList";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { FileText, Clock, Calendar, X } from "lucide-react";

// todo: remove mock functionality
const generateInitialSessions = (): PracticeSession[] => {
  const sessions: PracticeSession[] = [];
  const today = new Date();
  
  for (let i = 0; i < 8; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(Math.floor(Math.random() * 12) + 8, Math.floor(Math.random() * 60));
    
    sessions.push({
      id: `session-${i}`,
      date,
      duration: Math.floor(Math.random() * 4800) + 900,
      notes: i % 2 === 0 ? "Focused on technique and finger exercises" : "Practiced repertoire pieces",
    });
  }
  
  return sessions.sort((a, b) => b.date.getTime() - a.date.getTime());
};

export default function Practice() {
  const { toast } = useToast();
  const [sessions, setSessions] = useState<PracticeSession[]>(generateInitialSessions);
  const [selectedSession, setSelectedSession] = useState<PracticeSession | null>(null);

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
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
      description: `You practiced for ${Math.floor(duration / 60)} minutes.`,
    });
  }, [toast]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Practice</h1>
        <p className="text-muted-foreground">Start a new practice session or view your history</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <PracticeTimer onSave={handleSaveSession} />
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Quick Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="p-3 rounded-md bg-muted/50">
                <p className="text-sm font-medium">Warm up first</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Start with scales and simple exercises to prepare your fingers
                </p>
              </div>
              <div className="p-3 rounded-md bg-muted/50">
                <p className="text-sm font-medium">Use the metronome</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Practice slowly with a metronome for better timing
                </p>
              </div>
              <div className="p-3 rounded-md bg-muted/50">
                <p className="text-sm font-medium">Take breaks</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Rest every 25-30 minutes to prevent fatigue
                </p>
              </div>
              <div className="p-3 rounded-md bg-muted/50">
                <p className="text-sm font-medium">Record yourself</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Listen back to identify areas for improvement
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <SessionList
        sessions={sessions}
        onSessionClick={setSelectedSession}
      />

      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Session Details</DialogTitle>
          </DialogHeader>
          {selectedSession && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {selectedSession.date.toLocaleDateString(undefined, {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <Badge variant="secondary" className="font-mono">
                  <Clock className="h-3 w-3 mr-1" />
                  {formatDuration(selectedSession.duration)}
                </Badge>
              </div>
              
              {selectedSession.notes ? (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Notes</h4>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                    {selectedSession.notes}
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground italic">No notes for this session</p>
              )}
              
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setSelectedSession(null)}
              >
                <X className="h-4 w-4 mr-2" />
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
