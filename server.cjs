
const express = require("express");
const path = require("path");

const app = express();
const distPath = path.join(__dirname, "dist");

app.use(express.static(distPath));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`ScholarSetu running on port ${PORT}`);
});
