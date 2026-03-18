import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean, json, index } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================
// CUSTOMERS & CONTACTS
// ============================================

export const customers = mysqlTable(
  "customers",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 320 }),
    phone: varchar("phone", { length: 20 }).notNull(),
    whatsappPhone: varchar("whatsappPhone", { length: 20 }),
    segment: varchar("segment", { length: 100 }),
    status: mysqlEnum("status", ["active", "inactive", "blocked"]).default("active"),
    totalPurchases: decimal("totalPurchases", { precision: 10, scale: 2 }).default("0"),
    lastPurchaseDate: timestamp("lastPurchaseDate"),
    notes: text("notes"),
    metadata: json("metadata"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("userIdIdx").on(table.userId),
    phoneIdx: index("phoneIdx").on(table.phone),
  })
);

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;

// ============================================
// MESSAGES & CONVERSATIONS
// ============================================

export const messages = mysqlTable(
  "messages",
  {
    id: int("id").autoincrement().primaryKey(),
    customerId: int("customerId").notNull(),
    userId: int("userId").notNull(),
    content: text("content").notNull(),
    messageType: mysqlEnum("messageType", ["text", "image", "document", "audio", "video"]).default("text"),
    direction: mysqlEnum("direction", ["inbound", "outbound"]).notNull(),
    whatsappMessageId: varchar("whatsappMessageId", { length: 255 }),
    status: mysqlEnum("status", ["sent", "delivered", "read", "failed"]).default("sent"),
    aiGenerated: boolean("aiGenerated").default(false),
    metadata: json("metadata"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    customerIdIdx: index("customerIdIdx").on(table.customerId),
    userIdIdx: index("userIdIdx").on(table.userId),
  })
);

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// ============================================
// SALES FUNNEL
// ============================================

export const salesFunnelStages = mysqlTable(
  "salesFunnelStages",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    order: int("order").notNull(),
    color: varchar("color", { length: 7 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("userIdIdx").on(table.userId),
  })
);

export type SalesFunnelStage = typeof salesFunnelStages.$inferSelect;
export type InsertSalesFunnelStage = typeof salesFunnelStages.$inferInsert;

export const leads = mysqlTable(
  "leads",
  {
    id: int("id").autoincrement().primaryKey(),
    customerId: int("customerId").notNull(),
    userId: int("userId").notNull(),
    stageId: int("stageId").notNull(),
    value: decimal("value", { precision: 10, scale: 2 }),
    probability: int("probability").default(0),
    expectedCloseDate: timestamp("expectedCloseDate"),
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    customerIdIdx: index("customerIdIdx").on(table.customerId),
    userIdIdx: index("userIdIdx").on(table.userId),
    stageIdIdx: index("stageIdIdx").on(table.stageId),
  })
);

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// ============================================
// WORKFLOWS & AUTOMATION
// ============================================

export const workflows = mysqlTable(
  "workflows",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    isActive: boolean("isActive").default(true),
    triggerType: mysqlEnum("triggerType", ["message_received", "customer_created", "stage_changed", "time_based"]).notNull(),
    flowData: json("flowData").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("userIdIdx").on(table.userId),
  })
);

export type Workflow = typeof workflows.$inferSelect;
export type InsertWorkflow = typeof workflows.$inferInsert;

export const workflowExecutions = mysqlTable(
  "workflowExecutions",
  {
    id: int("id").autoincrement().primaryKey(),
    workflowId: int("workflowId").notNull(),
    customerId: int("customerId").notNull(),
    status: mysqlEnum("status", ["pending", "running", "completed", "failed"]).default("pending"),
    result: json("result"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    workflowIdIdx: index("workflowIdIdx").on(table.workflowId),
    customerIdIdx: index("customerIdIdx").on(table.customerId),
  })
);

export type WorkflowExecution = typeof workflowExecutions.$inferSelect;
export type InsertWorkflowExecution = typeof workflowExecutions.$inferInsert;

// ============================================
// PURCHASES & REPURCHASE SYSTEM
// ============================================

