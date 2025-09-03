require("dotenv").config();

module.exports = {
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  REPO_OWNER: process.env.REPO_OWNER,
  REPO_NAME: process.env.REPO_NAME,
  WEBHOOK_SECRET: process.env.WEBHOOK_SECRET
};