import { useState, useRef, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mic, Square, Play, Pause, Trash2, Download, AudioLines } from "lucide-react";

interface Recording {
  id: string;
  blob: Blob;
  url: string;
  date: Date;
  duration: number;
}

interface AudioRecorderProps {
  onRecordingComplete?: (recording: Recording) => void;
}

export function AudioRecorder({ onRecordingComplete }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      const updateLevel = () => {
        if (analyserRef.current) {
          const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
          setAudioLevel(average / 255);
        }
        animationRef.current = requestAnimationFrame(updateLevel);
      };
      updateLevel();
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        audioChunksRef.current.push(e.data);
      };
      
      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(audioChunksRef.current, { type: "audio/webm" });
        const url = URL.createObjectURL(blob);
        const newRecording: Recording = {
          id: Date.now().toString(),
          blob,
          url,
          date: new Date(),
          duration: recordingDuration,
        };
        setRecordings((prev) => [newRecording, ...prev]);
        if (onRecordingComplete) {
          onRecordingComplete(newRecording);
        }
        stream.getTracks().forEach((track) => track.stop());
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
        setAudioLevel(0);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      setRecordingDuration(0);
      
      timerRef.current = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
  };

  const playRecording = useCallback((recording: Recording) => {
    if (playingId === recording.id) {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
        audioElementRef.current = null;
      }
      setPlayingId(null);
    } else {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      const audio = new Audio(recording.url);
      audio.onended = () => setPlayingId(null);
      audio.play();
      audioElementRef.current = audio;
      setPlayingId(recording.id);
    }
  }, [playingId]);

  const deleteRecording = useCallback((id: string) => {
    setRecordings((prev) => {
      const recording = prev.find((r) => r.id === id);
      if (recording) {
        URL.revokeObjectURL(recording.url);
      }
      return prev.filter((r) => r.id !== id);
    });
    if (playingId === id) {
      if (audioElementRef.current) {
        audioElementRef.current.pause();
      }
      setPlayingId(null);
    }
  }, [playingId]);

  const downloadRecording = useCallback((recording: Recording) => {
    const a = document.createElement("a");
    a.href = recording.url;
    a.download = `practice-recording-${recording.date.toISOString().slice(0, 10)}.webm`;
    a.click();
  }, []);

  useEffect(() => {
    return () => {
      recordings.forEach((r) => URL.revokeObjectURL(r.url));
    };
  }, []);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="flex items-center gap-2">
          <AudioLines className="h-5 w-5" />
          Recording Studio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center justify-center py-6">
          <div
            className={`relative w-32 h-32 rounded-full flex items-center justify-center transition-all ${
              isRecording
                ? "bg-destructive animate-recording-pulse"
                : "bg-primary"
            }`}
            style={{
              transform: isRecording ? `scale(${1 + audioLevel * 0.3})` : "scale(1)",
            }}
          >
            <Mic className="h-12 w-12 text-primary-foreground" />
          </div>
          
          {isRecording && (
            <div className="mt-4 text-center">
              <div className="text-2xl font-bold font-mono tabular-nums text-destructive" data-testid="recording-duration">
                {formatDuration(recordingDuration)}
              </div>
              <p className="text-sm text-muted-foreground">Recording...</p>
            </div>
          )}
        </div>

        <Button
          className="w-full"
          size="lg"
          variant={isRecording ? "destructive" : "default"}
          onClick={isRecording ? stopRecording : startRecording}
          data-testid="button-record-toggle"
        >
          {isRecording ? (
            <>
              <Square className="h-4 w-4 mr-2" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="h-4 w-4 mr-2" />
              Start Recording
            </>
          )}
        </Button>

        {recordings.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Your Recordings</h3>
            <ScrollArea className="h-48">
              <div className="space-y-2 pr-4">
                {recordings.map((recording) => (
                  <div
                    key={recording.id}
                    className="flex items-center justify-between gap-2 p-3 rounded-md bg-muted/50"
                    data-testid={`recording-item-${recording.id}`}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {recording.date.toLocaleDateString()} at{" "}
                        {recording.date.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDuration(recording.duration)}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => playRecording(recording)}
                        data-testid={`button-play-${recording.id}`}
                      >
                        {playingId === recording.id ? (
                          <Pause className="h-4 w-4" />
                        ) : (
                          <Play className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => downloadRecording(recording)}
                        data-testid={`button-download-${recording.id}`}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => deleteRecording(recording.id)}
                        data-testid={`button-delete-${recording.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
