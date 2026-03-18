import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Plus, Edit2, Trash2, Play } from "lucide-react";

export default function WorkflowsPage() {
  const [workflows] = useState([
    { id: 1, name: "Boas-vindas", trigger: "customer_created", isActive: true },
    { id: 2, name: "Recompra", trigger: "time_based", isActive: true },
    { id: 3, name: "Acompanhamento", trigger: "message_received", isActive: false },
  ]);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Automações</h1>
          <p className="text-muted-foreground mt-1">Crie fluxos automáticos para seus clientes</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Novo Fluxo
        </Button>
      </div>

      <div className="grid gap-4">
        {workflows.map((workflow) => (
          <Card key={workflow.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">{workflow.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Acionado por: {workflow.trigger}
                </p>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {workflow.isActive ? "Ativo" : "Inativo"}
                  </span>
                  <Switch checked={workflow.isActive} />
                </div>

                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <Play className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {workflows.length === 0 && (
        <Card className="p-8 text-center">
          <p className="text-muted-foreground">Nenhum fluxo criado ainda</p>
          <Button className="mt-4">
            <Plus className="w-4 h-4 mr-2" />
            Criar Primeiro Fluxo
          </Button>
        </Card>
      )}
    </div>
  );
}
