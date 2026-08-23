# Z AI Telegram Bot 🤖✨

A sophisticated Telegram bot powered by Google's Gemini AI that responds as "Z" — a warm, clever, and slightly mischievous AI companion. The bot works in both private chats and group conversations, featuring multi-model support, sponsor channel verification, and intelligent context management.

## ✨ Features

- **🤖 Multi-Model Support**: Switch between Gemini 3.5 Flash Lite and Gemini 3.7 Flash
- **💬 Group & Private Chat**: Responds in private chats or when mentioned/replied to in groups
- **🔐 Sponsor Verification**: Requires users to join a sponsor channel before use
- **🧠 Smart Context Management**: Maintains conversation history with automatic reset when context limits are reached
- **🔄 Automatic Fallback**: Falls back to a lighter model during high-demand or rate-limited periods
- **🌍 Multi-Language**: Responds in the user's language automatically
- **⚡ Queue System**: Prevents race conditions in concurrent message handling
- **🛡️ Robust Error Handling**: Gracefully handles Telegram API errors and rate limits

## 🚀 Getting Started

### Prerequisites

- Node.js 16 or higher
- A Telegram Bot Token ([Get one from @BotFather](https://t.me/botfather))
- Google Gemini API Key ([Get one from Google AI Studio](https://makersuite.google.com/app/apikey))
- A sponsor Telegram channel with the bot added as admin

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/z-ai-telegram-bot.git
   cd z-ai-telegram-bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:
   ```env
   BOT_TOKEN=your_telegram_bot_token_here
   GEMINI_API_KEY=your_gemini_api_key_here
   SPONSOR_CHANNEL=@your_sponsor_channel_username
   SPONSOR_CHANNEL_LINK=https://t.me/your_sponsor_channel_username
   ```

4. **Run the bot**
   ```bash
   npm start
   ```

## 📦 Dependencies

```json
{
  "dependencies": {
    "grammy": "^1.x.x",
    "@google/generative-ai": "^0.x.x"
  }
}
```

Install with:
```bash
npm install grammy @google/generative-ai
```

## 🎯 Usage

### Private Chat
1. Start the bot with `/start`
2. Join the sponsor channel if prompted
3. Choose your preferred AI model
4. Start chatting naturally!

### Group Chat
- **Mention the bot**: `@YourBotName What do you think about AI?`
- **Reply to the bot**: Reply directly to any bot message

### Available Commands

| Command | Description |
|---------|-------------|
| `/start` | Initialize the bot and check membership |

### Model Selection

Users can switch between available models using the inline keyboard:
- ⚡ **Gemini 3.5 Flash Lite** - Faster, more efficient responses
- 🚀 **Gemini 3.7 Flash** - More powerful, detailed responses

## 🧠 How It Works

### Conversation Flow

1. **User Interaction**: Bot receives a text message
2. **Context Check**: Determines if it should respond (private chat vs group mention)
3. **Membership Verification**: Ensures user has joined the sponsor channel
4. **Context Management**: Retrieves or initializes conversation history
5. **AI Processing**: Sends to appropriate Gemini model with full context
6. **Response Delivery**: Returns AI response with proper formatting

### Context Management

The bot maintains conversation history per chat:
- Stores up to 20,000 characters of context
- Automatically resets when limit is reached
- Sanitizes history before sending to Gemini
- Preserves conversation flow across messages

### Error Handling

The bot gracefully handles:
- Rate limiting (429 errors)
- Service overload (503 errors)
- Content blocking
- Telegram API errors
- Invalid callback queries
- Network issues

### Fallback System

If the primary model fails due to:
- High demand
- Rate limits
- Service overload
- Empty responses

The bot automatically falls back to Gemini 3.5 Flash Lite to ensure users always get a response.

## 🏗️ Architecture

### Core Components

```
┌─────────────────┐
│   Telegram Bot   │
│     (grammy)     │
└────────┬─────────┘
         │
    ┌────▼─────┐
    │ Message   │
    │ Handler   │
    └────┬─────┘
         │
    ┌────▼─────┐
    │ Context   │
    │ Manager   │
    └────┬─────┘
         │
    ┌────▼─────┐
    │  Gemini   │
    │    AI     │
    └──────────┘
```

### Key Functions

- `getChatState()` - Manages conversation history per chat
- `pushTurn()` - Adds messages to conversation history
- `sanitizeHistory()` - Cleans history before sending to API
- `enqueue()` - Prevents race conditions in message handling
- `shouldRespondInChat()` - Determines bot response eligibility
- `generateWithModel()` - Core AI response generation
- `isMember()` - Verifies sponsor channel membership

## 🎭 The "Z" Persona

The bot is configured with a unique personality:
- **Warm & Clever**: Speaks like a close friend, not a manual
- **Curious**: Asks thoughtful questions that show genuine interest
- **Playful**: Mirrors the user's energy and adds wit
- **Real**: Admits limitations and builds trust through honesty
- **Engaging**: Leaves hooks to keep conversations going

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `BOT_TOKEN` | Telegram Bot API token | ✅ |
| `GEMINI_API_KEY` | Google Gemini API key | ✅ |
| `SPONSOR_CHANNEL` | Sponsor channel username | ✅ |
| `SPONSOR_CHANNEL_LINK` | Sponsor channel invite link | ✅ |

### Modifiable Settings

You can customize:
- `MODELS` - Add or remove available AI models
- `MAX_CONTEXT_CHARS` - Adjust context window size
- `SYSTEM_INSTRUCTION` - Modify the AI personality
- `START_MESSAGE` - Change welcome message
- `JOIN_MESSAGE` - Change membership prompt

## 🚨 Troubleshooting

### Common Issues

**Bot doesn't respond**
- Check if bot token is valid
- Ensure bot is running (`node index.js`)
- Verify bot is added to the group/channel

**Membership check fails**
- Confirm bot is admin in sponsor channel
- Check channel username format (`@channelname`)
- Verify user has actually joined the channel

**AI responses fail**
- Verify Gemini API key is valid
- Check API rate limits
- Ensure network connectivity
- Monitor for content blocking

### Error Messages

| Error | Solution |
|-------|----------|
| `BOT_TOKEN environment variable is required` | Add token to .env file |
| `GEMINI_API_KEY environment variable is required` | Add API key to .env file |
| `Failed to check channel membership` | Check bot permissions in channel |
| `Unexpected Telegram error` | Check console for detailed error |

## 🔒 Security Considerations

- **Environment Variables**: All sensitive data stored in `.env` file
- **No Data Persistence**: Conversation history kept in-memory only
- **API Key Protection**: Never commit `.env` file to version control
- **Error Handling**: Sensitive info not exposed in error messages

## 📈 Performance Optimization

The bot implements several optimizations:
- **In-memory caching** for fast context retrieval
- **Queue system** to handle concurrent requests
- **Context limiting** to prevent memory issues
- **Efficient API calls** with proper error recovery

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [grammy](https://grammy.dev/) for the excellent Telegram Bot framework
- [Google Generative AI](https://ai.google.dev/) for the powerful AI models
- The Telegram community for inspiration and support