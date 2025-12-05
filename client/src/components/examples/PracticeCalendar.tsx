import { PracticeCalendar } from "../PracticeCalendar";

// todo: remove mock functionality
const generateMockPracticeDays = () => {
  const days = [];
  const today = new Date();
  for (let i = 0; i < 84; i++) {
    if (Math.random() > 0.4) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      days.push({
        date,
        duration: Math.floor(Math.random() * 7200) + 600,
      });
    }
  }
  return days;
};

export default function PracticeCalendarExample() {
  return <PracticeCalendar practiceDays={generateMockPracticeDays()} />;
}
