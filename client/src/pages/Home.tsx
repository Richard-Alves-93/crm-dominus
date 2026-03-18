import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import CRM from "./CRM";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth();

  // If user is authenticated, show CRM
  if (isAuthenticated && user) {
    return <CRM />;
  }

  // If loading, show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show login page
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full mx-auto px-6">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h1 className="text-4xl font-bold text-foreground mb-2">CRM Dominus</h1>
          <p className="text-muted-foreground mb-8">Gestão de Vendas e Relacionamento com Clientes</p>
          
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            size="lg"
            className="w-full"
          >
            Entrar com Manus
          </Button>

          <p className="text-xs text-muted-foreground mt-6">
            Acesse seu CRM para gerenciar clientes, mensagens e vendas
          </p>
        </div>
      </div>
    </div>
  );
}
