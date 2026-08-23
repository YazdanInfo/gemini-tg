# 🤖 Gemini-TG

> A lightweight, production-ready Telegram AI bot powered by Google's Gemini API.

<p align="center">
  <strong>Fast. Simple. Context-aware.</strong><br>
  Bring Gemini-powered conversations directly to Telegram.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Telegram-Bot-26A5E4?style=for-the-badge&logo=telegram&logoColor=white" alt="Telegram">
  <img src="https://img.shields.io/badge/Gemini-API-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini">
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="MIT License">
</p>

---

## ✨ Features

- 🤖 **Gemini-powered conversations**
- 💬 **Private chat support**
- 👥 **Group support** with mentions and replies
- 🧠 **Per-chat conversation context**
- ♻️ **Automatic context management**
- ⚡ **Multiple Gemini model selection**
- 🔄 **Automatic fallback** for temporary model failures
- 📢 **Configurable sponsor-channel membership gate**
- 🧵 **Per-chat message queue**
- 🛡️ **Environment-based secrets**
- 🧹 **Conversation-history sanitization**
- 🚀 **Simple deployment**
- 📦 **Minimal project structure**
- 🌍 **Multilingual conversations**

---

## 🖥️ Requirements

Before running Gemini-TG, make sure you have:

- [Node.js](https://nodejs.org/) 18 or newer
- A Telegram bot
- A Google Gemini API key
- A Telegram channel for the membership gate

---

## 🚀 Installation

Clone the repository:

```bash
git clone https://github.com/YazdanInfo/gemini-tg.git
cd gemini-tg
```

Install dependencies:

```bash
npm install
```

Create your environment configuration:

```bash
cp .env.example .env
```

Edit `.env`:

```env
BOT_TOKEN=your_telegram_bot_token
GEMINI_API_KEY=your_gemini_api_key

SPONSOR_CHANNEL=@your_channel
SPONSOR_CHANNEL_LINK=https://t.me/your_channel
```

Start the bot:

```bash
npm start
```

---

## 🔐 Environment Variables

Gemini-TG keeps deployment-specific configuration outside the source code.

| Variable | Required | Description |
|---|---|---|
| `BOT_TOKEN` | ✅ | Telegram Bot API token |
| `GEMINI_API_KEY` | ✅ | Google Gemini API key |
| `SPONSOR_CHANNEL` | ✅ | Channel username used for membership verification |
| `SPONSOR_CHANNEL_LINK` | ✅ | Link displayed by the join button |

### Example

```env
BOT_TOKEN=your_telegram_bot_token
GEMINI_API_KEY=your_gemini_api_key
SPONSOR_CHANNEL=@myZ_bots
SPONSOR_CHANNEL_LINK=https://t.me/myZ_bots
```

---

## 📢 Sponsor Channel

The sponsor channel is fully configurable through environment variables.

You do **not** need to edit `index.js` when changing the sponsor channel.

```env
SPONSOR_CHANNEL=@myZ_bots
SPONSOR_CHANNEL_LINK=https://t.me/myZ_bots
```

You can change it to another channel:

```env
SPONSOR_CHANNEL=@another_channel
SPONSOR_CHANNEL_LINK=https://t.me/another_channel
```

### Configuration

`SPONSOR_CHANNEL` is used to verify membership.

`SPONSOR_CHANNEL_LINK` is used by the join button.

> The bot needs sufficient permissions in the sponsor channel to reliably check membership.

---

## 🔒 Security

**Never commit secrets to GitHub.**

Gemini-TG reads sensitive values exclusively from environment variables:

```js
process.env.BOT_TOKEN
process.env.GEMINI_API_KEY
process.env.SPONSOR_CHANNEL
process.env.SPONSOR_CHANNEL_LINK
```

The repository includes:

```text
.env.example
.gitignore
```

Your real `.env` file should remain local or be configured through your hosting provider's secret/environment-variable system.

### If a credential is exposed

Immediately:

1. Revoke the exposed credential.
2. Generate a replacement.
3. Update your deployment environment.
4. Verify that the old credential is no longer present in Git history or source files.

**Never reuse credentials that have been publicly exposed.**

---

## 💬 Usage

### Private Chats

Open the bot and send:

```text
Hello!
```

The bot will respond using Gemini.

### Group Chats

Gemini-TG responds when:

- The bot is mentioned.
- Someone replies to a message from the bot.

Example:

```text
@YourBot explain how Linux works
```

Or simply reply to one of the bot's messages.

---

## ⚡ Model Selection

Users can select their preferred Gemini model through the inline keyboard.

Current configuration:

| Display name | Gemini model |
|---|---|
| ⚡ Gemini 3.5 Flash Lite | `gemini-3.5-flash-lite` |
| 🚀 Gemini 3.7 Flash | `gemini-3.7-flash` |

The default model is:

```js
const DEFAULT_MODEL_LABEL = "⚡ Gemini 3.5 Flash Lite";
```

If the selected model encounters a supported quota or availability error, Gemini-TG automatically retries using the fallback model.

> Gemini model names and availability may change over time. Update the model configuration if Google changes the available API models.

---

## 🧠 Conversation Context

Gemini-TG maintains conversation history separately for each Telegram chat.

The default context limit is:

```js
const MAX_CONTEXT_CHARS = 20000;
```

When the stored context reaches the limit, the bot automatically starts a fresh conversation.

### Important

Conversation history is stored **in memory**.

This means:

- Restarting the bot clears conversation history.
- No database is required.
- Gemini-TG does not persist conversation history itself.

---

## 🧵 Message Processing

Messages from the same chat are processed sequentially.

This prevents multiple simultaneous requests from corrupting conversation context.

Different chats can continue processing independently.

---

## 🛡️ Error Handling

Gemini-TG handles common Telegram and Gemini failures, including:

- Telegram message-edit conflicts
- Expired callback queries
- Missing chats
- Bot membership errors
- Gemini quota errors
- Temporary model availability errors
- Gemini safety filtering
- Empty model responses
- Telegram `409 Conflict`

Temporary model failures can trigger the configured fallback model.

---

## 📁 Project Structure

```text
gemini-tg/
├── index.js
├── package.json
├── README.md
├── .env.example
└── .gitignore
```

### Why a single `index.js`?

The project intentionally keeps the core bot implementation in one file.

This makes Gemini-TG:

- Easy for beginners to understand
- Fast to deploy
- Simple to modify
- Easy to move between hosts
- Straightforward to debug

---

## ⚙️ Customization

### Change the AI Personality

The AI behavior is controlled by:

```js
const SYSTEM_INSTRUCTION = `...`;
```

Customize Z's personality, tone, and conversational behavior there.

### Add Another Model

Add a model to:

```js
const MODELS = {
  "Model Name": "gemini-model-id"
};
```

The model automatically becomes available through the selection keyboard.

### Change Context Size

Modify:

```js
const MAX_CONTEXT_CHARS = 20000;
```

to change the maximum amount of conversation context retained per chat.

---

## ☁️ Deployment

Gemini-TG works on Node.js-compatible hosting platforms.

Configure these environment variables through your hosting provider:

```text
BOT_TOKEN
GEMINI_API_KEY
SPONSOR_CHANNEL
SPONSOR_CHANNEL_LINK
```

Then run:

```bash
npm start
```

### PM2

For a Linux server, PM2 can keep the bot running:

```bash
npm install -g pm2
```

Start the bot:

```bash
pm2 start index.js --name gemini-tg
```

Save the process list:

```bash
pm2 save
```

---

## 🐛 Troubleshooting

### `BOT_TOKEN environment variable is required`

Set `BOT_TOKEN` in your environment.

### `GEMINI_API_KEY environment variable is required`

Set `GEMINI_API_KEY` in your environment.

### `SPONSOR_CHANNEL environment variable is required`

Example:

```env
SPONSOR_CHANNEL=@myZ_bots
```

### `SPONSOR_CHANNEL_LINK environment variable is required`

Example:

```env
SPONSOR_CHANNEL_LINK=https://t.me/myZ_bots
```

### Telegram `409 Conflict`

Another instance of the same bot is already running.

Stop the existing instance before starting another one.

### Membership verification doesn't work

Check that:

- `SPONSOR_CHANNEL` is correct.
- The channel exists.
- The bot has appropriate access to the channel.
- The channel username and link match.
- The user has actually joined the channel.

### Gemini requests fail

Check:

- Your Gemini API key.
- Your API quota.
- The configured model names.
- Whether the models are available to your account.

---

## 🤝 Contributing

Contributions are welcome.

### Development Workflow

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/my-feature
```

3. Make your changes.
4. Test the bot locally.
5. Commit your changes:

```bash
git commit -m "feat: add my feature"
```

6. Push the branch:

```bash
git push origin feature/my-feature
```

7. Open a pull request.

### Please Never Submit

- Telegram bot tokens
- Gemini API keys
- `.env` files
- Passwords
- Private credentials
- Private deployment configuration

---

## 📄 License

Gemini-TG is released under the **MIT License**.

See [`LICENSE`](LICENSE) for the full license text.

---

## 👤 Author

Created by **YazdanInfo**.

- GitHub: https://github.com/YazdanInfo

---

<p align="center">
  <strong>Gemini + Telegram + a little Z ✨</strong>
</p>
