import { Metronome } from "@/components/Metronome";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Info } from "lucide-react";

const tempoMarkings = [
  { name: "Largo", bpm: "40-60", description: "Very slow and broad" },
  { name: "Adagio", bpm: "66-76", description: "Slow and stately" },
  { name: "Andante", bpm: "76-108", description: "Walking pace" },
  { name: "Moderato", bpm: "108-120", description: "Moderate speed" },
  { name: "Allegro", bpm: "120-156", description: "Fast and bright" },
  { name: "Vivace", bpm: "156-176", description: "Lively and fast" },
  { name: "Presto", bpm: "168-200", description: "Very fast" },
];

export default function MetronomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Metronome</h1>
        <p className="text-muted-foreground">Practice with precise timing</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Metronome defaultBpm={100} />
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              Tempo Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tempoMarkings.map((tempo) => (
                <div
                  key={tempo.name}
                  className="flex items-center justify-between gap-4 p-3 rounded-md bg-muted/50"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{tempo.name}</p>
                    <p className="text-xs text-muted-foreground">{tempo.description}</p>
                  </div>
                  <Badge variant="outline" className="font-mono text-xs">
                    {tempo.bpm} BPM
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Practice Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 rounded-md bg-muted/50">
              <h4 className="font-medium mb-2">Start Slow</h4>
              <p className="text-sm text-muted-foreground">
                Begin at a tempo where you can play perfectly, then gradually increase speed.
              </p>
            </div>
            <div className="p-4 rounded-md bg-muted/50">
              <h4 className="font-medium mb-2">Listen Carefully</h4>
              <p className="text-sm text-muted-foreground">
                Focus on aligning your notes exactly with the metronome clicks.
              </p>
            </div>
            <div className="p-4 rounded-md bg-muted/50">
              <h4 className="font-medium mb-2">Subdivide the Beat</h4>
              <p className="text-sm text-muted-foreground">
                Practice with different subdivisions to improve your rhythmic accuracy.
              </p>
            </div>
            <div className="p-4 rounded-md bg-muted/50">
              <h4 className="font-medium mb-2">Record Yourself</h4>
              <p className="text-sm text-muted-foreground">
                Compare your timing by recording and listening back.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
