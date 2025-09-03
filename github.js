const axios = require("axios");
const crypto = require("crypto");
const { getLabelsForIssue } = require("./labeler");
const { GITHUB_TOKEN, REPO_OWNER, REPO_NAME, WEBHOOK_SECRET } = require("./config");

// HMAC SHA256 signature verification
function isValidSignature(signature, payload) {
  if (!signature || !WEBHOOK_SECRET) return false;
  const hmac = crypto.createHmac("sha256", WEBHOOK_SECRET);
  const digest = "sha256=" + hmac.update(payload).digest("hex");
  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(digest));
}

// Handle incoming GitHub webhook events
async function handleGitHubWebhook(req, res) {
  const event = req.headers["x-github-event"];
  const signature = req.headers["x-hub-signature-256"];
  const payload = JSON.stringify(req.body);

  if (!isValidSignature(signature, payload)) {
    return res.status(401).send("Invalid signature");
  }

  if (event === "issues" && req.body.action === "opened") {
    const issue = req.body.issue;
    const labels = await getLabelsForIssue(issue.title, issue.body);
    if (labels.length > 0) {
      await applyLabels(issue.number, labels);
    }
  }
  res.status(200).send("OK");
}

// Apply labels to an issue using GitHub API
async function applyLabels(issueNumber, labels) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues/${issueNumber}/labels`;
  await axios.post(
    url,
    { labels },
    {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        "User-Agent": "github-issue-labeler-bot"
      }
    }
  );
  console.log(`Applied labels to issue #${issueNumber}: ${labels.join(", ")}`);
}

module.exports = { handleGitHubWebhook };