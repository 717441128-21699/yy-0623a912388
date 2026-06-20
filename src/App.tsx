import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import RoleSelect from "@/pages/RoleSelect";
import ProjectSelect from "@/pages/ProjectSelect";
import HazardTypeSelect from "@/pages/HazardTypeSelect";
import SchemeDetail from "@/pages/SchemeDetail";
import Scheme from "@/pages/Scheme";
import Briefing from "@/pages/Briefing";
import BriefingSign from "@/pages/BriefingSign";
import BriefingDetail from "@/pages/BriefingDetail";
import Quiz from "@/pages/Quiz";
import QuizResult from "@/pages/QuizResult";
import Feedback from "@/pages/Feedback";
import FeedbackNew from "@/pages/FeedbackNew";
import FeedbackDetail from "@/pages/FeedbackDetail";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelect />} />
        <Route path="/projects" element={<ProjectSelect />} />
        <Route path="/projects/:projectId/types" element={<HazardTypeSelect />} />
        <Route path="/projects/:projectId/types/:typeId" element={<SchemeDetail />} />
        <Route
          path="/scheme"
          element={<Layout><Scheme /></Layout>}
        />
        <Route
          path="/briefing"
          element={<Layout><Briefing /></Layout>}
        />
        <Route path="/briefing/sign" element={<BriefingSign />} />
        <Route path="/briefing/:sessionId" element={<BriefingDetail />} />
        <Route path="/briefing/quiz" element={<Quiz />} />
        <Route path="/briefing/quiz/result" element={<QuizResult />} />
        <Route
          path="/feedback"
          element={<Layout><Feedback /></Layout>}
        />
        <Route path="/feedback/new" element={<FeedbackNew />} />
        <Route path="/feedback/:id" element={<FeedbackDetail />} />
      </Routes>
    </Router>
  );
}
