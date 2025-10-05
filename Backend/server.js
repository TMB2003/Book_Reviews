const app = require("./app");
const http = require("http");
const { connectDb } = require('./db');

const server = http.createServer(app);

const PORT = process.env.PORT || 3000;

// Start only after DB connection is established
connectDb().then(() => {
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});