import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Play, Pause, Square, Save, Music, Smile, Meh, Frown, Brain, Target } from "lucide-react";
import { useTimer } from "@/contexts/TimerContext";

interface SessionData {
  name: string;
  description: string;
  notes: string;
  focusArea: string;
  mood: number;
  focus: number;
  duration: number;
}

interface PracticeTimerProps {
  onSave?: (session: SessionData) => void;
}

const moodOptions = [
  { value: 1, label: "Frustrated", icon: Frown, color: "text-red-500" },
  { value: 2, label: "Tired", icon: Meh, color: "text-orange-500" },
  { value: 3, label: "Neutral", icon: Meh, color: "text-yellow-500" },
  { value: 4, label: "Good", icon: Smile, color: "text-lime-500" },
  { value: 5, label: "Great", icon: Smile, color: "text-green-500" },
];

const focusOptions = [
  { value: 1, label: "Very Distracted" },
  { value: 2, label: "Somewhat Distracted" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Focused" },
  { value: 5, label: "Deeply Focused" },
];

const focusAreaOptions = [
  "Scales & Exercises",
  "Sight Reading",
  "Repertoire",
  "Technique",
  "Music Theory",
  "Improvisation",
  "Ear Training",
  "Other",
];

export function PracticeTimer({ onSave }: PracticeTimerProps) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [notes, setNotes] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [sessionName, setSessionName] = useState("");
  const [description, setDescription] = useState("");
  const [focusArea, setFocusArea] = useState("");
  const [customFocusArea, setCustomFocusArea] = useState("");
  const [mood, setMood] = useState(3);
  const [focus, setFocus] = useState(3);
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
    setSessionName("");
    setDescription("");
    setFocusArea("");
    setCustomFocusArea("");
    setMood(3);
    setFocus(3);
  };

  const handleSaveClick = () => {
    if (seconds > 0) {
      setIsRunning(false);
      const today = new Date();
      const defaultName = `Practice Session - ${today.toLocaleDateString()}`;
      setSessionName(defaultName);
      setShowSaveDialog(true);
    }
  };

  const handleConfirmSave = () => {
    if (onSave && seconds > 0) {
      const finalFocusArea = focusArea === "Other" && customFocusArea.trim() 
        ? customFocusArea.trim() 
        : focusArea;
      onSave({
        name: sessionName || `Practice Session - ${new Date().toLocaleDateString()}`,
        description,
        notes,
        focusArea: finalFocusArea,
        mood,
        focus,
        duration: seconds,
      });
    }
    setShowSaveDialog(false);
    handleStop();
  };

  return (
    <>
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
              onClick={handleSaveClick}
              disabled={seconds === 0}
              data-testid="button-save-session"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Session
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="session-notes">Session Notes</Label>
            <Textarea
              id="session-notes"
              placeholder="Jot down notes during your practice..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="min-h-24 resize-none"
              data-testid="textarea-session-notes"
            />
            <p className="text-xs text-muted-foreground">
              Write notes as you practice - they'll be saved with your session
            </p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Save Practice Session</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="session-name">Session Name</Label>
              <Input
                id="session-name"
                placeholder="e.g., Morning Scales Practice"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                data-testid="input-session-name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="focus-area">What did you focus on?</Label>
              <Select value={focusArea} onValueChange={setFocusArea}>
                <SelectTrigger data-testid="select-focus-area">
                  <SelectValue placeholder="Select focus area" />
                </SelectTrigger>
                <SelectContent>
                  {focusAreaOptions.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {focusArea === "Other" && (
                <Input
                  placeholder="Describe what you focused on..."
                  value={customFocusArea}
                  onChange={(e) => setCustomFocusArea(e.target.value)}
                  className="mt-2"
                  data-testid="input-custom-focus-area"
                />
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what you worked on..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-20 resize-none"
                data-testid="textarea-description"
              />
            </div>

            <div className="space-y-2">
              <Label>How was your mood?</Label>
              <div className="flex gap-2 flex-wrap">
                {moodOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <Button
                      key={option.value}
                      type="button"
                      variant={mood === option.value ? "default" : "outline"}
                      className="flex-1 min-w-16"
                      onClick={() => setMood(option.value)}
                      data-testid={`button-mood-${option.value}`}
                    >
                      <Icon className={`h-4 w-4 mr-1 ${mood === option.value ? "" : option.color}`} />
                      <span className="text-xs hidden sm:inline">{option.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label>How focused were you?</Label>
              <div className="flex gap-2 flex-wrap">
                {focusOptions.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={focus === option.value ? "default" : "outline"}
                    className="flex-1 min-w-16"
                    onClick={() => setFocus(option.value)}
                    data-testid={`button-focus-${option.value}`}
                  >
                    <Brain className="h-4 w-4 mr-1" />
                    <span className="text-xs">{option.value}</span>
                  </Button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground text-center">
                {focusOptions.find((o) => o.value === focus)?.label}
              </p>
            </div>

            <div className="p-3 rounded-md bg-muted/50">
              <div className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4" />
                <span className="font-medium">Duration:</span>
                <span className="font-mono">{formatTime(seconds)}</span>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmSave} data-testid="button-confirm-save">
              <Save className="h-4 w-4 mr-2" />
              Save Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
