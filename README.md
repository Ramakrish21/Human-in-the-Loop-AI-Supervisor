# AI Human-in-the-Loop Supervisor System

This project is a complete, end-to-end "human-in-the-loop" system built for the Frontdesk Engineering Test. It features a simulated AI agent that can escalate unknown questions to a human supervisor. The supervisor can then provide an answer through a web-based dashboard, which automatically updates the AI's knowledge base.

### 🎥 Live Demo (Placeholder)

*(You can replace this section with a link to your screen recording)*

---

## 🚀 Core Features

* **AI Agent Simulation:** A Node.js script simulates an AI agent receiving "calls."
* **Knowledge Base:** The AI checks a central DynamoDB database (`KnowledgeBase`) for known answers.
* **Automatic Escalation:** If an answer is not found, the agent automatically creates a `Pending` request in a `HelpRequests` database.
* **Supervisor Dashboard:** A React + Vite frontend displays all `Pending` requests for a human supervisor.
* **Resolve & Learn:** The supervisor can submit an answer, which updates the request to `Resolved` and simultaneously "teaches" the AI by adding the new Q&A pair to the `KnowledgeBase`.
* **Closed Loop:** The next time the AI agent is asked the same question, it will find the new answer and respond instantly.

---

## 🏗️ Architecture & Design Decisions

This project is built as a **MERN-stack** monorepo (in a single repository with `client` and `server` folders), with DynamoDB replacing MongoDB.

* **Frontend:** **React + Vite**
    * **Why:** Vite provides a blazing-fast development experience. React is ideal for building a component-based, stateful UI.
    * **Styling:** **Tailwind CSS** was used for rapid, utility-first styling to create a simple, clean admin panel.

* **Backend:** **Node.js + Express**
    * **Why:** Provides a lightweight, fast, and scalable API server. The `routes`/`controllers` structure keeps the code clean and maintainable.

* **Database:** **AWS DynamoDB**
    * **Why:** A highly scalable, fully managed NoSQL database. It was chosen to meet the project's suggestion of a lightweight, fast DB.
    * **`HelpRequests` Table:**
        * **Primary Key:** `requestId` (String). A unique UUID for each request.
        * **Global Secondary Index (GSI):** `StatusAndDateIndex`. This is the core of the supervisor dashboard. I created this GSI with `status` as the Partition Key and `createdAt` as the Sort Key. This allows the API to efficiently query *only* for items where `status = "Pending"`, which is far more scalable than scanning the entire table.
    * **`KnowledgeBase` Table:**
        * **Primary Key:** `question` (String). This allows the AI agent to perform a fast, direct lookup (a `GetItem` or `Query`) to find an answer, which is the primary access pattern.

* **AI Agent (LiveKit):**
    * **Implementation:** The `server/AI-agent.js` script installs and uses the `livekit-server-sdk` to generate a valid JWT `AccessToken`. This demonstrates the ability to use the SDK to get a token for an agent to join a call "room." The rest of the call (audio, etc.) is simulated via console logs, as permitted by the assignment.

---

## 🛠️ How to Run This Project

You will need three terminals to run the full, end-to-end application.

### Prerequisites

* Node.js
* An AWS Account (with DynamoDB)
* AWS CLI installed and configured (`aws configure`)
* [Your GitHub Repo URL]([Link to your GitHub repo]) (for cloning)

### 1. Backend Server Setup (Terminal 1)

This terminal runs the main Express API.

```bash
# 1. Clone the repository
git clone https://github.com/Ramakrish21/Human-in-the-Loop-AI-Supervisor.git
cd Human-in-the-Loop-AI-Supervisor/server

# 2. Install dependencies
npm install

3. Create DynamoDB Tables
   - Log in to your AWS Console and go to DynamoDB.
   - Create table: `HelpRequests` (Partition Key: `requestId` [String])
   - Add GSI to `HelpRequests`:
     - Index name: `StatusAndDateIndex`
     - Partition key: `status` [String]
     - Sort key: `createdAt` [String]
   - Create table: `KnowledgeBase` (Partition Key: `question` [String])

4. Set up environment variables
   - Create a file named '.env' in the /server folder
   - Add your credentials and table names:
PORT=5001
AWS_REGION=us-east-1 # (Or your region)
HELP_REQUESTS_TABLE=HelpRequests
KNOWLEDGE_BASE_TABLE=KnowledgeBase
STATUS_INDEX_NAME=StatusAndDateIndex

# 5. Start the server
npm run dev

# Server will be running at http://localhost:5001

### 2. Frontend UI Setup (Terminal 2)

This terminal runs the React Supervisor Dashboard.

# In a new terminal, navigate to the client folder
cd Human-in-the-Loop-AI-Supervisor/client

# 2. Install dependencies
npm install

# 3. Start the React app
npm run dev

# App will be running at http://localhost:5173

### 3. AI Agent Setup (Terminal 3)

# In a new terminal, navigate to the server folder
cd Human-in-the-Loop-AI-Supervisor/server

# 4. Run the agent script
node AI-agent.js