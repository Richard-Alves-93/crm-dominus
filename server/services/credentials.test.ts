import { describe, it, expect } from "vitest";

describe("Credentials Validation", () => {
  it("should have Groq API key configured", () => {
    const groqKey = process.env.GROQ_API_KEY;
    expect(groqKey).toBeDefined();
    expect(groqKey).toMatch(/^gsk_/);
    expect(groqKey?.length).toBeGreaterThan(20);
  });

  it("should have WhatsApp Business Phone ID configured", () => {
    const phoneId = process.env.WHATSAPP_BUSINESS_PHONE_ID;
    expect(phoneId).toBeDefined();
    expect(phoneId).toMatch(/^\d+$/);
    expect(phoneId?.length).toBeGreaterThan(10);
  });

  it("should have WhatsApp Business Account ID configured", () => {
    const accountId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID;
    expect(accountId).toBeDefined();
    expect(accountId).toMatch(/^\d+$/);
    expect(accountId?.length).toBeGreaterThan(10);
  });

  it("should have WhatsApp API Token configured", () => {
    const token = process.env.WHATSAPP_API_TOKEN;
    expect(token).toBeDefined();
    expect(token).toMatch(/^EAA/);
    expect(token?.length).toBeGreaterThan(100);
  });

  it("should validate Groq API key format", () => {
    const groqKey = process.env.GROQ_API_KEY;
    // Groq keys start with 'gsk_' and are base64-like
    const isValidFormat = /^gsk_[A-Za-z0-9_-]+$/.test(groqKey || "");
    expect(isValidFormat).toBe(true);
  });

  it("should validate WhatsApp token format", () => {
    const token = process.env.WHATSAPP_API_TOKEN;
    // WhatsApp tokens are long base64 strings starting with EAA
    const isValidFormat = /^EAA[A-Za-z0-9_-]+$/.test(token || "");
    expect(isValidFormat).toBe(true);
  });
});
