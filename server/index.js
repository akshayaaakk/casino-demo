const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const { initializeDatabase } = require('./db');
const authRoutes = require('./auth');
const gamesRoutes = require('./games');
const setupAviator = require('./aviator');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Demo casino server is running.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/games', gamesRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

setupAviator(io);
initializeDatabase();

server.listen(PORT, () => {
  console.log(`Demo casino server running on http://localhost:${PORT}`);
});
