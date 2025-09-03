const { suggestLabels, GITHUB_LABELS } = require("./classifier");

async function getLabelsForIssue(title, body) {
  // Simple concatenation; can be improved
  const text = `${title}\n${body || ""}`;
  const labels = suggestLabels(text);
  // Only return valid labels
  return labels.filter(l => GITHUB_LABELS.includes(l));
}

module.exports = { getLabelsForIssue, GITHUB_LABELS };