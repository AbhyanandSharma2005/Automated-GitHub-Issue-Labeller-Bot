// Simple local classifier using TF-IDF + Cosine Similarity for label suggestion

const fs = require('fs');
const path = require('path');

// Load dataset (sample: issue text + labels)
const datasetPath = path.join(__dirname, '../test-data/issues.json');
const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

const GITHUB_LABELS = Array.from(
  new Set(dataset.flatMap(item => item.labels))
);

function tokenize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function computeTf(tokens) {
  const tf = {};
  tokens.forEach(tok => {
    tf[tok] = (tf[tok] || 0) + 1;
  });
  Object.keys(tf).forEach(tok => {
    tf[tok] /= tokens.length;
  });
  return tf;
}

function computeIdf(allTokens) {
  const N = allTokens.length;
  const df = {};
  allTokens.forEach(tokens => {
    new Set(tokens).forEach(tok => {
      df[tok] = (df[tok] || 0) + 1;
    });
  });
  const idf = {};
  Object.keys(df).forEach(tok => {
    idf[tok] = Math.log(N / (df[tok]));
  });
  return idf;
}

function computeTfidf(tf, idf) {
  const tfidf = {};
  Object.keys(tf).forEach(tok => {
    tfidf[tok] = tf[tok] * (idf[tok] || 0);
  });
  return tfidf;
}

function cosineSimilarity(a, b) {
  const allToks = new Set([...Object.keys(a), ...Object.keys(b)]);
  let dot = 0, magA = 0, magB = 0;
  allToks.forEach(tok => {
    dot += (a[tok] || 0) * (b[tok] || 0);
    magA += (a[tok] || 0) ** 2;
    magB += (b[tok] || 0) ** 2;
  });
  return magA && magB ? dot / (Math.sqrt(magA) * Math.sqrt(magB)) : 0;
}

// Precompute all tokens, TF, and IDF for dataset
const allTokens = dataset.map(d => tokenize(d.text));
const allTf = allTokens.map(tokens => computeTf(tokens));
const idf = computeIdf(allTokens);
const allTfidf = allTf.map(tf => computeTfidf(tf, idf));

// Suggest labels for input text
function suggestLabels(text, topN = 3, threshold = 0.07) {
  const tokens = tokenize(text);
  const tf = computeTf(tokens);
  const tfidf = computeTfidf(tf, idf);

  // Find top similar issues and aggregate their labels
  const scored = allTfidf.map((vec, i) => ({
    sim: cosineSimilarity(tfidf, vec),
    labels: dataset[i].labels
  }));

  scored.sort((a, b) => b.sim - a.sim);
  const top = scored.slice(0, topN).filter(x => x.sim > threshold);

  // Count label frequencies in top matches
  const labelCounts = {};
  top.forEach(match => match.labels.forEach(l => {
    labelCounts[l] = (labelCounts[l] || 0) + 1;
  }));

  // Return sorted labels
  return Object.keys(labelCounts).sort((a, b) => labelCounts[b] - labelCounts[a]);
}

module.exports = { suggestLabels, GITHUB_LABELS };