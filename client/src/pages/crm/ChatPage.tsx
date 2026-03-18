import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Search } from "lucide-react";

export default function ChatPage() {
  const [selectedCustomer, setSelectedCustomer] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      // TODO: Implement message sending via tRPC
      setMessageInput("");
    }
  };

  return (
    <div className="flex h-full bg-background">
      {/* Conversations List */}
      <div className="w-80 border-r border-border flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conversas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {/* Placeholder conversations */}
            {[1, 2, 3, 4, 5].map((id) => (
              <button
                key={id}
                onClick={() => setSelectedCustomer(id)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  selectedCustomer === id
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
              >
                <p className="font-medium text-sm">Cliente {id}</p>
                <p className="text-xs text-muted-foreground truncate">
                  Última mensagem...
                </p>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedCustomer ? (
          <>
            {/* Header */}
            <div className="p-4 border-b border-border">
              <h2 className="font-semibold text-foreground">Cliente {selectedCustomer}</h2>
              <p className="text-xs text-muted-foreground">Ativo agora</p>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {/* Placeholder messages */}
                {[1, 2, 3].map((id) => (
                  <div key={id} className={`flex ${id % 2 === 0 ? "justify-end" : ""}`}>
                    <div
                      className={`max-w-xs px-4 py-2 rounded-lg ${
                        id % 2 === 0
                          ? "bg-primary text-primary-foreground"
                          : "bg-accent text-foreground"
                      }`}
                    >
                      <p className="text-sm">Mensagem de exemplo {id}</p>
                      <p className="text-xs opacity-70 mt-1">10:{id}0</p>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t border-border">
              <div className="flex gap-2">
                <Input
                  placeholder="Digite uma mensagem..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <Button onClick={handleSendMessage} size="icon">
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <p className="text-muted-foreground">Selecione uma conversa para começar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
