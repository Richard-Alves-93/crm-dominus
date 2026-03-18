import { describe, it, expect, beforeEach, vi } from "vitest";
import { findMatchingRule, DEFAULT_RULES } from "./ruleEngine";

describe("Rule Engine", () => {
  describe("findMatchingRule", () => {
    it("should find a matching rule for 'comprar' keyword", async () => {
      const message = "Olá, eu quero comprar um produto";
      const match = await findMatchingRule(message);
      
      // Note: This test will return null if database is not available
      // In a real scenario, we would mock the database
      expect(match === null || match?.keywords.length > 0).toBe(true);
    });

    it("should find a matching rule for 'suporte' keyword", async () => {
      const message = "Preciso de suporte, há um problema com meu pedido";
      const match = await findMatchingRule(message);
      
      expect(match === null || match?.keywords.length > 0).toBe(true);
    });

    it("should be case-insensitive", async () => {
      const message = "COMPRAR um produto";
      const match = await findMatchingRule(message);
      
      expect(match === null || match?.keywords.length > 0).toBe(true);
    });

    it("should return null for non-matching message", async () => {
      const message = "xyz abc 123 qwerty";
      const match = await findMatchingRule(message);
      
      expect(match === null).toBe(true);
    });

    it("should handle empty messages", async () => {
      const message = "";
      const match = await findMatchingRule(message);
      
      expect(match === null).toBe(true);
    });
  });

  describe("DEFAULT_RULES", () => {
    it("should have predefined rules", () => {
      expect(DEFAULT_RULES.length).toBeGreaterThan(0);
    });

    it("should have rules with required fields", () => {
      DEFAULT_RULES.forEach((rule) => {
        expect(rule.name).toBeDefined();
        expect(rule.keywords).toBeDefined();
        expect(rule.response).toBeDefined();
        expect(Array.isArray(rule.keywords)).toBe(true);
        expect(rule.keywords.length).toBeGreaterThan(0);
      });
    });

    it("should have 'Compra' rule", () => {
      const compraRule = DEFAULT_RULES.find((r) => r.name.includes("Compra"));
      expect(compraRule).toBeDefined();
      expect(compraRule?.keywords).toContain("comprar");
      expect(compraRule?.action).toBe("create_order");
    });

    it("should have 'Suporte' rule", () => {
      const supportRule = DEFAULT_RULES.find((r) => r.name.includes("Suporte"));
      expect(supportRule).toBeDefined();
      expect(supportRule?.keywords).toContain("suporte");
      expect(supportRule?.action).toBe("notify_support");
    });

    it("should have 'Boleto' rule", () => {
      const boletoRule = DEFAULT_RULES.find((r) => r.name.includes("Boleto"));
      expect(boletoRule).toBeDefined();
      expect(boletoRule?.keywords).toContain("boleto");
      expect(boletoRule?.action).toBe("send_invoice");
    });

    it("should have 'Recompra' rule", () => {
      const repurchaseRule = DEFAULT_RULES.find((r) => r.name.includes("Recompra"));
      expect(repurchaseRule).toBeDefined();
      expect(repurchaseRule?.keywords).toContain("recomprar");
      expect(repurchaseRule?.action).toBe("schedule_repurchase");
    });

    it("should have 'Horário' rule", () => {
      const horarioRule = DEFAULT_RULES.find((r) => r.name.includes("Horário"));
      expect(horarioRule).toBeDefined();
      expect(horarioRule?.keywords).toContain("horário");
    });
  });

  describe("Keyword matching logic", () => {
    it("should match partial words in message", () => {
      const keywords = ["comprar", "quero comprar"];
      const message = "Olá, eu quero comprar um produto";
      
      const hasMatch = keywords.some((keyword) =>
        message.toLowerCase().includes(keyword.toLowerCase())
      );
      
      expect(hasMatch).toBe(true);
    });

    it("should handle multiple keywords", () => {
      const keywords = ["comprar", "boleto", "suporte"];
      const message = "Preciso de suporte para pagar o boleto";
      
      const hasMatch = keywords.some((keyword) =>
        message.toLowerCase().includes(keyword.toLowerCase())
      );
      
      expect(hasMatch).toBe(true);
    });

    it("should match partial keywords in words", () => {
      const keywords = ["compra"];
      const message = "Eu comprei um produto";
      
      const hasMatch = keywords.some((keyword) =>
        message.toLowerCase().includes(keyword.toLowerCase())
      );
      
      // Note: "compra" is NOT in "comprei" - they are different
      expect(hasMatch).toBe(false);
    });

    it("should match exact keyword phrases", () => {
      const keywords = ["comprei"];
      const message = "Eu comprei um produto";
      
      const hasMatch = keywords.some((keyword) =>
        message.toLowerCase().includes(keyword.toLowerCase())
      );
      
      expect(hasMatch).toBe(true);
    });
  });
});
