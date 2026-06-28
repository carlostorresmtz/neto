"use client";

import { useState, useEffect, useCallback } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePlan } from "@/components/PlanContext";
import UpgradeModal from "@/components/UpgradeModal";
import Toast from "@/components/Toast";
import type { PlanId } from "@/lib/plans";

interface NavItem {
  label: string;
  href: string;
  badge: string | null;
  section: "menu" | "accounts" | "settings";
  icon: string;
  bankBadge?: { bg: string; color: string; text: string };
}

const NAV_ITEMS: NavItem[] = [
  { label: "Contador personal", href: "/chat",             badge: null,  section: "menu",     icon: "chat" },
  { label: "Estados de cuenta", href: "/estados",          badge: "4",   section: "menu",     icon: "monitor" },
  { label: "Mis gastos",        href: "/gastos",           badge: null,  section: "menu",     icon: "dollar" },
  { label: "Análisis",          href: "/analisis",         badge: null,  section: "menu",     icon: "bar" },
  { label: "Presupuesto",       href: "/presupuesto",      badge: null,  section: "menu",     icon: "target" },
  { label: "Suscripciones",     href: "/suscripciones",    badge: "7",   section: "menu",     icon: "clock" },
  { label: "Alertas",           href: "/alertas",          badge: null,  section: "menu",     icon: "bell" },
  { label: "Declaraciones SAT", href: "/declaraciones",    badge: "Business", section: "menu", icon: "receipt" },
  { label: "BBVA Débito",       href: "/cuentas/bbva",     badge: null,  section: "accounts", icon: "card",
    bankBadge: { bg: "#004481", color: "#fff", text: "BB" } },
  { label: "Amex Gold",         href: "/cuentas/amex",     badge: null,  section: "accounts", icon: "card",
    bankBadge: { bg: "#016FD0", color: "#fff", text: "AX" } },
  { label: "Nu Crédito",        href: "/cuentas/nu",       badge: null,  section: "accounts", icon: "card",
    bankBadge: { bg: "#820ad1", color: "#fff", text: "Nu" } },
  { label: "Conexiones",        href: "/conexiones",       badge: "0/2", section: "settings", icon: "share" },
  { label: "Configuración",     href: "/configuracion",    badge: null,  section: "settings", icon: "settings" },
];

const AGENT_SUB_ITEMS = [
  { label: "AlertasAgent",     href: "/agentes#alertas",    icon: "bell" },
  { label: "CierreAgent",      href: "/agentes#cierre",     icon: "calendar" },
  { label: "ComparadorAgent",  href: "/agentes#comparador", icon: "creditcard" },
  { label: "DeduciblesAgent",  href: "/agentes#deducibles", icon: "file" },
  { label: "FraudeAgent",      href: "/agentes#fraude",     icon: "shield" },
  { label: "DepositosAgent",   href: "/agentes#depositos",  icon: "income" },
];

// Estilo del badge de plan en el topbar: Free gris / Pro azul / Business ámbar.
const PLAN_BADGE: Record<PlanId, { label: string; bg: string; border: string; color: string; dot: string }> = {
  free:     { label: "Free",     bg: "#F1F5F9", border: "#E2E8F0", color: "#64748B", dot: "#94A3B8" },
  pro:      { label: "Pro",      bg: "#DBEAFE", border: "#BFDBFE", color: "#1E40AF", dot: "#1E40AF" },
  business: { label: "Business", bg: "#FEF3C7", border: "#FDE68A", color: "#B45309", dot: "#D97706" },
};

const UPGRADE_TOAST: Record<PlanId, string> = {
  free:     "Estás en el plan Gratis",
  pro:      "¡Listo! Ya tienes Neto Pro 🎉",
  business: "¡Listo! Ya tienes Neto Business",
};

interface AlertInfo { count: number; level: "urgent" | "important" | "info" | null }
interface BudgetAlertInfo { level: "ok" | "warn" | "over"; pct: number }

// ── helpers defined OUTSIDE AppShell so their reference is stable ──

