import { SessionList, type PracticeSession } from "../SessionList";

// todo: remove mock functionality
const mockSessions: PracticeSession[] = [
  {
    id: "1",
    date: new Date(),
    duration: 2700,
    notes: "Worked on Chopin Nocturne Op. 9 No. 2. Focused on left hand arpeggios.",
  },
  {
    id: "2",
    date: new Date(Date.now() - 86400000),
    duration: 3600,
    notes: "Scales practice and sight reading exercises.",
  },
  {
    id: "3",
    date: new Date(Date.now() - 172800000),
    duration: 1800,
    notes: "Quick warm-up session before lesson.",
  },
  {
    id: "4",
    date: new Date(Date.now() - 259200000),
    duration: 4500,
  },
];

export default function SessionListExample() {
  return (
    <SessionList
      sessions={mockSessions}
      onSessionClick={(session) => console.log("Session clicked:", session)}
    />
  );
}
