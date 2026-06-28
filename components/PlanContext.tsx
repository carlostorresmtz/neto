"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { type PlanId, FREE_QUESTION_LIMIT } from "@/lib/plans";

const PLAN_KEY = "neto_plan";
const QUESTIONS_KEY = "neto_chat_questions";

const VALID_PLANS: PlanId[] = ["free", "pro", "business"];

/** El plan Free tiene tope de preguntas; Pro y Business son ilimitados. */
function limitFor(plan: PlanId): number {
  return plan === "free" ? FREE_QUESTION_LIMIT : Infinity;
}

interface PlanContextValue {
  userPlan: PlanId;
  chatQuestionsUsed: number;
  chatQuestionsLimit: number;
  setPlan: (plan: PlanId) => void;
  incrementQuestions: () => void;
  /** Estado del modal de upgrade, compartido para que cualquier página lo abra. */
  upgradeOpen: boolean;
  openUpgrade: () => void;
  closeUpgrade: () => void;
}

const PlanContext = createContext<PlanContextValue | null>(null);

export function PlanProvider({ children }: { children: React.ReactNode }) {
  // Default determinista en 'free' / 0 para que el render del servidor coincida
  // con el primer render del cliente. La hidratación real ocurre abajo.
  const [userPlan, setUserPlan] = useState<PlanId>("free");
  const [chatQuestionsUsed, setChatQuestionsUsed] = useState(0);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  // Hidratación desde localStorage SOLO en el cliente, dentro de useEffect,
  // para evitar hydration mismatch de Next.js (mismo patrón que AppShell).
  useEffect(() => {
    try {
      const savedPlan = localStorage.getItem(PLAN_KEY) as PlanId | null;
      if (savedPlan && VALID_PLANS.includes(savedPlan)) setUserPlan(savedPlan);

      const savedQuestions = localStorage.getItem(QUESTIONS_KEY);
      if (savedQuestions !== null) {
        const n = Number(savedQuestions);
        if (Number.isFinite(n) && n >= 0) setChatQuestionsUsed(n);
      }
    } catch {}
  }, []);

  const setPlan = useCallback((plan: PlanId) => {
    setUserPlan(plan);
    try {
      localStorage.setItem(PLAN_KEY, plan);
    } catch {}
  }, []);

  const incrementQuestions = useCallback(() => {
    setChatQuestionsUsed(prev => {
      const next = prev + 1;
      try {
        localStorage.setItem(QUESTIONS_KEY, String(next));
      } catch {}
      return next;
    });
  }, []);

  const openUpgrade = useCallback(() => setUpgradeOpen(true), []);
  const closeUpgrade = useCallback(() => setUpgradeOpen(false), []);

  const value: PlanContextValue = {
    userPlan,
    chatQuestionsUsed,
    chatQuestionsLimit: limitFor(userPlan),
    setPlan,
    incrementQuestions,
    upgradeOpen,
    openUpgrade,
    closeUpgrade,
  };

  return <PlanContext.Provider value={value}>{children}</PlanContext.Provider>;
}

export function usePlan(): PlanContextValue {
  const ctx = useContext(PlanContext);
  if (!ctx) throw new Error("usePlan debe usarse dentro de <PlanProvider>");
  return ctx;
}
