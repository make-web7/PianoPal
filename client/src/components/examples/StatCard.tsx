import { StatCard } from "../StatCard";
import { Clock } from "lucide-react";

export default function StatCardExample() {
  return (
    <StatCard
      title="Total Practice"
      value="24h 30m"
      subtitle="+2h from last week"
      icon={Clock}
    />
  );
}
