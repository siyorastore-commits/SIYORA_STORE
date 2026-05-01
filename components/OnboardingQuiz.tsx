"use client";
import { useState } from "react";
import { useUser } from "@/context/UserContext";
import { Star } from "lucide-react";

const QUESTIONS = [
  {
    header: "Your everyday vibe",
    question: "It's a regular college day. What are you actually wearing?",
    options: [
      { value: "kurti_leggings", label: "Flowy kurti + leggings", sub: "Effortless is my middle name" },
      { value: "coord_set", label: "Printed co-ord set", sub: "Matching is self-care" },
      { value: "top_jeans", label: "Top + jeans combo", sub: "Classic never fails" },
      { value: "dress_vibes", label: "Breezy dress all the way", sub: "I dress for my mood, always" },
    ],
  },
  {
    header: "Colour soul",
    question: "Which palette makes your heart flutter?",
    options: [
      { value: "pastels", label: "Soft pastels & nudes", sub: "Quiet luxury, always" },
      { value: "bolds", label: "Rich bolds & brights", sub: "I walk in, heads turn" },
      { value: "earthy", label: "Earthy & muted tones", sub: "Grounded and natural" },
      { value: "prints", label: "Patterns & mixed prints", sub: "The louder, the better" },
    ],
  },
  {
    header: "Occasion check",
    question: "When do you most want to look absolutely gorgeous?",
    options: [
      { value: "college_daily", label: "College & daily life", sub: "Every day is a moment" },
      { value: "festivals", label: "Festivals & functions", sub: "I live for the occasion" },
      { value: "outings", label: "Casual outings & dates", sub: "Effortless chic, always" },
      { value: "events", label: "Photo shoots & events", sub: "Camera-ready, always" },
    ],
  },
  {
    header: "Styling instinct",
    question: "You just got a new kurti. What's the first thing you reach for to style it?",
    options: [
      { value: "sling_bag", label: "A cute sling bag", sub: "Accessory game strong" },
      { value: "earrings", label: "Statement earrings", sub: "Jewellery does the talking" },
      { value: "sneakers", label: "Trendy sneakers", sub: "Comfort meets style" },
      { value: "dupatta", label: "A dupatta or scarf", sub: "Traditional roots, modern mood" },
    ],
  },
  {
    header: "Shopping truth",
    question: "What would make you buy a kurta online without thinking twice?",
    options: [
      { value: "aesthetic", label: "Aesthetic photos & styling", sub: "Visuals instantly sell me" },
      { value: "reviews", label: "Real reviews & customer pics", sub: "Social proof wins every time" },
      { value: "discount", label: "A sweet deal or discount", sub: "Value is everything to me" },
      { value: "fast_delivery", label: "Fast & reliable delivery", sub: "I want it yesterday" },
    ],
  },
];

