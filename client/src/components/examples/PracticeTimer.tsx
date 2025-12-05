import { PracticeTimer } from "../PracticeTimer";

export default function PracticeTimerExample() {
  return (
    <PracticeTimer
      onSave={(duration, notes) => {
        console.log("Session saved:", { duration, notes });
      }}
    />
  );
}
