import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

export default function ToolsSettingsPage() {
  const [groqKey, setGroqKey] = useState("");
  const [groqLoading, setGroqLoading] = useState(false);
  const [groqSaved, setGroqSaved] = useState(false);

  const [whatsappToken, setWhatsappToken] = useState("");
  const [whatsappPhoneId, setWhatsappPhoneId] = useState("");
  const [whatsappAccountId, setWhatsappAccountId] = useState("");
  const [whatsappLoading, setWhatsappLoading] = useState(false);
  const [whatsappSaved, setWhatsappSaved] = useState(false);

  const saveGroqConfig = async () => {
    if (!groqKey.trim()) {
      toast.error("Por favor, insira a chave de API do Groq");
      return;
    }

    setGroqLoading(true);
    try {
      // TODO: Call API to save Groq configuration
      await new Promise(resolve => setTimeout(resolve, 1000));
      setGroqSaved(true);
      toast.success("Configuração do Groq salva com sucesso!");
      setTimeout(() => setGroqSaved(false), 3000);
    } catch (error) {
      toast.error("Erro ao salvar configuração do Groq");
    } finally {
      setGroqLoading(false);
    }
  };

  const saveWhatsAppConfig = async () => {
    if (!whatsappToken.trim() || !whatsappPhoneId.trim() || !whatsappAccountId.trim()) {
      toast.error("Por favor, preencha todos os campos do WhatsApp");
      return;
    }

    setWhatsappLoading(true);
    try {
      // TODO: Call API to save WhatsApp configuration
      await new Promise(resolve => setTimeout(resolve, 1000));
      setWhatsappSaved(true);
      toast.success("Configuração do WhatsApp salva com sucesso!");
      setTimeout(() => setWhatsappSaved(false), 3000);
    } catch (error) {
      toast.error("Erro ao salvar configuração do WhatsApp");
    } finally {
      setWhatsappLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Configurações de Ferramentas</h1>
        <p className="text-muted-foreground mt-2">
          Configure as integrações com Groq LLM e WhatsApp Business API
        </p>
      </div>

      <Tabs defaultValue="groq" className="w-full">
        <TabsList>
          <TabsTrigger value="groq">Groq LLM</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp Business</TabsTrigger>
        </TabsList>

        {/* Groq Configuration */}
        <TabsContent value="groq">
          <Card>
            <CardHeader>
              <CardTitle>Configuração do Groq LLM</CardTitle>
              <CardDescription>
                Configure a chave de API do Groq para ativar respostas automáticas com IA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {groqSaved && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Configuração salva com sucesso! O Groq LLM está ativo.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="groq-key">Chave de API do Groq</Label>
                <Input
                  id="groq-key"
                  type="password"
                  placeholder="gsk_..."
                  value={groqKey}
                  onChange={(e) => setGroqKey(e.target.value)}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Você pode obter sua chave em <a href="https://console.groq.com" target="_blank" rel="noopener noreferrer" className="underline">console.groq.com</a>
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">O que é Groq LLM?</h4>
                <p className="text-sm text-blue-800">
                  Groq fornece um modelo de linguagem rápido e eficiente para gerar respostas automáticas às mensagens dos clientes. Isso permite que seu CRM responda instantaneamente com respostas personalizadas e inteligentes.
                </p>
              </div>

              <Button onClick={saveGroqConfig} disabled={groqLoading}>
                {groqLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {groqLoading ? "Salvando..." : "Salvar Configuração"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WhatsApp Configuration */}
        <TabsContent value="whatsapp">
          <Card>
            <CardHeader>
              <CardTitle>Configuração do WhatsApp Business</CardTitle>
              <CardDescription>
                Configure as credenciais da API do WhatsApp Business para enviar e receber mensagens
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {whatsappSaved && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    Configuração salva com sucesso! WhatsApp Business está ativo.
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="whatsapp-token">Token de Acesso</Label>
                <Input
                  id="whatsapp-token"
                  type="password"
                  placeholder="EAA..."
                  value={whatsappToken}
                  onChange={(e) => setWhatsappToken(e.target.value)}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Token de acesso da sua aplicação WhatsApp Business
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp-phone">ID do Número de Telefone</Label>
                <Input
                  id="whatsapp-phone"
                  type="text"
                  placeholder="990556007475956"
                  value={whatsappPhoneId}
                  onChange={(e) => setWhatsappPhoneId(e.target.value)}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  ID do número de telefone do WhatsApp Business
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp-account">ID da Conta Business</Label>
                <Input
                  id="whatsapp-account"
                  type="text"
                  placeholder="2694299807602327"
                  value={whatsappAccountId}
                  onChange={(e) => setWhatsappAccountId(e.target.value)}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  ID da sua conta WhatsApp Business
                </p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-900 mb-2">Como configurar?</h4>
                <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                  <li>Acesse <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer" className="underline">developers.facebook.com</a></li>
                  <li>Crie uma aplicação WhatsApp Business</li>
                  <li>Gere um token de acesso permanente</li>
                  <li>Copie o ID do número de telefone e da conta</li>
                </ol>
              </div>

              <Button onClick={saveWhatsAppConfig} disabled={whatsappLoading}>
                {whatsappLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {whatsappLoading ? "Salvando..." : "Salvar Configuração"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Status Section */}
      <Card>
        <CardHeader>
          <CardTitle>Status das Integrações</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">Groq LLM</p>
              <p className="text-sm text-muted-foreground">Respostas automáticas com IA</p>
            </div>
            <div className="flex items-center gap-2">
              {groqSaved ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Ativo</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-600">Inativo</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">WhatsApp Business</p>
              <p className="text-sm text-muted-foreground">Envio e recebimento de mensagens</p>
            </div>
            <div className="flex items-center gap-2">
              {whatsappSaved ? (
                <>
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="text-sm font-medium text-green-600">Ativo</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-600">Inativo</span>
                </>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