export default function OnboardingQuiz() {
  const { user, setShowQuiz } = useUser();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const q = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;

  function selectOption(value: string) {
    setSelected(value);
  }

  async function handleNext() {
    if (!selected) return;
    const newAnswers = { ...answers, [`q${step + 1}`]: selected };
    setAnswers(newAnswers);

    if (isLast) {
      await submitQuiz(newAnswers, true);
    } else {
      setStep(step + 1);
      setSelected(null);
    }
  }

  async function handleSkip() {
    await submitQuiz(answers, false);
  }

  async function submitQuiz(finalAnswers: Record<string, string>, completed: boolean) {
    setSubmitting(true);
    try {
      await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: user?.phone || "",
          ...finalAnswers,
          completed,
        }),
      });
    } catch {
      // Non-blocking — quiz failure shouldn't block user
    } finally {
      setSubmitting(false);
      if (completed) {
        setDone(true);
        setTimeout(() => setShowQuiz(false), 1800);
      } else {
        setShowQuiz(false);
      }
    }
  }

  return (
    <div className="quiz-overlay">
      <div className="quiz-modal">
        {!done ? (
          <>
            {/* Progress bar */}
            <div className="quiz-progress-bar">
              <div
                className="quiz-progress-fill"
                style={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>

            {/* Header */}
            <div className="quiz-top">
              <span className="quiz-step-label">{step + 1} of {QUESTIONS.length}</span>
              <button className="quiz-skip" onClick={handleSkip} disabled={submitting}>
                Skip
              </button>
            </div>

            {/* Question */}
            <div className="quiz-header-tag">{q.header}</div>
            <h2 className="quiz-question">{q.question}</h2>

            {/* Options */}
            <div className="quiz-options">
              {q.options.map((opt) => (
                <button
                  key={opt.value}
                  className={`quiz-option ${selected === opt.value ? "selected" : ""}`}
                  onClick={() => selectOption(opt.value)}
                >
                  <span className="quiz-option-label">{opt.label}</span>
                  <span className="quiz-option-sub">{opt.sub}</span>
                </button>
              ))}
            </div>

            {/* CTA */}
            <button
              className="quiz-next-btn"
              onClick={handleNext}
              disabled={!selected || submitting}
            >
              {submitting ? (
                <span className="quiz-spinner" />
              ) : isLast ? (
                "See my vibe ✨"
              ) : (
                "Next →"
              )}
            </button>
          </>
        ) : (
          <div className="quiz-done">
            <div className="quiz-done-star">
            <Star size={52} fill="#c8956c" stroke="#c8956c" />
          </div>
            <h2>You're all set!</h2>
            <p>Thanks for sharing your vibe. We'll use this to show you things you'll actually love.</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .quiz-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          z-index: 9999;
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding: 0;
          animation: fadeIn 0.25s ease;
        }
        @media (min-width: 600px) {
          .quiz-overlay {
            align-items: center;
            padding: 24px;
          }
        }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .quiz-modal {
          background: #fff;
          border-radius: 24px 24px 0 0;
          width: 100%;
          max-width: 520px;
          padding: 0 0 32px;
          overflow: hidden;
          animation: slideUp 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          max-height: 92vh;
          overflow-y: auto;
        }
        @media (min-width: 600px) {
          .quiz-modal {
            border-radius: 24px;
            animation: scaleIn 0.25s cubic-bezier(0.34, 1.2, 0.64, 1);
          }
        }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.92); } to { opacity: 1; transform: scale(1); } }

        .quiz-progress-bar {
          height: 4px;
          background: #f0ece8;
          width: 100%;
        }
        .quiz-progress-fill {
          height: 100%;
          background: #c8956c;
          transition: width 0.4s ease;
        }

        .quiz-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px 0;
        }
        .quiz-step-label {
          font-size: 12px;
          color: #aaa;
          font-weight: 500;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .quiz-skip {
          background: none;
          border: none;
          font-size: 13px;
          color: #aaa;
          cursor: pointer;
          padding: 4px 8px;
          border-radius: 6px;
          transition: color 0.2s, background 0.2s;
        }
        .quiz-skip:hover { color: #666; background: #f5f5f5; }

        .quiz-header-tag {
          margin: 20px 24px 6px;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: #c8956c;
        }
        .quiz-question {
          margin: 0 24px 24px;
          font-size: 20px;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.35;
        }

        .quiz-options {
          display: flex;
          flex-direction: column;
          gap: 10px;
          padding: 0 24px;
        }
        .quiz-option {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding: 14px 18px;
          border: 1.5px solid #e8e3dd;
          border-radius: 14px;
          background: #faf9f7;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s, transform 0.1s;
          text-align: left;
        }
        .quiz-option:hover {
          border-color: #c8956c;
          background: #fdf6ee;
        }
        .quiz-option.selected {
          border-color: #c8956c;
          background: #fdf6ee;
          box-shadow: 0 0 0 3px rgba(200, 149, 108, 0.15);
        }
        .quiz-option:active { transform: scale(0.98); }
        .quiz-option-label {
          font-size: 14px;
          font-weight: 600;
          color: #1a1a1a;
        }
        .quiz-option-sub {
          font-size: 12px;
          color: #888;
          margin-top: 2px;
        }

        .quiz-next-btn {
          margin: 24px 24px 0;
          width: calc(100% - 48px);
          padding: 15px;
          background: #1a1a1a;
          color: #fff;
          border: none;
          border-radius: 14px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 52px;
        }
        .quiz-next-btn:hover:not(:disabled) { background: #c8956c; }
        .quiz-next-btn:active:not(:disabled) { transform: scale(0.98); }
        .quiz-next-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        .quiz-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .quiz-done {
          padding: 48px 24px 16px;
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          animation: fadeIn 0.4s ease;
        }
        .quiz-done-star {
          display: flex;
          animation: bounce 0.6s ease;
        }
        @keyframes bounce {
          0% { transform: scale(0.5); opacity: 0; }
          70% { transform: scale(1.2); }
          100% { transform: scale(1); opacity: 1; }
        }
        .quiz-done h2 {
          font-size: 24px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
        }
        .quiz-done p {
          font-size: 14px;
          color: #666;
          margin: 0;
          max-width: 280px;
          line-height: 1.5;
        }
      `}</style>
    </div>
  );
}
