import { createContext, useContext, useState, useEffect, useRef, useCallback, type ReactNode } from "react";

interface TimerState {
  seconds: number;
  isRunning: boolean;
  notes: string;
}

interface TimerContextType {
  seconds: number;
  isRunning: boolean;
  notes: string;
  setNotes: (notes: string) => void;
  start: () => void;
  pause: () => void;
  reset: () => void;
  formatTime: (totalSeconds: number) => string;
}

const TimerContext = createContext<TimerContextType | null>(null);

export function TimerProvider({ children }: { children: ReactNode }) {
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

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback(() => {
    setIsRunning(false);
    setSeconds(0);
    setNotes("");
  }, []);

  return (
    <TimerContext.Provider
      value={{
        seconds,
        isRunning,
        notes,
        setNotes,
        start,
        pause,
        reset,
        formatTime,
      }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer must be used within a TimerProvider");
  }
  return context;
}
