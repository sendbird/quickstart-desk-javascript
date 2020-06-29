const express = require('express');
const path = require('path');
const app = express();
const PORT = 8888;

app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res) {
  res.sendFile('/public/index.htm', { root: './' });
});

app.listen(PORT);
console.log(`[SERVER RUNNING] 127.0.0.1:${PORT}`);
