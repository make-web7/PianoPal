import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Target, Calendar, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface Goals {
  id: string;
  dailyMinutes: number;
  weeklyMinutes: number;
  monthlyMinutes: number;
}

export default function GoalsPage() {
  const { toast } = useToast();
  const [dailyMinutes, setDailyMinutes] = useState("");
  const [weeklyMinutes, setWeeklyMinutes] = useState("");
  const [monthlyMinutes, setMonthlyMinutes] = useState("");

  const { data: goals } = useQuery<Goals>({
    queryKey: ["/api/goals"],
  });

  const updateGoalsMutation = useMutation({
    mutationFn: async (newGoals: {
      dailyMinutes: number;
      weeklyMinutes: number;
      monthlyMinutes: number;
    }) => {
      const res = await apiRequest("POST", "/api/goals", newGoals);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      toast({
        title: "Goals updated!",
        description: "Your practice goals have been saved.",
      });
      setDailyMinutes("");
      setWeeklyMinutes("");
      setMonthlyMinutes("");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update goals. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSaveGoals = () => {
    const daily = dailyMinutes ? parseInt(dailyMinutes) : goals?.dailyMinutes || 30;
    const weekly = weeklyMinutes ? parseInt(weeklyMinutes) : goals?.weeklyMinutes || 210;
    const monthly = monthlyMinutes ? parseInt(monthlyMinutes) : goals?.monthlyMinutes || 900;

    if (daily <= 0 || weekly <= 0 || monthly <= 0) {
      toast({
        title: "Invalid input",
        description: "All goals must be greater than 0.",
        variant: "destructive",
      });
      return;
    }

    updateGoalsMutation.mutate({ dailyMinutes: daily, weeklyMinutes: weekly, monthlyMinutes: monthly });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Practice Goals</h1>
        <p className="text-muted-foreground">Set your daily, weekly, and monthly practice targets</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-5 w-5" />
              Daily Goal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-3xl font-bold">{goals?.dailyMinutes || 30}</p>
              <p className="text-xs text-muted-foreground">minutes per day</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-5 w-5" />
              Weekly Goal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-3xl font-bold">{goals?.weeklyMinutes || 210}</p>
              <p className="text-xs text-muted-foreground">minutes per week</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Target className="h-5 w-5" />
              Monthly Goal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-3xl font-bold">{goals?.monthlyMinutes || 900}</p>
              <p className="text-xs text-muted-foreground">minutes per month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Your Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="daily">Daily Goal (minutes)</Label>
            <Input
              id="daily"
              type="number"
              placeholder={`${goals?.dailyMinutes || 30}`}
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(e.target.value)}
              min="1"
              data-testid="input-daily-goal"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="weekly">Weekly Goal (minutes)</Label>
            <Input
              id="weekly"
              type="number"
              placeholder={`${goals?.weeklyMinutes || 210}`}
              value={weeklyMinutes}
              onChange={(e) => setWeeklyMinutes(e.target.value)}
              min="1"
              data-testid="input-weekly-goal"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="monthly">Monthly Goal (minutes)</Label>
            <Input
              id="monthly"
              type="number"
              placeholder={`${goals?.monthlyMinutes || 900}`}
              value={monthlyMinutes}
              onChange={(e) => setMonthlyMinutes(e.target.value)}
              min="1"
              data-testid="input-monthly-goal"
            />
          </div>

          <Button
            onClick={handleSaveGoals}
            disabled={updateGoalsMutation.isPending}
            className="w-full"
            data-testid="button-save-goals"
          >
            {updateGoalsMutation.isPending ? "Saving..." : "Save Goals"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
