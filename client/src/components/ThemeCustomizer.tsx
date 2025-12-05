import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Palette, Check } from "lucide-react";

interface ThemeOption {
  id: string;
  name: string;
  primary: string;
  description: string;
}

const themes: ThemeOption[] = [
  { id: "default", name: "Modern Purple", primary: "262 83% 58%", description: "Clean and contemporary" },
  { id: "piano", name: "Classic Piano", primary: "0 0% 15%", description: "Elegant black and white" },
  { id: "wood", name: "Warm Wood", primary: "25 70% 45%", description: "Cozy amber tones" },
  { id: "ocean", name: "Ocean Blue", primary: "210 80% 50%", description: "Calm and focused" },
  { id: "forest", name: "Forest Green", primary: "150 60% 35%", description: "Natural and serene" },
  { id: "rose", name: "Rose Gold", primary: "350 60% 55%", description: "Soft and elegant" },
];

export function ThemeCustomizer() {
  const [selectedTheme, setSelectedTheme] = useState("default");

  useEffect(() => {
    const stored = localStorage.getItem("color-theme");
    if (stored) {
      setSelectedTheme(stored);
      applyTheme(stored);
    }
  }, []);

  const applyTheme = (themeId: string) => {
    const theme = themes.find((t) => t.id === themeId);
    if (theme) {
      document.documentElement.style.setProperty("--primary", theme.primary);
      document.documentElement.style.setProperty("--ring", theme.primary);
      document.documentElement.style.setProperty("--sidebar-primary", theme.primary);
      document.documentElement.style.setProperty("--sidebar-ring", theme.primary);
      document.documentElement.style.setProperty("--chart-1", theme.primary);
    }
  };

  const handleThemeChange = (themeId: string) => {
    setSelectedTheme(themeId);
    applyTheme(themeId);
    localStorage.setItem("color-theme", themeId);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Theme
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {themes.map((theme) => (
            <Button
              key={theme.id}
              variant="outline"
              className={`h-auto flex-col items-start p-3 gap-2 ${
                selectedTheme === theme.id ? "border-primary" : ""
              }`}
              onClick={() => handleThemeChange(theme.id)}
              data-testid={`button-theme-${theme.id}`}
            >
              <div className="flex items-center justify-between w-full gap-2">
                <div
                  className="w-5 h-5 rounded-full flex-shrink-0"
                  style={{ backgroundColor: `hsl(${theme.primary})` }}
                />
                {selectedTheme === theme.id && (
                  <Check className="h-4 w-4 text-primary flex-shrink-0" />
                )}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">{theme.name}</p>
                <p className="text-xs text-muted-foreground">{theme.description}</p>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
