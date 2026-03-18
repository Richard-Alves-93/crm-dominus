import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageCircle, Users, TrendingUp, Zap, RotateCcw, Settings } from "lucide-react";
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

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-card p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">CRM Dominus</h1>
          <p className="text-sm text-muted-foreground mt-1">Gestão de Vendas</p>
        </div>

        <nav className="space-y-2">
          <SidebarItem
            icon={<RotateCcw className="w-5 h-5" />}
            label="Dashboard"
            active={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <SidebarItem
            icon={<MessageCircle className="w-5 h-5" />}
            label="Chat"
            active={activeTab === "chat"}
            onClick={() => setActiveTab("chat")}
          />
          <SidebarItem
            icon={<Users className="w-5 h-5" />}
            label="Clientes"
            active={activeTab === "customers"}
            onClick={() => setActiveTab("customers")}
          />
          <SidebarItem
            icon={<TrendingUp className="w-5 h-5" />}
            label="Funil de Vendas"
            active={activeTab === "funnel"}
            onClick={() => setActiveTab("funnel")}
          />
          <SidebarItem
            icon={<Zap className="w-5 h-5" />}
            label="Automações"
            active={activeTab === "workflows"}
            onClick={() => setActiveTab("workflows")}
          />
          <SidebarItem
            icon={<Zap className="w-5 h-5" />}
            label="Regras"
            active={activeTab === "rules"}
            onClick={() => setActiveTab("rules")}
          />
          <SidebarItem
            icon={<Settings className="w-5 h-5" />}
            label="Configurações"
            active={activeTab === "settings"}
            onClick={() => setActiveTab("settings")}
          />
        </nav>

        <div className="mt-auto pt-6 border-t border-border">
          <div className="mb-4">
            <p className="text-sm font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
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
      className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
        active
          ? "bg-primary text-primary-foreground"
          : "text-foreground hover:bg-accent"
      }`}
    >
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}
