const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

// Initialized DynamoDB client
try {
  require('./config/db.config');
  console.log('DynamoDB client initialized successfully.');
} catch (error) {
  console.error('Failed to initialize DynamoDB client:', error);
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5001;

// --- Middleware ---
app.use(cors());
app.use(express.json());


// --- API Routes ---
app.use('/api/requests', require('./routes/requestRoutes'));
app.use('/api/knowledge', require('./routes/knowledgeRoutes'));

app.get('/', (req, res) => {
  res.send('AI Supervisor Backend is running!');
});

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

// --- Start Server ---
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});