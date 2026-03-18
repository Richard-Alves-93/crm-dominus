import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function RulesPage() {
  const [rules, setRules] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    keywords: "",
    response: "",
    action: "",
    priority: "0",
  });

  const handleAddRule = async () => {
    if (!formData.name.trim() || !formData.keywords.trim() || !formData.response.trim()) {
      toast.error("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);
    try {
      // TODO: Call API to save rule
      const newRule = {
        id: Date.now(),
        ...formData,
        keywords: formData.keywords.split(",").map(k => k.trim()),
        priority: parseInt(formData.priority),
      };
      setRules([...rules, newRule]);
      setFormData({ name: "", keywords: "", response: "", action: "", priority: "0" });
      toast.success("Regra criada com sucesso!");
    } catch (error) {
      toast.error("Erro ao criar regra");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRule = async (id: number) => {
    setLoading(true);
    try {
      // TODO: Call API to delete rule
      setRules(rules.filter(r => r.id !== id));
      toast.success("Regra deletada com sucesso!");
    } catch (error) {
      toast.error("Erro ao deletar regra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Motor de Regras</h1>
        <p className="text-muted-foreground mt-2">
          Configure respostas automáticas baseadas em palavras-chave
        </p>
      </div>

      <Tabs defaultValue="rules" className="w-full">
        <TabsList>
          <TabsTrigger value="rules">Regras Ativas</TabsTrigger>
          <TabsTrigger value="create">Nova Regra</TabsTrigger>
        </TabsList>

        {/* Rules List */}
        <TabsContent value="rules" className="space-y-4">
          {rules.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  Nenhuma regra criada ainda. Crie uma nova regra para começar.
                </p>
              </CardContent>
            </Card>
          ) : (
            rules.map((rule) => (
              <Card key={rule.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle>{rule.name}</CardTitle>
                      <CardDescription>
                        Palavras-chave: {Array.isArray(rule.keywords) ? rule.keywords.join(", ") : rule.keywords}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteRule(rule.id)}
                        disabled={loading}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <Label className="text-xs text-muted-foreground">Resposta Automática</Label>
                    <p className="text-sm">{rule.response}</p>
                  </div>
                  {rule.action && (
                    <div>
                      <Label className="text-xs text-muted-foreground">Ação</Label>
                      <p className="text-sm">{rule.action}</p>
                    </div>
                  )}
                  <div>
                    <Label className="text-xs text-muted-foreground">Prioridade</Label>
                    <p className="text-sm">{rule.priority}</p>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Create Rule */}
        <TabsContent value="create">
          <Card>
            <CardHeader>
              <CardTitle>Criar Nova Regra</CardTitle>
              <CardDescription>
                Configure uma regra para responder automaticamente a mensagens específicas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="rule-name">Nome da Regra</Label>
                <Input
                  id="rule-name"
                  placeholder="Ex: Compra - Iniciar Pedido"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="keywords">Palavras-chave (separadas por vírgula)</Label>
                <Input
                  id="keywords"
                  placeholder="Ex: comprar, quero comprar, novo pedido"
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  A regra será acionada quando a mensagem contiver qualquer uma dessas palavras-chave
                </p>
              </div>

              <div>
                <Label htmlFor="response">Resposta Automática</Label>
                <textarea
                  id="response"
                  placeholder="Digite a resposta que será enviada automaticamente"
                  value={formData.response}
                  onChange={(e) => setFormData({ ...formData, response: e.target.value })}
                  className="w-full p-2 border border-border rounded-md mt-2 min-h-[100px]"
                />
              </div>

              <div>
                <Label htmlFor="action">Ação (Opcional)</Label>
                <select
                  id="action"
                  value={formData.action}
                  onChange={(e) => setFormData({ ...formData, action: e.target.value })}
                  className="w-full p-2 border border-border rounded-md mt-2"
                >
                  <option value="">Nenhuma ação</option>
                  <option value="create_order">Criar Pedido</option>
                  <option value="notify_support">Notificar Suporte</option>
                  <option value="send_invoice">Enviar Fatura</option>
                  <option value="schedule_repurchase">Agendar Recompra</option>
                </select>
              </div>

              <div>
                <Label htmlFor="priority">Prioridade</Label>
                <Input
                  id="priority"
                  type="number"
                  min="0"
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Regras com prioridade maior são verificadas primeiro
                </p>
              </div>

              <Button onClick={handleAddRule} disabled={loading} className="w-full">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Criando..." : "Criar Regra"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Info Box */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Como funciona o Motor de Regras?</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 space-y-2">
          <p>
            1. Quando uma mensagem é recebida, o sistema verifica se ela contém alguma das palavras-chave configuradas
          </p>
          <p>
            2. Se encontrar uma correspondência, envia a resposta automática configurada
          </p>
          <p>
            3. Se houver uma ação associada, ela é executada (ex: criar pedido, notificar suporte)
          </p>
          <p>
            4. Se nenhuma regra corresponder, a mensagem é encaminhada para o AI Engine ou Flow Engine
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
