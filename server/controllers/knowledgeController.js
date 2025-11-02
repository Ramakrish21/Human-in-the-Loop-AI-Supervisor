const { ddbDocClient } = require("../config/db.config");
const { ScanCommand } = require("@aws-sdk/lib-dynamodb");

const KNOWLEDGE_BASE_TABLE = process.env.KNOWLEDGE_BASE_TABLE;

// --- Get all learned answers from Knowledge Base ---
exports.getLearnedAnswers = async (req, res) => {
  try {
    const data = await ddbDocClient.send(new ScanCommand({ TableName: KNOWLEDGE_BASE_TABLE }));
    res.json(data.Items);
  } catch (err) {
    console.error("Error fetching knowledge base:", err);
    res.status(500).json({ error: "Could not fetch knowledge base" });
  }
};
