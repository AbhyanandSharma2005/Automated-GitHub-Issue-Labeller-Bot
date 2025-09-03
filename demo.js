// Simple in-browser label classifier demo (mock logic)

const sampleLabels = [
  { keywords: ['bug', 'error', 'crash', 'fail', 'broken'], label: 'bug' },
  { keywords: ['feature', 'add', 'support', 'request', 'enhance'], label: 'enhancement' },
  { keywords: ['doc', 'readme', 'documentation', 'guide'], label: 'documentation' },
  { keywords: ['help', 'assist', 'support', 'question'], label: 'help wanted' },
  { keywords: ['how', 'what', 'why', 'question', 'can i'], label: 'question' }
];

function suggestLabels(title, body) {
  const text = (title + ' ' + body).toLowerCase();
  let found = [];

  sampleLabels.forEach(({keywords, label}) => {
    if (keywords.some(k => text.includes(k))) found.push(label);
  });

  if (found.length === 0) found.push('unlabeled');
  return found;
}

document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById('demo-form');
  const res = document.getElementById('result');
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('title').value;
    const body = document.getElementById('body').value;
    const labels = suggestLabels(title, body);
    res.innerHTML = `<b>Suggested label(s):</b> <span>${labels.join(', ')}</span>`;
    res.style.display = 'block';
  });
});