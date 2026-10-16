const express = require('express');
const mysql = require('mysql2/promise');
const client = require('prom-client');

const app = express();
app.use(express.json());

// Metrics giám sát cho Prometheus
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

const httpRequestCounter = new client.Counter({
  name: 'gym_http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status']
});

// Kết nối Cơ sở dữ liệu MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'mysql-db',
  user: process.env.DB_USER || 'gym_user',
  password: process.env.DB_PASSWORD || 'GymSecurePass@2026',
  database: process.env.DB_NAME || 'gym_db',
  waitForConnections: true,
  connectionLimit: 10
});

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.get('/', (req, res) => {
  httpRequestCounter.inc({ method: 'GET', route: '/', status: 200 });
  res.send('<h1>Hệ thống Quản lý Phòng Gym / Fitness</h1><p>Website đang hoạt động bình thường qua Nginx Reverse Proxy.</p>');
});

app.get('/api/members', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM members');
    httpRequestCounter.inc({ method: 'GET', route: '/api/members', status: 200 });
    res.json(rows);
  } catch (err) {
    httpRequestCounter.inc({ method: 'GET', route: '/api/members', status: 500 });
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Gym app listening on port 3000');
});