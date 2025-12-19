import { useState, useCallback } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { PracticeTimer } from "@/components/PracticeTimer";
import { SessionList, type PracticeSession } from "@/components/SessionList";
import { Metronome } from "@/components/Metronome";
import { AudioRecorder } from "@/components/AudioRecorder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { FileText, Clock, Calendar, X, Target, Smile, Meh, Frown, Brain, Mic, Play, Pause } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const getMoodIcon = (mood: number) => {
  if (mood <= 2) return Frown;
  if (mood <= 3) return Meh;
  return Smile;
};

const getMoodLabel = (mood: number) => {
  const labels = ["", "Frustrated", "Tired", "Neutral", "Good", "Great"];
  return labels[mood] || "";
};

const getFocusLabel = (focus: number) => {
  const labels = ["", "Very Distracted", "Somewhat Distracted", "Neutral", "Focused", "Deeply Focused"];
  return labels[focus] || "";
};

export default function Practice() {
  const { toast } = useToast();
  const [selectedSession, setSelectedSession] = useState<PracticeSession | null>(null);
  const [recordingUrl, setRecordingUrl] = useState<string | null>(null);

  const { data: sessions = [] } = useQuery<PracticeSession[]>({
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
      setRecordingUrl(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save session. Please try again.",
        variant: "destructive",
      });
    },
  });

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

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
        <h1 className="text-2xl font-semibold">Practice</h1>
        <p className="text-muted-foreground">Start a new practice session with metronome and recording tools</p>
      </div>

      <Tabs defaultValue="timer" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="timer">Timer</TabsTrigger>
          <TabsTrigger value="metronome">Metronome</TabsTrigger>
          <TabsTrigger value="recorder">Recorder</TabsTrigger>
        </TabsList>

        <TabsContent value="timer" className="space-y-6">
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
                      Start with scales and simple exercises
                    </p>
                  </div>
                  <div className="p-3 rounded-md bg-muted/50">
                    <p className="text-sm font-medium">Use the metronome</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Switch to Metronome tab for tempo practice
                    </p>
                  </div>
                  <div className="p-3 rounded-md bg-muted/50">
                    <p className="text-sm font-medium">Record yourself</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Use Recorder tab to capture your performance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="metronome">
          <Metronome defaultBpm={120} />
        </TabsContent>

        <TabsContent value="recorder">
          <AudioRecorder />
        </TabsContent>
      </Tabs>

      <div>
        <h2 className="text-xl font-semibold mb-4">Recent Sessions</h2>
        <SessionList
          sessions={sessions}
          onSessionClick={setSelectedSession}
        />
      </div>

      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selectedSession?.name}</DialogTitle>
          </DialogHeader>
          {selectedSession && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {new Date(selectedSession.date).toLocaleDateString(undefined, {
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

              {selectedSession.focusArea && (
                <div className="flex items-center gap-2 text-sm">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Focus Area:</span>
                  <span>{selectedSession.focusArea}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-md bg-muted/50">
                  <div className="flex items-center gap-2">
                    {(() => {
                      const MoodIcon = getMoodIcon(selectedSession.mood);
                      return <MoodIcon className="h-4 w-4" />;
                    })()}
                    <span className="text-sm font-medium">Mood</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getMoodLabel(selectedSession.mood)} ({selectedSession.mood}/5)
                  </p>
                </div>
                <div className="p-3 rounded-md bg-muted/50">
                  <div className="flex items-center gap-2">
                    <Brain className="h-4 w-4" />
                    <span className="text-sm font-medium">Focus</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getFocusLabel(selectedSession.focus)} ({selectedSession.focus}/5)
                  </p>
                </div>
              </div>
              
              {selectedSession.description && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Description</h4>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                    {selectedSession.description}
                  </p>
                </div>
              )}

              {selectedSession.notes && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Notes</h4>
                  <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md whitespace-pre-wrap">
                    {selectedSession.notes}
                  </p>
                </div>
              )}

              {!selectedSession.description && !selectedSession.notes && (
                <p className="text-sm text-muted-foreground italic">No notes or description for this session</p>
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
