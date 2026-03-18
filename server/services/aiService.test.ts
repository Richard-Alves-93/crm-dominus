import { describe, it, expect, vi, beforeEach } from "vitest";
import { generateAIResponse, analyzeCustomerContext, generateAutoReply } from "./aiService";
import * as db from "../db";

// Mock the database functions
vi.mock("../db", () => ({
  getToolConfigurationByName: vi.fn(),
}));

// Mock the LLM function
vi.mock("../_core/llm", () => ({
  invokeLLM: vi.fn(),
}));

describe("AI Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("generateAIResponse", () => {
    it("should generate a response when Groq is configured", async () => {
      const mockGroqConfig = {
        id: 1,
        userId: 1,
        toolName: "groq",
        config: { apiKey: "test-key", model: "mixtral-8x7b-32768" },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.getToolConfigurationByName).mockResolvedValue(mockGroqConfig as any);

      const { invokeLLM } = await import("../_core/llm");
      vi.mocked(invokeLLM).mockResolvedValue({
        choices: [
          {
            message: {
              content: "Test response",
            },
          },
        ],
      } as any);

      const messages = [
        { role: "user" as const, content: "Hello" },
      ];

      const result = await generateAIResponse(1, messages);

      expect(result).toBe("Test response");
      expect(db.getToolConfigurationByName).toHaveBeenCalledWith(1, "groq");
    });

    it("should throw error when Groq is not configured", async () => {
      vi.mocked(db.getToolConfigurationByName).mockResolvedValue(null);

      const messages = [
        { role: "user" as const, content: "Hello" },
      ];

      await expect(generateAIResponse(1, messages)).rejects.toThrow(
        "Groq AI is not configured or inactive"
      );
    });

    it("should throw error when API key is missing", async () => {
      const mockGroqConfig = {
        id: 1,
        userId: 1,
        toolName: "groq",
        config: { model: "mixtral-8x7b-32768" }, // Missing apiKey
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.getToolConfigurationByName).mockResolvedValue(mockGroqConfig as any);

      const messages = [
        { role: "user" as const, content: "Hello" },
      ];

      await expect(generateAIResponse(1, messages)).rejects.toThrow(
        "Groq API key is not configured"
      );
    });
  });

  describe("analyzeCustomerContext", () => {
    it("should analyze customer context", async () => {
      const mockGroqConfig = {
        id: 1,
        userId: 1,
        toolName: "groq",
        config: { apiKey: "test-key", model: "mixtral-8x7b-32768" },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.getToolConfigurationByName).mockResolvedValue(mockGroqConfig as any);

      const { invokeLLM } = await import("../_core/llm");
      vi.mocked(invokeLLM).mockResolvedValue({
        choices: [
          {
            message: {
              content: "Customer analysis result",
            },
          },
        ],
      } as any);

      const result = await analyzeCustomerContext(
        1,
        "John Doe",
        "5 purchases, total $1000",
        "Last message: How much is the product?"
      );

      expect(result).toBe("Customer analysis result");
    });
  });

  describe("generateAutoReply", () => {
    it("should generate an auto reply", async () => {
      const mockGroqConfig = {
        id: 1,
        userId: 1,
        toolName: "groq",
        config: { apiKey: "test-key", model: "mixtral-8x7b-32768" },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.getToolConfigurationByName).mockResolvedValue(mockGroqConfig as any);

      const { invokeLLM } = await import("../_core/llm");
      vi.mocked(invokeLLM).mockResolvedValue({
        choices: [
          {
            message: {
              content: "Thank you for your message!",
            },
          },
        ],
      } as any);

      const result = await generateAutoReply(
        1,
        "How much is the product?",
        "Customer: John Doe"
      );

      expect(result).toBe("Thank you for your message!");
    });

    it("should use custom prompt if provided", async () => {
      const mockGroqConfig = {
        id: 1,
        userId: 1,
        toolName: "groq",
        config: { apiKey: "test-key", model: "mixtral-8x7b-32768" },
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      vi.mocked(db.getToolConfigurationByName).mockResolvedValue(mockGroqConfig as any);

      const { invokeLLM } = await import("../_core/llm");
      vi.mocked(invokeLLM).mockResolvedValue({
        choices: [
          {
            message: {
              content: "Custom response",
            },
          },
        ],
      } as any);

      const customPrompt = "You are a sales representative";
      const result = await generateAutoReply(
        1,
        "How much is the product?",
        "Customer: John Doe",
        customPrompt
      );

      expect(result).toBe("Custom response");
    });
  });
});
