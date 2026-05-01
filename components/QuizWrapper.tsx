"use client";
import { useUser } from "@/context/UserContext";
import OnboardingQuiz from "./OnboardingQuiz";

export default function QuizWrapper() {
  const { showQuiz } = useUser();
  if (!showQuiz) return null;
  return <OnboardingQuiz />;
}
