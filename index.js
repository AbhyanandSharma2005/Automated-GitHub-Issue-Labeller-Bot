require("dotenv").config();
const express = require("express");
const { handleGitHubWebhook } = require("./github");

const app = express();
app.use(express.json());

app.post("/webhook", handleGitHubWebhook);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`GitHub Issue Labeler Bot running on port ${PORT}`);
});