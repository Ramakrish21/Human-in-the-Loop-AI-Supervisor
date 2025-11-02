const { ddbDocClient } = require("../config/db.config");
const { QueryCommand, PutCommand, UpdateCommand, ScanCommand } = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");


// Loading table names from environment
const HELP_REQUESTS_TABLE = process.env.HELP_REQUESTS_TABLE;
const KNOWLEDGE_BASE_TABLE = process.env.KNOWLEDGE_BASE_TABLE;
const STATUS_INDEX_NAME = process.env.STATUS_INDEX_NAME;

// --- Get all help requests ---
exports.getAllRequests = async (req, res) => {
  try {
    const data = await ddbDocClient.send(new ScanCommand({ TableName: HELP_REQUESTS_TABLE }));
    res.json(data.Items);
  } catch (err) {
    console.error("Error fetching all requests:", err);
    res.status(500).json({ error: "Could not fetch requests" });
  }
};

// --- Get only pending requests ---
exports.getPendingRequests = async (req, res) => {
  const params = {
    TableName: HELP_REQUESTS_TABLE,
    IndexName: STATUS_INDEX_NAME,
    KeyConditionExpression: "#status = :status",
    ExpressionAttributeNames: { "#status": "status" },
    ExpressionAttributeValues: { ":status": "Pending" },
  };

  try {
    const data = await ddbDocClient.send(new QueryCommand(params));
    const sortedItems = data.Items.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    res.json(sortedItems);
  } catch (err) {
    console.error("Error fetching pending requests:", err);
    res.status(500).json({ error: "Could not fetch pending requests" });
  }
};

// --- Create a new help request ---
exports.createRequest = async (req, res) => {
  const { customerQuestion } = req.body;
  if (!customerQuestion) {
    return res.status(400).json({ error: "customerQuestion is required" });
  }

  const newRequest = {
    requestId: uuidv4(),
    customerQuestion,
    status: "Pending",
    createdAt: new Date().toISOString(),
    supervisorAnswer: "",
  };

  try {
    await ddbDocClient.send(new PutCommand({ TableName: HELP_REQUESTS_TABLE, Item: newRequest }));
    console.log(`SIMULATION: Texting supervisor about new request ${newRequest.requestId}`);
    res.status(201).json(newRequest);
  } catch (err) {
    console.error("Error creating request:", err);
    res.status(500).json({ error: "Could not create request" });
  }
};

// --- Resolve a help request ---
exports.resolveRequest = async (req, res) => {
  const { requestId } = req.params;
  const { supervisorAnswer } = req.body;

  if (!supervisorAnswer) {
    return res.status(400).json({ error: "supervisorAnswer is required" });
  }

  const updateParams = {
    TableName: HELP_REQUESTS_TABLE,
    Key: { requestId },
    UpdateExpression: "set #status = :status, #answer = :answer",
    ExpressionAttributeNames: { "#status": "status", "#answer": "supervisorAnswer" },
    ExpressionAttributeValues: { ":status": "Resolved", ":answer": supervisorAnswer },
    ReturnValues: "ALL_NEW",
  };

  try {
    const { Attributes } = await ddbDocClient.send(new UpdateCommand(updateParams));

    // Add the answer to Knowledge Base
    const knowledgeItem = {
      question: Attributes.customerQuestion,
      answer: supervisorAnswer,
      createdAt: new Date().toISOString(),
    };
    await ddbDocClient.send(new PutCommand({ TableName: KNOWLEDGE_BASE_TABLE, Item: knowledgeItem }));

    console.log(`SIMULATION: Texting customer for request ${requestId} with answer: "${supervisorAnswer}"`);
    res.json(Attributes);
  } catch (err) {
    console.error("Error resolving request:", err);
    res.status(500).json({ error: "Could not resolve request" });
  }
};
