require('dotenv').config();
const express = require('express');
const cors = require('cors');
const router = require('./routes');
const ErrorMiddleware = require('./middleware/err.middleware');
const connect = require('./config/db.config');
const run = require('./run');

// (async function () {
//   await run();
// })();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use(router);
app.use(ErrorMiddleware);
app.use('*', (_, res) => {
  res.status(404).json({ message: 'Invalid url', status: 404 });
});

app.listen(+process.env.PORT, async () => {
  await connect();
  console.log('Server listening on port:', process.env.PORT);
});