export const purchases = mysqlTable(
  "purchases",
  {
    id: int("id").autoincrement().primaryKey(),
    customerId: int("customerId").notNull(),
    userId: int("userId").notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    productName: varchar("productName", { length: 255 }),
    productCategory: varchar("productCategory", { length: 100 }),
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    customerIdIdx: index("customerIdIdx").on(table.customerId),
    userIdIdx: index("userIdIdx").on(table.userId),
  })
);

export type Purchase = typeof purchases.$inferSelect;
export type InsertPurchase = typeof purchases.$inferInsert;

export const repurchaseRules = mysqlTable(
  "repurchaseRules",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    productCategory: varchar("productCategory", { length: 100 }),
    daysBetweenPurchases: int("daysBetweenPurchases").notNull(),
    minPurchaseAmount: decimal("minPurchaseAmount", { precision: 10, scale: 2 }),
    isActive: boolean("isActive").default(true),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("userIdIdx").on(table.userId),
  })
);

export type RepurchaseRule = typeof repurchaseRules.$inferSelect;
export type InsertRepurchaseRule = typeof repurchaseRules.$inferInsert;

export const repurchaseNotifications = mysqlTable(
  "repurchaseNotifications",
  {
    id: int("id").autoincrement().primaryKey(),
    customerId: int("customerId").notNull(),
    ruleId: int("ruleId").notNull(),
    status: mysqlEnum("status", ["pending", "sent", "clicked", "purchased"]).default("pending"),
    sentAt: timestamp("sentAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    customerIdIdx: index("customerIdIdx").on(table.customerId),
    ruleIdIdx: index("ruleIdIdx").on(table.ruleId),
  })
);

export type RepurchaseNotification = typeof repurchaseNotifications.$inferSelect;
export type InsertRepurchaseNotification = typeof repurchaseNotifications.$inferInsert;

// ============================================
// AI CONFIGURATION
// ============================================

export const aiConfigurations = mysqlTable(
  "aiConfigurations",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    systemPrompt: text("systemPrompt").notNull(),
    model: varchar("model", { length: 100 }).default("mixtral-8x7b-32768"),
    temperature: decimal("temperature", { precision: 3, scale: 2 }).default("0.7"),
    maxTokens: int("maxTokens").default(1000),
    isActive: boolean("isActive").default(true),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("userIdIdx").on(table.userId),
  })
);

export type AiConfiguration = typeof aiConfigurations.$inferSelect;
export type InsertAiConfiguration = typeof aiConfigurations.$inferInsert;

// ============================================
// TOOL CONFIGURATIONS (WhatsApp, Groq, etc)
// ============================================

export const toolConfigurations = mysqlTable(
  "toolConfigurations",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    toolName: varchar("toolName", { length: 100 }).notNull(), // "whatsapp", "groq", etc
    config: json("config").notNull(), // Store encrypted config as JSON
    isActive: boolean("isActive").default(true),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("userIdIdx").on(table.userId),
    toolNameIdx: index("toolNameIdx").on(table.toolName),
  })
);

export type ToolConfiguration = typeof toolConfigurations.$inferSelect;
export type InsertToolConfiguration = typeof toolConfigurations.$inferInsert;

// ============================================
// WEBHOOK LOGS
// ============================================

export const webhookLogs = mysqlTable(
  "webhookLogs",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    eventType: varchar("eventType", { length: 100 }).notNull(),
    payload: json("payload"),
    status: mysqlEnum("status", ["received", "processed", "failed"]).default("received"),
    errorMessage: text("errorMessage"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("userIdIdx").on(table.userId),
  })
);

export type WebhookLog = typeof webhookLogs.$inferSelect;
export type InsertWebhookLog = typeof webhookLogs.$inferInsert;

// ============================================
// RULE ENGINE
// ============================================

export const rules = mysqlTable(
  "rules",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    keywords: json("keywords").notNull(),
    response: text("response").notNull(),
    action: varchar("action", { length: 100 }),
    active: boolean("active").default(true).notNull(),
    priority: int("priority").default(0),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("rulesUserIdIdx").on(table.userId),
    activeIdx: index("rulesActiveIdx").on(table.active),
  })
);

export type Rule = typeof rules.$inferSelect;
export type InsertRule = typeof rules.$inferInsert;
