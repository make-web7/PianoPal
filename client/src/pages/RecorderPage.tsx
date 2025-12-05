import { AudioRecorder } from "@/components/AudioRecorder";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb, AlertCircle } from "lucide-react";

export default function RecorderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Recording Studio</h1>
        <p className="text-muted-foreground">Record and review your practice sessions</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AudioRecorder
          onRecordingComplete={(recording) => {
            console.log("Recording completed:", recording);
          }}
        />

        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Recording Tips
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="p-3 rounded-md bg-muted/50">
                <p className="text-sm font-medium">Position your device well</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Place your microphone 3-6 feet from the piano for best sound quality
                </p>
              </div>
              <div className="p-3 rounded-md bg-muted/50">
                <p className="text-sm font-medium">Reduce background noise</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Close windows, turn off fans, and minimize ambient sounds
                </p>
              </div>
              <div className="p-3 rounded-md bg-muted/50">
                <p className="text-sm font-medium">Listen back critically</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Focus on timing, dynamics, and areas that need improvement
                </p>
              </div>
              <div className="p-3 rounded-md bg-muted/50">
                <p className="text-sm font-medium">Compare over time</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Save recordings to track your progress on difficult passages
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Browser Permissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                To use the recorder, you'll need to allow microphone access when prompted. 
                Your recordings are stored locally in your browser and are not uploaded anywhere.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
