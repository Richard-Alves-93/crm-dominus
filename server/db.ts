import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  customers,
  InsertCustomer,
  messages,
  InsertMessage,
  salesFunnelStages,
  InsertSalesFunnelStage,
  leads,
  InsertLead,
  workflows,
  InsertWorkflow,
  purchases,
  InsertPurchase,
  repurchaseRules,
  InsertRepurchaseRule,
  aiConfigurations,
  InsertAiConfiguration,
  toolConfigurations,
  InsertToolConfiguration,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============================================
// CUSTOMERS
// ============================================

export async function getCustomersByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(customers).where(eq(customers.userId, userId));
}

export async function getCustomerById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(customers).where(eq(customers.id, id)).limit(1);
  return result[0];
}

export async function createCustomer(data: InsertCustomer) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(customers).values(data);
  return result[0];
}

export async function updateCustomer(id: number, data: Partial<InsertCustomer>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(customers).set(data).where(eq(customers.id, id));
  return getCustomerById(id);
}

export async function getCustomerByPhone(userId: number, phone: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(customers).where(and(eq(customers.userId, userId), eq(customers.phone, phone))).limit(1);
  return result[0];
}

// ============================================
// MESSAGES
// ============================================

export async function getMessagesByCustomerId(customerId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(messages).where(eq(messages.customerId, customerId)).orderBy(desc(messages.createdAt)).limit(limit);
}

export async function createMessage(data: InsertMessage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(messages).values(data);
  const result = await db.select().from(messages).orderBy(desc(messages.createdAt)).limit(1);
  return result[0];
}

export async function updateMessageStatus(id: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(messages).set({ status: status as any }).where(eq(messages.id, id));
}

// ============================================
// SALES FUNNEL
// ============================================

export async function getSalesFunnelStagesByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(salesFunnelStages).where(eq(salesFunnelStages.userId, userId)).orderBy(salesFunnelStages.order);
}

export async function createSalesFunnelStage(data: InsertSalesFunnelStage) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(salesFunnelStages).values(data);
  return result[0];
}

export async function getLeadsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(leads).where(eq(leads.userId, userId));
}

export async function getLeadsByStageId(stageId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(leads).where(eq(leads.stageId, stageId));
}

export async function createLead(data: InsertLead) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(leads).values(data);
  return result[0];
}

export async function updateLead(id: number, data: Partial<InsertLead>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(leads).set(data).where(eq(leads.id, id));
  return db.select().from(leads).where(eq(leads.id, id)).limit(1).then(r => r[0]);
}

// ============================================
// WORKFLOWS
// ============================================

export async function getWorkflowsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(workflows).where(eq(workflows.userId, userId));
}

export async function createWorkflow(data: InsertWorkflow) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(workflows).values(data);
  return result[0];
}

export async function updateWorkflow(id: number, data: Partial<InsertWorkflow>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(workflows).set(data).where(eq(workflows.id, id));
  return db.select().from(workflows).where(eq(workflows.id, id)).limit(1).then(r => r[0]);
}

// ============================================
// PURCHASES & REPURCHASE
// ============================================

export async function getPurchasesByCustomerId(customerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(purchases).where(eq(purchases.customerId, customerId)).orderBy(desc(purchases.createdAt));
}

export async function createPurchase(data: InsertPurchase) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(purchases).values(data);
  return result[0];
}

export async function getRepurchaseRulesByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(repurchaseRules).where(eq(repurchaseRules.userId, userId));
}

export async function createRepurchaseRule(data: InsertRepurchaseRule) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(repurchaseRules).values(data);
  return result[0];
}

// ============================================
// AI CONFIGURATION
// ============================================

export async function getAiConfigurationsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(aiConfigurations).where(eq(aiConfigurations.userId, userId));
}

export async function getActiveAiConfiguration(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(aiConfigurations).where(and(eq(aiConfigurations.userId, userId), eq(aiConfigurations.isActive, true))).limit(1);
  return result[0];
}

export async function createAiConfiguration(data: InsertAiConfiguration) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(aiConfigurations).values(data);
  return result[0];
}

export async function updateAiConfiguration(id: number, data: Partial<InsertAiConfiguration>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(aiConfigurations).set(data).where(eq(aiConfigurations.id, id));
  return db.select().from(aiConfigurations).where(eq(aiConfigurations.id, id)).limit(1).then(r => r[0]);
}

// ============================================
// TOOL CONFIGURATIONS
// ============================================

export async function getToolConfigurationsByUserId(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(toolConfigurations).where(eq(toolConfigurations.userId, userId));
}

export async function getToolConfigurationByName(userId: number, toolName: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(toolConfigurations).where(and(eq(toolConfigurations.userId, userId), eq(toolConfigurations.toolName, toolName))).limit(1);
  return result[0];
}

export async function createToolConfiguration(data: InsertToolConfiguration) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(toolConfigurations).values(data);
  return result[0];
}

export async function updateToolConfiguration(id: number, data: Partial<InsertToolConfiguration>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(toolConfigurations).set(data).where(eq(toolConfigurations.id, id));
  return db.select().from(toolConfigurations).where(eq(toolConfigurations.id, id)).limit(1).then(r => r[0]);
}
