// backend/server.js
require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.get('/', (req, res) => res.send('KubeNest Backend is running!'));

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
