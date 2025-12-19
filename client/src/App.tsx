import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TimerProvider } from "@/contexts/TimerContext";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import Practice from "@/pages/Practice";
import Statistics from "@/pages/Statistics";
import MetronomePage from "@/pages/MetronomePage";
import RecorderPage from "@/pages/RecorderPage";
import ThemePage from "@/pages/ThemePage";
import GoalsPage from "@/pages/Goals";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/practice" component={Practice} />
      <Route path="/stats" component={Statistics} />
      <Route path="/goals" component={GoalsPage} />
      <Route path="/metronome" component={MetronomePage} />
      <Route path="/recorder" component={RecorderPage} />
      <Route path="/theme" component={ThemePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <TimerProvider>
          <SidebarProvider style={style as React.CSSProperties}>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <div className="flex flex-col flex-1 min-w-0">
                <header className="sticky top-0 z-50 flex items-center justify-between gap-2 p-3 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                  <SidebarTrigger data-testid="button-sidebar-toggle" />
                  <ThemeToggle />
                </header>
                <main className="flex-1 p-4 md:p-6 overflow-auto">
                  <Router />
                </main>
              </div>
            </div>
          </SidebarProvider>
          <Toaster />
        </TimerProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
