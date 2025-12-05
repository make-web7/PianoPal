import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Play, Square, Minus, Plus, Timer } from "lucide-react";

interface MetronomeProps {
  defaultBpm?: number;
}

export function Metronome({ defaultBpm = 120 }: MetronomeProps) {
  const [bpm, setBpm] = useState(defaultBpm);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentBeat, setCurrentBeat] = useState(0);
  const [timeSignature, setTimeSignature] = useState("4/4");
  const [isPulsing, setIsPulsing] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const beatsPerMeasure = parseInt(timeSignature.split("/")[0]);

  const playClick = useCallback((isAccent: boolean) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = isAccent ? 1000 : 800;
    oscillator.type = "sine";
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }, []);

  useEffect(() => {
    if (isPlaying) {
      const intervalMs = (60 / bpm) * 1000;
      
      intervalRef.current = setInterval(() => {
        setCurrentBeat((prev) => {
          const next = (prev + 1) % beatsPerMeasure;
          playClick(next === 0);
          return next;
        });
        setIsPulsing(true);
        setTimeout(() => setIsPulsing(false), 100);
      }, intervalMs);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      setCurrentBeat(0);
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, bpm, beatsPerMeasure, playClick]);

  const adjustBpm = (delta: number) => {
    setBpm((prev) => Math.max(20, Math.min(300, prev + delta)));
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="flex items-center gap-2">
          <Timer className="h-5 w-5" />
          Metronome
        </CardTitle>
        <Select value={timeSignature} onValueChange={setTimeSignature}>
          <SelectTrigger className="w-20" data-testid="select-time-signature">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2/4">2/4</SelectItem>
            <SelectItem value="3/4">3/4</SelectItem>
            <SelectItem value="4/4">4/4</SelectItem>
            <SelectItem value="6/8">6/8</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center py-4">
          <div
            className={`w-24 h-24 rounded-full bg-primary flex items-center justify-center transition-transform duration-100 ${
              isPulsing ? "animate-pulse-beat" : ""
            }`}
            data-testid="beat-indicator"
          >
            <span className="text-3xl font-bold text-primary-foreground font-mono">
              {currentBeat + 1}
            </span>
          </div>
          
          <div className="flex items-center gap-2 mt-4">
            {Array.from({ length: beatsPerMeasure }).map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-colors ${
                  i === currentBeat && isPlaying
                    ? i === 0
                      ? "bg-primary"
                      : "bg-primary/70"
                    : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <Button
              size="icon"
              variant="outline"
              onClick={() => adjustBpm(-10)}
              data-testid="button-bpm-minus-10"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => adjustBpm(-1)}
              data-testid="button-bpm-minus-1"
            >
              <Minus className="h-3 w-3" />
            </Button>
            <div className="text-center w-28">
              <div className="text-4xl font-bold font-mono tabular-nums" data-testid="bpm-display">
                {bpm}
              </div>
              <div className="text-xs text-muted-foreground">BPM</div>
            </div>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => adjustBpm(1)}
              data-testid="button-bpm-plus-1"
            >
              <Plus className="h-3 w-3" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => adjustBpm(10)}
              data-testid="button-bpm-plus-10"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          <Slider
            value={[bpm]}
            onValueChange={([value]) => setBpm(value)}
            min={20}
            max={300}
            step={1}
            className="w-full"
            data-testid="slider-bpm"
          />

          <div className="flex justify-between text-xs text-muted-foreground px-1">
            <span>20</span>
            <span>Tempo</span>
            <span>300</span>
          </div>
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={() => setIsPlaying(!isPlaying)}
          data-testid="button-metronome-toggle"
        >
          {isPlaying ? (
            <>
              <Square className="h-4 w-4 mr-2" />
              Stop
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Start
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
