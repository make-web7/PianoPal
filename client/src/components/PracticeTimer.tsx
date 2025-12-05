import { useState, useEffect, useRef, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Play, Pause, Square, Save, Music } from "lucide-react";

interface PracticeTimerProps {
  onSave?: (duration: number, notes: string) => void;
}

export function PracticeTimer({ onSave }: PracticeTimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [notes, setNotes] = useState("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const formatTime = useCallback((totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleStop = () => {
    setIsRunning(false);
    setSeconds(0);
    setNotes("");
  };

  const handleSave = () => {
    if (onSave && seconds > 0) {
      onSave(seconds, notes);
    }
    handleStop();
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="flex items-center gap-2">
          <Music className="h-5 w-5" />
          Practice Session
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center py-8">
          <div
            className="text-6xl md:text-7xl font-bold font-mono tabular-nums tracking-tight"
            data-testid="timer-display"
          >
            {formatTime(seconds)}
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {isRunning ? "Session in progress..." : seconds > 0 ? "Session paused" : "Ready to practice"}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {!isRunning ? (
            <Button size="lg" onClick={handleStart} data-testid="button-start-timer">
              <Play className="h-4 w-4 mr-2" />
              {seconds > 0 ? "Resume" : "Start"}
            </Button>
          ) : (
            <Button size="lg" variant="secondary" onClick={handlePause} data-testid="button-pause-timer">
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </Button>
          )}
          <Button
            size="lg"
            variant="outline"
            onClick={handleStop}
            disabled={seconds === 0}
            data-testid="button-stop-timer"
          >
            <Square className="h-4 w-4 mr-2" />
            Reset
          </Button>
          <Button
            size="lg"
            onClick={handleSave}
            disabled={seconds === 0}
            data-testid="button-save-session"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Session
          </Button>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Session Notes</label>
          <Textarea
            placeholder="What did you practice today? Any observations or goals..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-24 resize-none"
            data-testid="textarea-session-notes"
          />
        </div>
      </CardContent>
    </Card>
  );
}
