//DO NOT TOUCH
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { DynamicTool } from "langchain/tools";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { ChatPromptTemplate, SystemMessagePromptTemplate, HumanMessagePromptTemplate } from "@langchain/core/prompts";

// Define API response types
interface WorldBankApiResponse {
  [index: number]: any;
}

interface CustomerData {
  income: number;
  creditScore: number;
  debts: number;
}

// 1. Gemini setup
const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-pro",
  temperature: 0,
});

// 2. Tools
const interestRateTool = new DynamicTool({
  name: "interestRate",
  description: "Fetch current interest rates",
  func: async (): Promise<string> => {
    try {
      const mockRate = 6.5;
      return `Current RBI repo interest rate is ${mockRate}%`;
    } catch (error) {
      console.error("Interest rate tool error:", error);
      return "Failed to fetch interest rate.";
    }
  },
});

const unemploymentTool = new DynamicTool({
  name: "unemployment",
  description: "Fetch latest unemployment data",
  func: async (): Promise<string> => {
    try {
      const response = await fetch("https://api.worldbank.org/v2/country/IN/indicator/SL.UEM.TOTL.ZS?format=json");
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const data: WorldBankApiResponse = await response.json();
      const latest = data[1]?.[0];
      const rate = latest?.value ?? "unknown";
      return `Unemployment rate in India is ${rate}%`;
    } catch (error) {
      console.error("Unemployment tool error:", error);
      return "Unable to fetch unemployment data at this time.";
    }
  },
});

// 3. Prompt
const prompt = ChatPromptTemplate.fromMessages([
  SystemMessagePromptTemplate.fromTemplate(
    "You are an AI loan approval assistant. Use tools and customer information to make decisions."
  ),
  HumanMessagePromptTemplate.fromTemplate("{input}"),
  HumanMessagePromptTemplate.fromTemplate("{agent_scratchpad}"),
]);

// 4. Main function
export async function predictLoanApproval(customerData: CustomerData): Promise<{ decision: string }> {
  const tools = [interestRateTool, unemploymentTool];

  try {
    console.log("Initializing agent...");
    const agent = await createOpenAIFunctionsAgent({
      llm,
      tools,
      prompt, // ✅ Fix: Explicit prompt inclusion
    });

    console.log("Initializing executor...");
    const executor = new AgentExecutor({
      agent,
      tools,
      verbose: true,
    });

    const promptInput = `
Customer:
- Income: $${customerData.income.toLocaleString()}
- Credit Score: ${customerData.creditScore.toLocaleString()}
- Debts: $${customerData.debts.toLocaleString()}

Evaluate: Should the loan be approved? Use real-time interest rates and unemployment data to decide. Explain why.
`;

    console.log("Executing agent with prompt input...");
    const result = await executor.invoke({ input: promptInput });

    console.log("Agent execution successful!");
    return { decision: result.output };
  } catch (error) {
    console.error("Loan approval prediction error:", error);
    return { decision: "Error occurred while processing loan approval." };
  }
}
