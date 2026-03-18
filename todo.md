# CRM Dominus - TODO List

## Fase 1: Análise e Planejamento
- [x] Análise de requisitos e arquitetura
- [x] Criação do plano de desenvolvimento
- [x] Configurar variáveis de ambiente (WhatsApp API, Groq LLM)

## Fase 2: Banco de Dados
- [x] Criar tabela `customers` (clientes)
- [x] Criar tabela `messages` (mensagens de chat)
- [x] Criar tabela `sales_funnel_stages` (etapas do funil)
- [x] Criar tabela `leads` (leads no funil)
- [x] Criar tabela `workflows` (fluxos de automação)
- [x] Criar tabela `workflow_nodes` (nós dos fluxos)
- [x] Criar tabela `workflow_edges` (conexões entre nós)
- [x] Criar tabela `repurchase_rules` (regras de recompra)
- [x] Criar tabela `purchase_history` (histórico de compras)
- [x] Criar tabela `ai_configurations` (configurações de IA)
- [x] Criar tabela `webhook_logs` (logs de webhooks)

## Fase 3: Backend - APIs Básicas
- [x] Implementar CRUD de clientes
- [x] Implementar API de mensagens
- [x] Implementar API do funil de vendas
- [x] Implementar API de gerenciamento de fluxos
- [x] Implementar API de histórico de compras

## Fase 4: AI Engine e Rule Engine
- [x] Integrar Groq LLM para respostas automáticas
- [x] Criar sistema de configurações de IA
- [ ] Implementar Rule Engine para avaliação de condições
- [ ] Implementar Action Engine para execução de ações
- [x] Implementar análise de contexto de cliente

## Fase 5: Webhook WhatsApp
- [x] Configurar endpoint de webhook para receber mensagens
- [x] Implementar validação de tokens do WhatsApp
- [x] Implementar processamento de mensagens recebidas
- [x] Implementar envio de mensagens via WhatsApp API
- [ ] Criar sistema de fila para processamento assíncrono

## Fase 6: Sistema de Recompras
- [ ] Implementar análise de padrões de compra
- [ ] Criar regras automáticas de recompra
- [ ] Implementar notificações de recompra
- [ ] Criar sistema de agendamento de recompras
- [ ] Implementar relatórios de recompra

## Fase 7: Frontend - Painel de Chat
- [x] Criar layout do painel CRM com sidebar
- [x] Implementar lista de conversas
- [x] Implementar chat estilo WhatsApp
- [x] Implementar envio de mensagens
- [ ] Implementar indicadores de status (online/offline)
- [x] Implementar busca de conversas

## Fase 8: Frontend - Gerenciamento de Clientes e Funil
- [x] Implementar página de clientes com tabela
- [ ] Implementar modal de cadastro/edição de cliente
- [x] Implementar página do funil de vendas
- [ ] Implementar drag-and-drop de leads entre etapas
- [ ] Implementar visualização de detalhes do lead
- [x] Implementar construtor visual de fluxos (Flow Builder)

## Fase 9: Frontend - Dashboard e Configurações
- [x] Implementar dashboard com métricas de vendas
- [x] Implementar gráficos de conversão
- [ ] Implementar gráficos de recompra
- [x] Implementar página de configuração de IA
- [x] Implementar editor de prompts
- [x] Implementar página de configurações gerais

## Fase 10: Testes e Publicação
- [x] Escrever testes unitários do backend (13 testes passando)
- [x] Validar credenciais do Groq e WhatsApp
- [ ] Testar fluxo completo de vendas
- [ ] Testar integração WhatsApp
- [ ] Testar AI Engine
- [ ] Publicar no GitHub
- [ ] Documentar API e uso do sistema
