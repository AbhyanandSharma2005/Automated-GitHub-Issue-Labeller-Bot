# Automated GitHub Issue Labeler Bot

This bot automatically labels new GitHub issues using a local machine learning classifier (TF-IDF + cosine similarity) based on a large sample dataset.

---

## Features

- Listens for new issues via GitHub webhooks
- Uses a local classifier (no external API required, no cost)
- Applies relevant labels to issues automatically
- Easy Docker deployment
- Fast, private, and customizable

---

## Quickstart

### 1. Clone & Install

```bash
git clone <your_repo_url>
cd github-issue-labeler-bot
npm install
```

### 2. Configuration

Copy `.env.example` to `.env` and fill in:

- `GITHUB_TOKEN` — A GitHub Personal Access Token (with `repo` scope)
- `REPO_OWNER` and `REPO_NAME` — Your target repository
- `WEBHOOK_SECRET` — A secret string for GitHub webhook security

### 3. Run Locally

```bash
npm start
```

### 4. Run with Docker

```bash
docker build -t issue-labeler-bot .
docker run --env-file .env -p 3000:3000 issue-labeler-bot
```

Or with Docker Compose:

```bash
docker-compose up -d
```

---

## Webhook Setup

1. Deploy your bot somewhere publicly accessible (or use [ngrok](https://ngrok.com/)).
2. In your GitHub repository, go to **Settings → Webhooks**.
3. Set Payload URL to `http://your-server:3000/webhook`
4. Content type: `application/json`
5. Secret: (use the same as `WEBHOOK_SECRET` in your `.env`)
6. Events: Select **Issues**

---

## Dataset

The bot uses `test-data/issues.json` as the sample dataset for classification.  
You can expand this file with more labeled examples for even better results.

---

## Extend

- Replace the local classifier with an LLM or external ML service for smarter labeling.
- Add support for other GitHub events.
- Add more fine-grained or custom labels.

---

## License

MIT