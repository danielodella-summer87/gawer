import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

interface AppShellProps {
  children: React.ReactNode;
  topbarTitle?: string;
}

export function AppShell({ children, topbarTitle }: AppShellProps) {
  return (
    <div className="min-h-screen bg-gawer-gray-50">
      <Sidebar />
      <div className="pl-64">
        <Topbar title={topbarTitle} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
