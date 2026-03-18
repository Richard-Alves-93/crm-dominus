import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddingCustomer, setIsAddingCustomer] = useState(false);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
          <p className="text-muted-foreground mt-1">Gerencie seus clientes e contatos</p>
        </div>
        <Button onClick={() => setIsAddingCustomer(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      <Card className="p-6">
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar clientes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Segmento</TableHead>
              <TableHead>Total de Compras</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Placeholder rows */}
            {[1, 2, 3, 4, 5].map((id) => (
              <TableRow key={id}>
                <TableCell className="font-medium">Cliente {id}</TableCell>
                <TableCell>cliente{id}@email.com</TableCell>
                <TableCell>(11) 9999-{String(id).padStart(4, "0")}</TableCell>
                <TableCell>Premium</TableCell>
                <TableCell>R$ {(id * 1000).toLocaleString("pt-BR")}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm">
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