function NavIcon({ type, size = 14 }: { type: string; size?: number }) {
  const s = { stroke: "currentColor", fill: "none", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const cls = "flex-shrink-0";
  if (type === "chat")       return <svg className={cls} width={size} height={size} viewBox="0 0 24 24" {...s}><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
  if (type === "monitor")    return <svg className={cls} width={size} height={size} viewBox="0 0 24 24" {...s}><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>;
  if (type === "dollar")     return <svg className={cls} width={size} height={size} viewBox="0 0 24 24" {...s}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>;
  if (type === "bar")        return <svg className={cls} width={size} height={size} viewBox="0 0 24 24" {...s}><path d="M18 20V10M12 20V4M6 20v-6"/></svg>;
  if (type === "clock")      return <svg className={cls} width={size} height={size} viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>;
  if (type === "bell")       return <svg className={cls} width={size} height={size} viewBox="0 0 24 24" {...s}><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>;
  if (type === "share")      return <svg className={cls} width={size} height={size} viewBox="0 0 24 24" {...s}><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>;
  if (type === "agent")      return <svg className={cls} width={size} height={size} viewBox="0 0 24 24" {...s}><circle cx="12" cy="8" r="4"/><path d="M6 20v-1a6 6 0 0 1 12 0v1"/><circle cx="18" cy="8" r="2"/><path d="M20 14a4 4 0 0 1 2 3.5"/><circle cx="6" cy="8" r="2"/><path d="M4 17.5A4 4 0 0 1 6 14"/></svg>;
  if (type === "calendar")   return <svg className={cls} width={size} height={size} viewBox="0 0 24 24" {...s}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>;
  if (type === "creditcard") return <svg className={cls} width={size} height={size} viewBox="0 0 24 24" {...s}><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>;
  if (type === "file")       return <svg className={cls} width={size} height={size} viewBox="0 0 24 24" {...s}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
  if (type === "shield")     return <svg className={cls} width={size} height={size} viewBox="0 0 24 24" {...s}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
  if (type === "income")     return <svg className={cls} width={size} height={size} viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="10"/><polyline points="8 12 12 16 16 12"/><line x1="12" y1="8" x2="12" y2="16"/></svg>;
  if (type === "target")     return <svg className={cls} width={size} height={size} viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
  if (type === "receipt")    return <svg className={cls} width={size} height={size} viewBox="0 0 24 24" {...s}><path d="M5 2v20l2-1.5L9 22l2-1.5L13 22l2-1.5L17 22l2-1.5V2l-2 1.5L15 2l-2 1.5L11 2 9 3.5 7 2z"/><line x1="8.5" y1="8" x2="15.5" y2="8"/><line x1="8.5" y1="12" x2="15.5" y2="12"/></svg>;
  if (type === "chevron")    return <svg className={cls} width={size} height={size} viewBox="0 0 24 24" {...s}><polyline points="6 9 12 15 18 9"/></svg>;
  if (type === "settings")   return <svg className={cls} width={size} height={size} viewBox="0 0 24 24" {...s}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>;
  return null;
}

function BankBadge({ bg, color, text }: { bg: string; color: string; text: string }) {
  return (
    <span style={{
      width: 20, height: 20, borderRadius: 4, background: bg, color,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      fontSize: 9, fontWeight: 700, flexShrink: 0, letterSpacing: "0.03em",
    }}>
      {text}
    </span>
  );
}

interface NavItemElProps {
  item: NavItem;
  active: boolean;
  alertInfo: AlertInfo;
  alertBadgeColor: string;
  budgetAlert: BudgetAlertInfo | null;
}

function NavItemEl({ item, active, alertInfo, alertBadgeColor, budgetAlert }: NavItemElProps) {
  const isAlertas = item.href === "/alertas";
  const showAlertBadge = isAlertas && alertInfo.count > 0;

  const isBudget = item.href === "/presupuesto";
  const showBudgetBadge = isBudget && budgetAlert !== null && budgetAlert.level !== "ok";
  const budgetColor = budgetAlert?.level === "over" ? "#ef4444" : "#f97316";

  return (
    <Link href={item.href}>
      <button type="button" className={`nav-item ${active ? "active" : ""}`}>
        {item.bankBadge ? <BankBadge {...item.bankBadge} /> : <NavIcon type={item.icon} />}
        {item.label}
        {showAlertBadge ? (
          <span className="nav-badge" style={{ background: alertBadgeColor, color: "#fff" }}>
            {alertInfo.count}
          </span>
        ) : showBudgetBadge ? (
          <span className="nav-badge" style={{ background: budgetColor, color: "#fff" }}>
            {Math.round(budgetAlert!.pct)}%
          </span>
        ) : item.badge ? (
          <span className="nav-badge">{item.badge}</span>
        ) : null}
      </button>
    </Link>
  );
}

// ── AppShell ──

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [alertInfo, setAlertInfo] = useState<AlertInfo>({ count: 0, level: null });
  const [budgetAlert, setBudgetAlert] = useState<BudgetAlertInfo | null>(null);
  const [agentsExpanded, setAgentsExpanded] = useState(false);
  const { data: session } = useSession();

  const { userPlan, setPlan, upgradeOpen, openUpgrade, closeUpgrade } = usePlan();
  const [toast, setToast] = useState<{ open: boolean; message: string }>({ open: false, message: "" });

  const handleSelectPlan = useCallback((plan: PlanId) => {
    closeUpgrade();
    // Fase de validación sin cobro: los 3 planes (incl. Business) se auto-asignan
    // al hacer clic. Se reemplazará por checkout real al integrar Stripe.
    setPlan(plan);
    setToast({ open: true, message: UPGRADE_TOAST[plan] });
  }, [setPlan, closeUpgrade]);

  const planBadge = PLAN_BADGE[userPlan];

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 700);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) setSidebarOpen(false);
  }, [pathname, isMobile]);

  useEffect(() => {
    const readAlert = () => {
      try {
        const v = localStorage.getItem("neto_alert_count");
        if (v) setAlertInfo(JSON.parse(v));
      } catch {}
    };
    readAlert();
    window.addEventListener("neto-alertas-update", readAlert);
    return () => window.removeEventListener("neto-alertas-update", readAlert);
  }, []);

  useEffect(() => {
    const readBudget = () => {
      try {
        const v = localStorage.getItem("neto_budget_alert");
        if (v) setBudgetAlert(JSON.parse(v));
      } catch {}
    };
    readBudget();
    window.addEventListener("neto-budget-update", readBudget);
    return () => window.removeEventListener("neto-budget-update", readBudget);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("neto_agents_expanded");
    if (saved !== null) setAgentsExpanded(saved === "true");
  }, []);

  // Onboarding: si el usuario nunca completó la bienvenida, lo mandamos ahí
  // la primera vez. /bienvenida se excluye para no crear un loop.
  useEffect(() => {
    if (pathname === "/bienvenida") return;
    try {
      const done = localStorage.getItem("neto_onboarding_completed");
      if (done !== "true") router.replace("/bienvenida");
    } catch {}
  }, [pathname, router]);

  useEffect(() => {
    const saved = localStorage.getItem("neto-theme") as "dark" | "light" | null;
    if (saved === "dark") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("neto-theme", next);
      document.documentElement.classList.toggle("dark", next === "dark");
      return next;
    });
  }, []);

  const toggleAgents = useCallback(() => {
    setAgentsExpanded(prev => {
      const next = !prev;
      localStorage.setItem("neto_agents_expanded", String(next));
      return next;
    });
  }, []);

  const alertBadgeColor = alertInfo.level === "urgent"
    ? "#ef4444"
    : alertInfo.level === "important"
      ? "#f59e0b"
      : "var(--text3)";

  const menuItems    = NAV_ITEMS.filter(i => i.section === "menu");
  const accountItems = NAV_ITEMS.filter(i => i.section === "accounts");
  const settingItems = NAV_ITEMS.filter(i => i.section === "settings");

  const sidebarContent = (
    <>
      {isMobile && (
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          style={{ display: "flex", alignItems: "center", gap: 6, border: "none", background: "none", cursor: "pointer", color: "var(--text2)", fontSize: 13, padding: "6px 10px 6px 4px", marginBottom: 4 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Cerrar menú
        </button>
      )}

      <div className="nav-section">Menú</div>
      {menuItems.map(item => (
        <NavItemEl
          key={item.href}
          item={item}
          active={pathname === item.href}
          alertInfo={alertInfo}
          alertBadgeColor={alertBadgeColor}
          budgetAlert={budgetAlert}
        />
      ))}

      {/* Agentes — expandible */}
      <button
        type="button"
        className={`nav-item ${pathname.startsWith("/agentes") ? "active" : ""}`}
        onClick={toggleAgents}
      >
        <NavIcon type="agent" />
        Agentes
        <span style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          color: "var(--text3)",
          transition: "transform 0.2s ease",
          transform: agentsExpanded ? "rotate(180deg)" : "rotate(0deg)",
        }}>
          <NavIcon type="chevron" size={12} />
        </span>
      </button>

      {/* Sub-menú agentes */}
      {agentsExpanded && (
        <div>
          {AGENT_SUB_ITEMS.map(sub => (
            <Link key={sub.href} href={sub.href}>
              <button
                type="button"
                className="nav-item"
                style={{ paddingLeft: 40, fontSize: 13, color: "var(--text3)" }}
              >
                <NavIcon type={sub.icon} size={13} />
                {sub.label}
              </button>
            </Link>
          ))}
        </div>
      )}

      <div className="nav-section">Mis cuentas</div>
      {accountItems.map(item => (
        <NavItemEl
          key={item.href}
          item={item}
          active={pathname === item.href}
          alertInfo={alertInfo}
          alertBadgeColor={alertBadgeColor}
          budgetAlert={budgetAlert}
        />
      ))}

      <div className="nav-section">Configuración</div>
      {settingItems.map(item => (
        <NavItemEl
          key={item.href}
          item={item}
          active={pathname === item.href}
          alertInfo={alertInfo}
          alertBadgeColor={alertBadgeColor}
          budgetAlert={budgetAlert}
        />
      ))}
    </>
  );

  // La pantalla de bienvenida se muestra a pantalla completa, sin el chrome
  // del shell (sidebar / topbar).
  if (pathname === "/bienvenida") {
    return <>{children}</>;
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "250px 1fr",
      gridTemplateRows: "52px 1fr",
      height: "100vh",
      overflow: "hidden",
    }}>
      {/* ── TOPBAR ── */}
      <header className="topbar" style={{ gridColumn: "1 / -1" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {isMobile && (
            <button
              type="button"
              onClick={() => setSidebarOpen(v => !v)}
              style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 34, height: 34, border: "none", background: "none", cursor: "pointer", color: "var(--text2)", flexShrink: 0 }}
              aria-label="Menú"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          )}

          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div style={{
              width: 26, height: 26, background: "var(--accent)", borderRadius: 7,
              display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
            }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1,11 4,6 7,9 11,3 15,5"/>
              </svg>
            </div>
            <span style={{ fontSize: 18, letterSpacing: "-0.02em", lineHeight: 1, color: "var(--text)", fontWeight: 500 }}>
              Neto
            </span>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {!isMobile && (
            <Link href="/conexiones">
              <div className="sources-pill">
                <span className="src-dot" style={{ background: session ? "var(--accent)" : "var(--text3)" }} />
                <span style={{ fontSize: 10 }}>Gmail</span>
                <span style={{ color: "var(--border2)", margin: "0 2px" }}>·</span>
                <span className="src-dot" style={{ background: "var(--text3)" }} />
                <span style={{ fontSize: 10 }}>Sheets</span>
              </div>
            </Link>
          )}

          {session ? (
            <div style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "#DBEAFE", border: "1px solid #BFDBFE",
              borderRadius: 20, padding: "4px 10px",
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "var(--accent)", display: "block", flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "var(--accent2)" }}>Gmail conectado</span>
            </div>
          ) : (
            <div style={{
              display: "flex", alignItems: "center", gap: 5,
              background: "#F1F5F9", border: "1px solid #E2E8F0",
              borderRadius: 20, padding: "4px 10px",
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#CBD5E1", display: "block", flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: "#64748B" }}>Sin Gmail</span>
            </div>
          )}

          <button
            type="button"
            onClick={openUpgrade}
            aria-label={`Plan ${planBadge.label} — cambiar de plan`}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              background: planBadge.bg, border: `1px solid ${planBadge.border}`,
              borderRadius: 20, padding: "4px 10px", cursor: "pointer",
              fontFamily: "inherit", flexShrink: 0,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: planBadge.dot, display: "block", flexShrink: 0 }} />
            <span style={{ fontSize: 11, fontWeight: 600, color: planBadge.color }}>{planBadge.label}</span>
          </button>

          <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label="Cambiar tema">
            {theme === "dark" ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>

          <div style={{
            width: 30, height: 30, borderRadius: "50%",
            background: session?.user?.image ? "transparent" : "var(--bg3)",
            border: "1px solid var(--border2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, color: "var(--text2)", fontWeight: 500,
            overflow: "hidden", flexShrink: 0,
          }}>
            {session?.user?.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={session.user.image} alt="" width={30} height={30} style={{ objectFit: "cover" }} />
            ) : (
              session?.user?.name
                ? session.user.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
                : "CT"
            )}
          </div>
        </div>
      </header>

      {/* ── SIDEBAR ── */}
      {isMobile ? (
        sidebarOpen && (
          <>
            <div
              onClick={() => setSidebarOpen(false)}
              style={{ position: "fixed", inset: 0, top: 52, background: "rgba(0,0,0,0.5)", zIndex: 40 }}
            />
            <aside style={{
              position: "fixed", top: 52, left: 0, bottom: 0, width: "100%", zIndex: 50,
              padding: "8px 0", borderRight: "1px solid var(--border)",
              display: "flex", flexDirection: "column", gap: 0,
              background: "var(--bg2)", overflowY: "auto",
            }}>
              {sidebarContent}
            </aside>
          </>
        )
      ) : (
        <aside style={{
          padding: "8px 0", borderRight: "1px solid #E2E8F0",
          display: "flex", flexDirection: "column", gap: 0,
          background: "#F8FAFC", overflowY: "auto",
        }}>
          {sidebarContent}
        </aside>
      )}

      {/* ── MAIN ── */}
      <main style={{ overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <div key={pathname} className="page-enter">
          {children}
        </div>
      </main>

      <UpgradeModal
        open={upgradeOpen}
        onClose={closeUpgrade}
        currentPlan={userPlan}
        onSelectPlan={handleSelectPlan}
      />
      <Toast
        open={toast.open}
        message={toast.message}
        onClose={() => setToast(t => ({ ...t, open: false }))}
      />
    </div>
  );
}
