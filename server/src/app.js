const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/error');

const app = express();
const origins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((s) => s.trim().replace(/\/$/, ''));

app.use(helmet());
app.use(cors({ origin: origins }));
app.use(express.json({ limit: '2mb' }));

app.get('/', (req, res) => res.json({ status: 'ok', service: 'store-rating-api' }));
app.use('/api', routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;