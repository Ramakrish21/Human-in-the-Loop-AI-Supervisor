require("dotenv").config();
const axios = require("axios");
const { AccessToken } = require("livekit-server-sdk");

// ==========================================================
// 1 API CLIENT — Connects the AI Agent to its own backend
// ==========================================================
const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL || "http://localhost:5001/api",
  headers: { "Content-Type": "application/json" },
});

// ==========================================================
// 2 LIVEKIT CONFIGURATION — From your LiveKit Cloud project
// ==========================================================
const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET;
const LIVEKIT_HOST_URL = process.env.LIVEKIT_HOST_URL;

if (!LIVEKIT_API_KEY || !LIVEKIT_API_SECRET || !LIVEKIT_HOST_URL) {
  console.error(" Missing LiveKit credentials in .env file");
  process.exit(1);
}

/**
 * Generates a LiveKit access token for the AI Agent.
 * In a real app, this token allows the agent to join an audio room.
 */
async function generateAgentToken(callId, agentId) {
  const accessToken = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: agentId,
    name: "AI Agent",
  });

  accessToken.addGrant({
    room: callId,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  });

  return await accessToken.toJwt();
}

// ==========================================================
// 3 AI AGENT LOGIC — Simulated "Brain"
// ==========================================================
async function handleSimulatedCall(customerQuestion) {
  console.log("\n---------------------------------------------");
  console.log("[AI Agent]  Simulating incoming customer call...");
  console.log(`[Customer] "${customerQuestion}"`);

  try {
    // Step 1: Fetch Knowledge Base
    const response = await apiClient.get("/knowledge");
    const knowledgeBase = response.data || [];

    // Step 2: Search for a matching question (case-insensitive)
    const matchedEntry = knowledgeBase.find(
      (item) => item.question.toLowerCase() === customerQuestion.toLowerCase()
    );

    if (matchedEntry) {
      console.log(`[AI Agent]  Found answer: "${matchedEntry.answer}"`);
    } else {
      console.log(`[AI Agent]  No answer found.`);
      console.log(`[AI Agent] "Let me check with my supervisor and get back to you."`);

      // Step 3: Create a new help request (escalation)
      await apiClient.post("/requests", { customerQuestion });
      console.log(`[AI Agent] 🚀 Escalation request sent to supervisor.`);
    }
  } catch (error) {
    console.error("[AI Agent]  Backend connection error:", error.message);
    console.log(`[AI Agent] "Sorry, I'm having trouble accessing my systems right now."`);
  }

  // Step 4: Demonstrate LiveKit SDK usage
  try {
    const token = await generateAgentToken("call_123", "agent_001");

    if (typeof token === "string") {
      console.log(`[LiveKit SDK]  Generated connection token: ${token.substring(0, 20)}...`);
    } else {
      console.log("[LiveKit SDK]  Could not generate token (check your API keys). Token:", token);
    }
  } catch (err) {
    console.error("[LiveKit SDK] Error generating token:", err.message);
  }

  console.log("---------------------------------------------");
}

// ==========================================================
// 4 RUN SIMULATION — Two test scenarios
// ==========================================================
async function runDemo() {
  await handleSimulatedCall("What's your name?");
}

runDemo();
