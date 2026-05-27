const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const app = express();
const PORT = 8000;
const JWT_SECRET = 'pos-secret-key-2026';

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(cookieParser());

// ─── IN-MEMORY STORE ─────────────────────────────────────────────────────────
let users = [];
let tables = [];
let orders = [];
let idCounter = 1;

const uid = () => `id_${idCounter++}_${Date.now()}`;

// Seed admin user and demo tables
(async () => {
  const hash = await bcrypt.hash('admin123', 10);
  users.push({ _id: uid(), name: 'Admin POS', email: 'admin@gentongmas.com', phone: '08111000001', password: hash, role: 'admin' });

  for (let i = 1; i <= 12; i++) {
    tables.push({ _id: uid(), tableNo: i, seats: i % 3 === 0 ? 6 : 4, status: 'available', currentOrder: null });
  }

  // Demo orders
  const statuses = ['progress', 'ready', 'completed'];
  for (let i = 1; i <= 5; i++) {
    orders.push({
      _id: uid(),
      customerDetails: { name: `Customer ${i}`, phone: `0812000000${i}`, guests: i + 1 },
      table: tables[i - 1],
      items: [
        { name: 'Butter Chicken', price: 45000, quantity: 2 },
        { name: 'Naan Bread', price: 12000, quantity: 3 },
      ],
      totalAmount: (45000 * 2) + (12000 * 3),
      orderStatus: statuses[i % 3],
      createdAt: new Date(Date.now() - i * 3600000),
    });
  }
})();

// ─── AUTH MIDDLEWARE ──────────────────────────────────────────────────────────
const auth = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

// ─── USER ROUTES ──────────────────────────────────────────────────────────────
app.post('/api/user/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ success: false, message: 'Invalid credentials' });

  const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });
  res.cookie('accessToken', token, { maxAge: 7 * 24 * 3600 * 1000, httpOnly: true, sameSite: 'none', secure: false });
  const { password: _, ...safe } = user;
  res.json({ success: true, message: 'Login successful!', data: safe });
});

app.post('/api/user/register', async (req, res) => {
  const { name, phone, email, password, role } = req.body;
  if (!name || !phone || !email || !password || !role)
    return res.status(400).json({ success: false, message: 'All fields are required!' });
  if (users.find(u => u.email === email))
    return res.status(400).json({ success: false, message: 'User already exists!' });
  const hashed = await bcrypt.hash(password, 10);
  const newUser = { _id: uid(), name, phone, email, password: hashed, role };
  users.push(newUser);
  const { password: _, ...safe } = newUser;
  res.status(201).json({ success: true, message: 'New user created!', data: safe });
});

app.get('/api/user', auth, (req, res) => {
  const user = users.find(u => u._id === req.user._id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });
  const { password: _, ...safe } = user;
  res.json({ success: true, data: safe });
});

app.post('/api/user/logout', (req, res) => {
  res.clearCookie('accessToken');
  res.json({ success: true, message: 'Logged out!' });
});

// ─── TABLE ROUTES ─────────────────────────────────────────────────────────────
app.get('/api/table', auth, (req, res) => {
  res.json({ success: true, data: tables });
});

app.post('/api/table', auth, (req, res) => {
  const { tableNo, seats } = req.body;
  if (!tableNo) return res.status(400).json({ success: false, message: 'Table number required!' });
  if (tables.find(t => t.tableNo === tableNo))
    return res.status(400).json({ success: false, message: 'Table already exists!' });
  const newTable = { _id: uid(), tableNo, seats: seats || 4, status: 'available', currentOrder: null };
  tables.push(newTable);
  res.status(201).json({ success: true, message: 'Table added!', data: newTable });
});

app.put('/api/table/:id', auth, (req, res) => {
  const { status, orderId } = req.body;
  const idx = tables.findIndex(t => t._id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Table not found!' });
  tables[idx] = { ...tables[idx], status: status ?? tables[idx].status, currentOrder: orderId ?? tables[idx].currentOrder };
  res.json({ success: true, message: 'Table updated!', data: tables[idx] });
});

// ─── ORDER ROUTES ─────────────────────────────────────────────────────────────
app.get('/api/order', auth, (req, res) => {
  const populated = orders.map(o => ({
    ...o,
    table: tables.find(t => t._id === (o.table?._id ?? o.table)) || o.table,
  }));
  res.json({ success: true, data: populated });
});

app.post('/api/order', auth, (req, res) => {
  const newOrder = { _id: uid(), ...req.body, orderStatus: 'progress', createdAt: new Date() };
  orders.unshift(newOrder);

  // Update table status if tableId provided
  if (req.body.table) {
    const tidx = tables.findIndex(t => t._id === req.body.table);
    if (tidx !== -1) {
      tables[tidx].status = 'booked';
      tables[tidx].currentOrder = newOrder._id;
    }
  }

  res.status(201).json({ success: true, message: 'Order created!', data: newOrder });
});

app.put('/api/order/:id', auth, (req, res) => {
  const { orderStatus } = req.body;
  const idx = orders.findIndex(o => o._id === req.params.id);
  if (idx === -1) return res.status(404).json({ success: false, message: 'Order not found!' });
  orders[idx] = { ...orders[idx], orderStatus };

  // Free table when order completed
  if (orderStatus === 'completed' && orders[idx].table) {
    const tid = orders[idx].table?._id ?? orders[idx].table;
    const tidx = tables.findIndex(t => t._id === tid);
    if (tidx !== -1) { tables[tidx].status = 'available'; tables[tidx].currentOrder = null; }
  }

  res.json({ success: true, message: 'Order updated!', data: orders[idx] });
});

// ─── PAYMENT ROUTES (stub) ────────────────────────────────────────────────────
app.post('/api/payment/create-order', auth, (req, res) => {
  res.json({ success: true, data: { id: `pay_${uid()}`, amount: req.body.amount } });
});
app.post('/api/payment/verify-payment', auth, (req, res) => {
  res.json({ success: true, message: 'Payment verified!' });
});

// ─── STATS (for dashboard) ────────────────────────────────────────────────────
app.get('/api/stats', auth, (req, res) => {
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString());
  const revenue = todayOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);
  const inProgress = orders.filter(o => o.orderStatus === 'progress').length;
  res.json({ success: true, data: { totalEarnings: revenue, inProgress, totalOrders: orders.length } });
});

app.listen(PORT, () => {
  console.log(`☑️  POS Backend running on port ${PORT}`);
  console.log(`   Login: admin@gentongmas.com / admin123`);
});
