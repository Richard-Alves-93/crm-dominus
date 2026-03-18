import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Lock, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("tools");
  const [whatsappToken, setWhatsappToken] = useState("");
  const [whatsappPhoneId, setWhatsappPhoneId] = useState("");
  const [whatsappAccountId, setWhatsappAccountId] = useState("");
  const [groqApiKey, setGroqApiKey] = useState("");
  const [showTokens, setShowTokens] = useState(false);
  const [whatsappSaving, setWhatsappSaving] = useState(false);
  const [groqSaving, setGroqSaving] = useState(false);
  const [whatsappActive, setWhatsappActive] = useState(false);
  const [groqActive, setGroqActive] = useState(false);

  // Load tool configurations on mount
  useEffect(() => {
    // TODO: Load configurations from API
  }, []);

  const handleSaveWhatsApp = async () => {
    if (!whatsappToken.trim() || !whatsappPhoneId.trim()) {
      toast.error("Por favor, preencha todos os campos do WhatsApp");
      return;
    }

    setWhatsappSaving(true);
    try {
      // TODO: Save WhatsApp config via tRPC
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWhatsappActive(true);
      toast.success("Configuração do WhatsApp salva com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar configuração do WhatsApp");
    } finally {
      setWhatsappSaving(false);
    }
  };

  const handleSaveGroq = async () => {
    if (!groqApiKey.trim()) {
      toast.error("Por favor, insira a chave de API do Groq");
      return;
    }

    setGroqSaving(true);
    try {
      // TODO: Save Groq config via tRPC
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGroqActive(true);
      toast.success("Configuração do Groq salva com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar configuração do Groq");
    } finally {
      setGroqSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground mt-1">Gerencie as configurações do seu CRM</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="tools">Ferramentas</TabsTrigger>
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="account">Conta</TabsTrigger>
        </TabsList>

        <TabsContent value="tools" className="space-y-6">
          {/* WhatsApp Configuration */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">WhatsApp Business API</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure sua integração com o WhatsApp
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Ativo</span>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Token de Acesso</label>
                <div className="relative mt-2">
                  <Input
                    type={showTokens ? "text" : "password"}
                    placeholder="Seu token de acesso do WhatsApp"
                    value={whatsappToken}
                    onChange={(e) => setWhatsappToken(e.target.value)}
                    disabled={whatsappSaving}
                  />
                  <button
                    onClick={() => setShowTokens(!showTokens)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    <Lock className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">ID do Telefone do Negócio</label>
                <Input
                  placeholder="Ex: 990556007475956"
                  value={whatsappPhoneId}
                  onChange={(e) => setWhatsappPhoneId(e.target.value)}
                  className="mt-2"
                  disabled={whatsappSaving}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground">ID da Conta Business</label>
                <Input
                  placeholder="Ex: 2694299807602327"
                  value={whatsappAccountId}
                  onChange={(e) => setWhatsappAccountId(e.target.value)}
                  className="mt-2"
                  disabled={whatsappSaving}
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Obtenha suas credenciais</p>
                  <p className="mt-1">
                    Acesse{" "}
                    <a
                      href="https://developers.facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-semibold"
                    >
                      Meta Business Platform
                    </a>{" "}
                    para gerar suas credenciais
                  </p>
                </div>
              </div>

              <Button onClick={handleSaveWhatsApp} disabled={whatsappSaving}>
                {whatsappSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {whatsappSaving ? "Salvando..." : "Salvar Configuração"}
              </Button>
            </div>
          </Card>

          {/* Groq LLM Configuration */}
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold text-foreground">Groq LLM</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Configure o motor de IA para respostas automáticas
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Ativo</span>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Chave de API</label>
                <div className="relative mt-2">
                  <Input
                    type={showTokens ? "text" : "password"}
                    placeholder="Sua chave de API do Groq"
                    value={groqApiKey}
                    onChange={(e) => setGroqApiKey(e.target.value)}
                  />
                  <button
                    onClick={() => setShowTokens(!showTokens)}
                    className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                  >
                    <Lock className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium">Obtenha sua chave de API</p>
                  <p className="mt-1">
                    Acesse{" "}
                    <a
                      href="https://console.groq.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline font-semibold"
                    >
                      Groq Console
                    </a>{" "}
                    para gerar sua chave de API
                  </p>
                </div>
              </div>

              <Button onClick={handleSaveGroq} disabled={groqSaving}>
                {groqSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {groqSaving ? "Salvando..." : "Salvar Configuração"}
              </Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="general" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Configurações Gerais</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Nome da Empresa</label>
                <Input placeholder="Seu nome da empresa" className="mt-2" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Email de Contato</label>
                <Input type="email" placeholder="seu@email.com" className="mt-2" />
              </div>
              <Button>Salvar Alterações</Button>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="space-y-6">
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Informações da Conta</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground">Email</label>
                <p className="text-foreground font-medium mt-1">usuario@email.com</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Plano</label>
                <p className="text-foreground font-medium mt-1">Premium</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Membro desde</label>
                <p className="text-foreground font-medium mt-1">Janeiro 2024</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
