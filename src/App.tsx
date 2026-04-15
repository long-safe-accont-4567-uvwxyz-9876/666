import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import Questionnaire from "@/pages/Questionnaire";
import Result from "@/pages/Result";
import AudioPlayer from "@/components/AudioPlayer";

export default function App() {
  return (
    <Router>
      <div className="relative min-h-screen">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/questionnaire" element={<Questionnaire />} />
          <Route path="/result" element={<Result />} />
        </Routes>
        <AudioPlayer />
      </div>
    </Router>
  );
}
