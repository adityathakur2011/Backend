const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const routes = require('./routes/index');
require('dotenv').config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use('/api', routes);

const PORT = process.env.PORT || 5000;

app.use((req, res, next) => {
  console.log(`\x1b[33m%s\x1b[0m`, `Incoming request: ${req.method} ${req.url}`);
  next();
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'Resource not found' });
});

app.use((err, req, res, next) => {
  console.error(`\x1b[31m%s\x1b[0m`, `Error: ${err.message}`);
  res.status(500).json({ message: 'Internal server error' });
});
app.listen(PORT, () => {
  console.log(`\x1b[35m%s\x1b[0m`, `Server running on http://localhost:${PORT}`);
});
