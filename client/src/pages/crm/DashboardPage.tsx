import { Card } from "@/components/ui/card";
import { TrendingUp, Users, MessageSquare, ShoppingCart } from "lucide-react";

export default function DashboardPage() {
  const metrics = [
    {
      label: "Clientes Ativos",
      value: "128",
      change: "+12%",
      icon: Users,
      color: "bg-blue-500",
    },
    {
      label: "Conversas",
      value: "456",
      change: "+8%",
      icon: MessageSquare,
      color: "bg-green-500",
    },
    {
      label: "Vendas Este Mês",
      value: "R$ 45.230",
      change: "+23%",
      icon: ShoppingCart,
      color: "bg-purple-500",
    },
    {
      label: "Taxa de Conversão",
      value: "12.5%",
      change: "+2.3%",
      icon: TrendingUp,
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Visão geral do seu CRM</p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <Card key={index} className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-2">{metric.value}</p>
                  <p className="text-xs text-green-600 mt-2">{metric.change}</p>
                </div>
                <div className={`${metric.color} p-3 rounded-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="font-semibold text-foreground mb-4">Vendas por Mês</h2>
          <div className="h-64 flex items-end justify-around">
            {[40, 60, 45, 70, 55, 80].map((height, i) => (
              <div
                key={i}
                className="w-8 bg-blue-500 rounded-t"
                style={{ height: `${height}%` }}
              />
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-semibold text-foreground mb-4">Distribuição de Leads</h2>
          <div className="space-y-4">
            {[
              { label: "Lead", value: 45, color: "bg-blue-500" },
              { label: "Prospect", value: 30, color: "bg-purple-500" },
              { label: "Negociação", value: 20, color: "bg-orange-500" },
              { label: "Fechado", value: 5, color: "bg-green-500" },
            ].map((item, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-foreground">{item.label}</span>
                  <span className="text-sm font-semibold text-foreground">{item.value}%</span>
                </div>
                <div className="w-full bg-accent rounded-full h-2">
                  <div
                    className={`${item.color} h-2 rounded-full`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <h2 className="font-semibold text-foreground mb-4">Atividade Recente</h2>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-border last:border-b-0">
              <div>
                <p className="text-sm text-foreground">Cliente {i} enviou uma mensagem</p>
                <p className="text-xs text-muted-foreground">Há {i} minutos</p>
              </div>
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
