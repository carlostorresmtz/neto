import AppShell from "@/components/layout/AppShell";
import { PlanProvider } from "@/components/PlanContext";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <PlanProvider>
      <AppShell>{children}</AppShell>
    </PlanProvider>
  );
}
