import { ThemeCustomizer } from "@/components/ThemeCustomizer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Settings, Sun, Moon } from "lucide-react";

export default function ThemePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Appearance</h1>
        <p className="text-muted-foreground">Customize how your practice tracker looks</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <ThemeCustomizer />
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Display Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="font-medium">Dark Mode</p>
                <p className="text-sm text-muted-foreground">
                  Toggle between light and dark themes
                </p>
              </div>
              <ThemeToggle />
            </div>
            
            <div className="border-t pt-4 space-y-3">
              <p className="text-sm font-medium text-muted-foreground">Preview Elements</p>
              
              <div className="flex flex-wrap gap-2">
                <Button>Primary Button</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge>Default Badge</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
              
              <div className="flex gap-4 p-4 rounded-md bg-muted/50">
                <div className="flex-1">
                  <p className="font-medium">Sample Card</p>
                  <p className="text-sm text-muted-foreground">
                    This shows how your chosen theme looks
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>About Themes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="p-4 rounded-md bg-muted/50 text-center">
              <Sun className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h4 className="font-medium">Light Mode</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Best for well-lit environments
              </p>
            </div>
            <div className="p-4 rounded-md bg-muted/50 text-center">
              <Moon className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <h4 className="font-medium">Dark Mode</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Easier on the eyes at night
              </p>
            </div>
            <div className="p-4 rounded-md bg-muted/50 text-center">
              <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-br from-primary to-primary/50" />
              <h4 className="font-medium">Custom Colors</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Personalize your experience
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
