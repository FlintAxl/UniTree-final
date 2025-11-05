const express = require('express');
const app = express();
const cors = require('cors')
const path = require('path')
const connection = require('./config/database');

const user = require('./routes/user')
const adminRoutes = require('./routes/admin');
const petRoutes = require('./routes/pet'); 
const product = require('./routes/product')
const order = require('./routes/order')
const review = require('./routes/review')
const inventoryRoutes = require('./routes/inventory');
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/images', express.static(path.join(__dirname, 'images')))

app.use(express.static(path.join(__dirname, '/public')));

app.use('/api/v1', product);
app.use('/api/v1', user);
app.use('/api/v1', petRoutes);
app.use('/api/v1', order);
app.use('/admin', adminRoutes);
app.use('/api/v1', review);
app.use('/api/v1', inventoryRoutes);

async function clearTokens() {
  try {
    await connection.promise().query('UPDATE users SET token = NULL');
    console.log('✅ All users logged out (tokens cleared)');
  } catch (err) {
    console.error('❌ Error clearing tokens:', err);
  }
}

process.on('SIGINT', async () => {
  console.log('⚠️ Server shutting down...');
  await clearTokens();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('⚠️ Server stopping...');
  await clearTokens();
  process.exit(0);
});

module.exports = app