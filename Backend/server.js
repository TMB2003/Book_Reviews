const app = require("./app");
const http = require("http");
const { connectAll } = require('./db');

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

// Start only after all DB connections are established
connectAll().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});