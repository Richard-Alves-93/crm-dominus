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


## Fase 11: Rule Engine - Palavras-chave e Respostas Automáticas
- [x] Implementar motor de regras com palavras-chave (comprar, suporte, boleto, etc)
- [x] Criar sistema de configuração de regras no backend
- [x] Implementar interface de gerenciamento de regras no frontend
- [ ] Testar roteamento de mensagens para Rule Engine

## Fase 12: Flow Engine - Motor de Execução de Fluxos
- [ ] Implementar interpretador de fluxos salvos no banco
- [ ] Suportar nó de Mensagem (enviar texto/mídia)
- [ ] Suportar nó de Condição (desvios lógicos)
- [ ] Suportar nó de Esperar Resposta (pausar fluxo)
- [ ] Suportar nó de IA (chamar Groq dentro do fluxo)
- [ ] Suportar nó de Executar Ação (chamar Action Engine)
- [ ] Implementar interface visual de construtor de fluxos no frontend

## Fase 13: Action Engine - Execução de Ações
- [ ] Implementar ação: Criar pedido
- [ ] Implementar ação: Atualizar funil
- [ ] Implementar ação: Cadastrar cliente
- [ ] Implementar ação: Agendar recompra
- [ ] Implementar ação: Notificar atendente
- [ ] Implementar ação: Enviar mensagem
- [ ] Criar sistema de fila para processamento de ações

## Fase 14: Recompra Automática
- [ ] Implementar cálculo de data de próxima recompra
- [ ] Criar cron job para verificar datas de recompra
- [ ] Implementar geração automática de mensagens de lembrete
- [ ] Implementar envio automático de mensagens via WhatsApp
- [ ] Adicionar visualização de recompras no painel

## Fase 15: WebSocket e Tempo Real
- [ ] Implementar Socket.io para comunicação em tempo real
- [ ] Disparar eventos quando mensagem chegar
- [ ] Disparar eventos quando ação for executada
- [ ] Atualizar painel CRM em tempo real sem refresh
- [ ] Implementar indicadores de status (online/offline)

## Fase 16: Melhorias de UX
- [ ] Implementar modal de cadastro/edição de clientes
- [ ] Implementar modal de cadastro/edição de leads
- [ ] Adicionar validação de dados em formulários
- [ ] Implementar drag-and-drop no funil de vendas
- [ ] Adicionar busca e filtros avançados
- [ ] Implementar notificações visuais de ações


## Fase 17: Design Responsivo Mobile-First
- [x] Tornar sidebar responsivo (collapse em mobile)
- [x] Adaptar layout do dashboard para mobile
- [x] Adaptar layout do chat para mobile
- [x] Adaptar layout de clientes para mobile
- [x] Adaptar layout do funil para mobile
- [x] Adaptar layout de regras para mobile
- [ ] Testar em diferentes tamanhos de tela (320px, 768px, 1024px)

## Fase 18: PWA (Progressive Web App)
- [x] Criar manifest.json com metadados da aplicação
- [x] Adicionar ícones para diferentes tamanhos (192x192, 512x512)
- [x] Implementar Service Worker para cache offline
- [x] Configurar tema de cores para mobile
- [ ] Adicionar splash screen
- [ ] Testar instalação em dispositivos reais

## Fase 19: Sincronização com GitHub
- [ ] Configurar script de push automático para GitHub
- [ ] Adicionar atribuição de direitos autorais (Richard Alves)
- [ ] Adicionar link WhatsApp no footer
- [ ] Testar sincronização após cada alteração
- [ ] Documentar processo de deploy
