import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MessageCircle, Users, TrendingUp, Zap, RotateCcw, Settings, Menu, X } from "lucide-react";
import ChatPage from "./crm/ChatPage";
import CustomersPage from "./crm/CustomersPage";
import FunnelPage from "./crm/FunnelPage";
import WorkflowsPage from "./crm/WorkflowsPage";
import DashboardPage from "./crm/DashboardPage";
import SettingsPage from "./crm/SettingsPage";
import ToolsSettingsPage from "./crm/ToolsSettingsPage";
import RulesPage from "./crm/RulesPage";

export default function CRM() {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) {
    return <div>Loading...</div>;
  }

  const handleNavClick = (tab: string) => {
    setActiveTab(tab);
    setSidebarOpen(false); // Close sidebar on mobile after selecting
  };

  return (
    <div className="flex h-screen bg-background flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-card">
        <h1 className="text-lg font-bold text-foreground">CRM Dominus</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 hover:bg-accent rounded-lg"
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "block" : "hidden"
        } md:block md:w-64 border-r border-border bg-card p-6 md:p-6 absolute md:relative top-16 md:top-0 left-0 right-0 md:right-auto z-50 md:z-auto md:h-screen overflow-y-auto`}
      >
        <div className="mb-8 hidden md:block">
          <h1 className="text-2xl font-bold text-foreground">CRM Dominus</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestão de Vendas</p>
        </div>

        <nav className="space-y-2">
          <SidebarItem
            icon={<RotateCcw className="w-5 h-5" />}
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => handleNavClick("dashboard")}
          />
          <SidebarItem
            icon={<MessageCircle className="w-5 h-5" />}
            label="Chat"
            active={activeTab === "chat"}
            onClick={() => handleNavClick("chat")}
          />
          <SidebarItem
            icon={<Users className="w-5 h-5" />}
            label="Clientes"
            active={activeTab === "customers"}
            onClick={() => handleNavClick("customers")}
          />
          <SidebarItem
            icon={<TrendingUp className="w-5 h-5" />}
            label="Funil de Vendas"
            active={activeTab === "funnel"}
            onClick={() => handleNavClick("funnel")}
          />
          <SidebarItem
            icon={<Zap className="w-5 h-5" />}
            label="Automações"
            active={activeTab === "workflows"}
            onClick={() => handleNavClick("workflows")}
          />
          <SidebarItem
            icon={<Zap className="w-5 h-5" />}
            label="Regras"
            active={activeTab === "rules"}
            onClick={() => handleNavClick("rules")}
          />
          <SidebarItem
            icon={<Settings className="w-5 h-5" />}
            label="Configurações"
            active={activeTab === "settings"}
            onClick={() => handleNavClick("settings")}
          />
        </nav>

        <div className="mt-auto pt-6 border-t border-border">
          <div className="mb-4">
            <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={logout} className="w-full">
            Sair
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {activeTab === "dashboard" && <DashboardPage />}
        {activeTab === "chat" && <ChatPage />}
        {activeTab === "customers" && <CustomersPage />}
        {activeTab === "funnel" && <FunnelPage />}
        {activeTab === "workflows" && <WorkflowsPage />}
        {activeTab === "rules" && <RulesPage />}
        {activeTab === "settings" && <SettingsPage />}
        {activeTab === "tools" && <ToolsSettingsPage />}
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40 top-16"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function SidebarItem({ icon, label, active, onClick }: SidebarItemProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors text-sm md:text-base ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-foreground hover:bg-accent"
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}
