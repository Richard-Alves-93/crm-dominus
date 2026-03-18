import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

export default function FunnelPage() {
  const [stages] = useState([
    { id: 1, name: "Lead", color: "#3b82f6", leads: 5 },
    { id: 2, name: "Prospect", color: "#8b5cf6", leads: 3 },
    { id: 3, name: "Negociação", color: "#ec4899", leads: 2 },
    { id: 4, name: "Fechado", color: "#10b981", leads: 1 },
  ]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Funil de Vendas</h1>
          <p className="text-muted-foreground mt-1">Acompanhe seus leads em cada etapa</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Novo Lead
        </Button>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map((stage) => (
          <div key={stage.id} className="flex-shrink-0 w-80">
            <Card className="p-4 h-full">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: stage.color }}
                />
                <h3 className="font-semibold text-foreground">{stage.name}</h3>
                <span className="ml-auto text-sm text-muted-foreground bg-accent px-2 py-1 rounded">
                  {stage.leads}
                </span>
              </div>

              <div className="space-y-3">
                {/* Placeholder leads */}
                {Array.from({ length: stage.leads }).map((_, i) => (
                  <div
                    key={i}
                    className="p-3 bg-accent rounded-lg cursor-move hover:shadow-md transition-shadow"
                  >
                    <p className="font-medium text-sm text-foreground">Lead {i + 1}</p>
                    <p className="text-xs text-muted-foreground mt-1">R$ 5.000,00</p>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full mt-4" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Lead
              </Button>
            </Card>
          </div>
        ))}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Total de Leads</p>
          <p className="text-2xl font-bold text-foreground mt-2">11</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Valor Total</p>
          <p className="text-2xl font-bold text-foreground mt-2">R$ 55.000</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Taxa de Conversão</p>
          <p className="text-2xl font-bold text-foreground mt-2">9%</p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-muted-foreground">Tempo Médio</p>
          <p className="text-2xl font-bold text-foreground mt-2">15 dias</p>
        </Card>
      </div>
    </div>
  );
}
