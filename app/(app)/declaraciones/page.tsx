"use client";

import { usePlan } from "@/components/PlanContext";
import PaywallBlock from "@/components/PaywallBlock";
import DeclaracionTool from "@/components/declaraciones/DeclaracionTool";

export default function DeclaracionesPage() {
  const { userPlan, openUpgrade } = usePlan();

  // Solo Business accede. Free y Pro ven el paywall.
  if (userPlan !== "business") {
    return (
      <div className="page">
        <div style={{ fontFamily: "var(--font-geist-sans), sans-serif", fontSize: 21, marginBottom: 3 }}>
          Declaraciones SAT
        </div>
        <div style={{ fontSize: 12, color: "var(--text2)", marginBottom: 24 }}>
          Prepara y calcula tus declaraciones fiscales para revisarlas con tu contador.
        </div>
        <PaywallBlock
          eyebrow="Exclusivo de Business"
          title="Declaraciones SAT es exclusivo de Business"
          description="Prepara tus declaraciones mensuales y anuales automáticamente."
          ctaLabel="Conocer Business"
          onUpgrade={openUpgrade}
          style={{ maxWidth: 460, margin: "8px auto 0" }}
        />
      </div>
    );
  }

  return <DeclaracionTool />;
}
