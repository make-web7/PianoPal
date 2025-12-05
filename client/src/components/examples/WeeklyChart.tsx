import { WeeklyChart } from "../WeeklyChart";

// todo: remove mock functionality
const generateMockData = () => {
  const data = [];
  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    if (Math.random() > 0.2) {
      data.push({
        date,
        duration: Math.floor(Math.random() * 5400) + 900,
      });
    }
  }
  return data;
};

export default function WeeklyChartExample() {
  return <WeeklyChart data={generateMockData()} />;
}
