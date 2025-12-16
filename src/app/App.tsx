import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { FinancialPlanner } from "./components/FinancialPlanner";

export default function App() {
  const [currentPage, setCurrentPage] = useState<"landing" | "planner">("landing");

  return (
    <div className="min-h-screen">
      {currentPage === "landing" ? (
        <LandingPage onGetStarted={() => setCurrentPage("planner")} />
      ) : (
        <FinancialPlanner onBack={() => setCurrentPage("landing")} />
      )}
    </div>
  );
}
