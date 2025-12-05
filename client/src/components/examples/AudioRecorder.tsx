import { AudioRecorder } from "../AudioRecorder";

export default function AudioRecorderExample() {
  return <AudioRecorder onRecordingComplete={(recording) => console.log("Recording complete:", recording)} />;
}
