<h1 align="center">Z AI Telegram Bot 🤖✨</h1>

<p align="center">
  <strong>A sophisticated Telegram bot powered by Google's Gemini AI</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-16%2B-brightgreen" alt="Node.js Version">
  <img src="https://img.shields.io/badge/Platform-Telegram-blue" alt="Platform">
  <img src="https://img.shields.io/badge/AI-Gemini-orange" alt="AI Model">
  <img src="https://img.shields.io/badge/License-MIT-yellow" alt="License">
</p>

<hr>

<h2>📋 Table of Contents</h2>
<ul>
  <li><a href="#features">Features</a></li>
  <li><a href="#prerequisites">Prerequisites</a></li>
  <li><a href="#installation">Installation</a></li>
  <li><a href="#usage">Usage</a></li>
  <li><a href="#how-it-works">How It Works</a></li>
  <li><a href="#architecture">Architecture</a></li>
  <li><a href="#configuration">Configuration</a></li>
  <li><a href="#troubleshooting">Troubleshooting</a></li>
  <li><a href="#contributing">Contributing</a></li>
  <li><a href="#license">License</a></li>
</ul>

<hr>

<h2 id="features">✨ Features</h2>

<table>
  <tr>
    <th>Feature</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>🤖 <strong>Multi-Model Support</strong></td>
    <td>Switch between Gemini 3.5 Flash Lite and Gemini 3.7 Flash</td>
  </tr>
  <tr>
    <td>💬 <strong>Group & Private Chat</strong></td>
    <td>Responds in private chats or when mentioned/replied to in groups</td>
  </tr>
  <tr>
    <td>🔐 <strong>Sponsor Verification</strong></td>
    <td>Requires users to join a sponsor channel before use</td>
  </tr>
  <tr>
    <td>🧠 <strong>Smart Context Management</strong></td>
    <td>Maintains conversation history with automatic reset when context limits are reached</td>
  </tr>
  <tr>
    <td>🔄 <strong>Automatic Fallback</strong></td>
    <td>Falls back to a lighter model during high-demand or rate-limited periods</td>
  </tr>
  <tr>
    <td>🌍 <strong>Multi-Language</strong></td>
    <td>Responds in the user's language automatically</td>
  </tr>
  <tr>
    <td>⚡ <strong>Queue System</strong></td>
    <td>Prevents race conditions in concurrent message handling</td>
  </tr>
  <tr>
    <td>🛡️ <strong>Robust Error Handling</strong></td>
    <td>Gracefully handles Telegram API errors and rate limits</td>
  </tr>
</table>

<hr>

<h2 id="prerequisites">🔧 Prerequisites</h2>

<ul>
  <li><strong>Node.js</strong> 16 or higher</li>
  <li><strong>Telegram Bot Token</strong> - <a href="https://t.me/botfather">Get from @BotFather</a></li>
  <li><strong>Google Gemini API Key</strong> - <a href="https://makersuite.google.com/app/apikey">Get from Google AI Studio</a></li>
  <li><strong>Sponsor Telegram Channel</strong> with the bot added as admin</li>
</ul>

<hr>

<h2 id="installation">🚀 Installation</h2>

<h3>1. Clone the Repository</h3>
<pre><code>git clone https://github.com/yourusername/z-ai-telegram-bot.git
cd z-ai-telegram-bot</code></pre>

<h3>2. Install Dependencies</h3>
<pre><code>npm install</code></pre>

<h3>3. Configure Environment Variables</h3>
<p>Create a <code>.env</code> file in the root directory:</p>
<pre><code>BOT_TOKEN=your_telegram_bot_token_here
GEMINI_API_KEY=your_gemini_api_key_here
SPONSOR_CHANNEL=@your_sponsor_channel_username
SPONSOR_CHANNEL_LINK=https://t.me/your_sponsor_channel_username</code></pre>

<h3>4. Run the Bot</h3>
<pre><code>npm start</code></pre>

<hr>

<h2 id="usage">🎯 Usage</h2>

<h3>Private Chat</h3>
<ol>
  <li>Start the bot with <code>/start</code></li>
  <li>Join the sponsor channel if prompted</li>
  <li>Choose your preferred AI model</li>
  <li>Start chatting naturally!</li>
</ol>

<h3>Group Chat</h3>
<ul>
  <li><strong>Mention the bot:</strong> <code>@YourBotName What do you think about AI?</code></li>
  <li><strong>Reply to the bot:</strong> Reply directly to any bot message</li>
</ul>

<h3>Available Commands</h3>
<table>
  <tr>
    <th>Command</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>/start</code></td>
    <td>Initialize the bot and check membership</td>
  </tr>
</table>

<h3>Model Selection</h3>
<table>
  <tr>
    <th>Model</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>⚡ <strong>Gemini 3.5 Flash Lite</strong></td>
    <td>Faster, more efficient responses</td>
  </tr>
  <tr>
    <td>🚀 <strong>Gemini 3.7 Flash</strong></td>
    <td>More powerful, detailed responses</td>
  </tr>
</table>

<hr>

<h2 id="how-it-works">🧠 How It Works</h2>

<h3>Conversation Flow</h3>
<ol>
  <li><strong>User Interaction:</strong> Bot receives a text message</li>
  <li><strong>Context Check:</strong> Determines if it should respond</li>
  <li><strong>Membership Verification:</strong> Ensures user has joined the sponsor channel</li>
  <li><strong>Context Management:</strong> Retrieves or initializes conversation history</li>
  <li><strong>AI Processing:</strong> Sends to appropriate Gemini model with full context</li>
  <li><strong>Response Delivery:</strong> Returns AI response with proper formatting</li>
</ol>

<h3>Context Management</h3>
<ul>
  <li>Stores up to <strong>20,000 characters</strong> of context</li>
  <li>Automatically resets when limit is reached</li>
  <li>Sanitizes history before sending to Gemini</li>
  <li>Preserves conversation flow across messages</li>
</ul>

<h3>Error Handling</h3>
<ul>
  <li>Rate limiting (429 errors)</li>
  <li>Service overload (503 errors)</li>
  <li>Content blocking</li>
  <li>Telegram API errors</li>
  <li>Invalid callback queries</li>
  <li>Network issues</li>
</ul>

<h3>Fallback System</h3>
<p>If the primary model fails due to high demand, rate limits, service overload, or empty responses, the bot automatically falls back to Gemini 3.5 Flash Lite to ensure users always get a response.</p>

<hr>

<h2 id="architecture">🏗️ Architecture</h2>

<h3>Core Components</h3>
<pre><code>┌─────────────────┐
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
    └──────────┘</code></pre>

<h3>Key Functions</h3>
<table>
  <tr>
    <th>Function</th>
    <th>Description</th>
  </tr>
  <tr>
    <td><code>getChatState()</code></td>
    <td>Manages conversation history per chat</td>
  </tr>
  <tr>
    <td><code>pushTurn()</code></td>
    <td>Adds messages to conversation history</td>
  </tr>
  <tr>
    <td><code>sanitizeHistory()</code></td>
    <td>Cleans history before sending to API</td>
  </tr>
  <tr>
    <td><code>enqueue()</code></td>
    <td>Prevents race conditions in message handling</td>
  </tr>
  <tr>
    <td><code>shouldRespondInChat()</code></td>
    <td>Determines bot response eligibility</td>
  </tr>
  <tr>
    <td><code>generateWithModel()</code></td>
    <td>Core AI response generation</td>
  </tr>
  <tr>
    <td><code>isMember()</code></td>
    <td>Verifies sponsor channel membership</td>
  </tr>
</table>

<hr>

<h2>🎭 The "Z" Persona</h2>

<p>The bot is configured with a unique personality:</p>
<ul>
  <li><strong>Warm & Clever:</strong> Speaks like a close friend, not a manual</li>
  <li><strong>Curious:</strong> Asks thoughtful questions that show genuine interest</li>
  <li><strong>Playful:</strong> Mirrors the user's energy and adds wit</li>
  <li><strong>Real:</strong> Admits limitations and builds trust through honesty</li>
  <li><strong>Engaging:</strong> Leaves hooks to keep conversations going</li>
</ul>

<hr>

<h2 id="configuration">🔧 Configuration</h2>

<h3>Environment Variables</h3>
<table>
  <tr>
    <th>Variable</th>
    <th>Description</th>
    <th>Required</th>
  </tr>
  <tr>
    <td><code>BOT_TOKEN</code></td>
    <td>Telegram Bot API token</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><code>GEMINI_API_KEY</code></td>
    <td>Google Gemini API key</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><code>SPONSOR_CHANNEL</code></td>
    <td>Sponsor channel username</td>
    <td>✅</td>
  </tr>
  <tr>
    <td><code>SPONSOR_CHANNEL_LINK</code></td>
    <td>Sponsor channel invite link</td>
    <td>✅</td>
  </tr>
</table>

<h3>Modifiable Settings</h3>
<ul>
  <li><code>MODELS</code> - Add or remove available AI models</li>
  <li><code>MAX_CONTEXT_CHARS</code> - Adjust context window size</li>
  <li><code>SYSTEM_INSTRUCTION</code> - Modify the AI personality</li>
  <li><code>START_MESSAGE</code> - Change welcome message</li>
  <li><code>JOIN_MESSAGE</code> - Change membership prompt</li>
</ul>

<hr>

<h2 id="troubleshooting">🚨 Troubleshooting</h2>

<h3>Common Issues</h3>

<details>
  <summary><strong>Bot doesn't respond</strong></summary>
  <ul>
    <li>Check if bot token is valid</li>
    <li>Ensure bot is running (<code>node index.js</code>)</li>
    <li>Verify bot is added to the group/channel</li>
  </ul>
</details>

<details>
  <summary><strong>Membership check fails</strong></summary>
  <ul>
    <li>Confirm bot is admin in sponsor channel</li>
    <li>Check channel username format (<code>@channelname</code>)</li>
    <li>Verify user has actually joined the channel</li>
  </ul>
</details>

<details>
  <summary><strong>AI responses fail</strong></summary>
  <ul>
    <li>Verify Gemini API key is valid</li>
    <li>Check API rate limits</li>
    <li>Ensure network connectivity</li>
    <li>Monitor for content blocking</li>
  </ul>
</details>

<h3>Error Messages</h3>
<table>
  <tr>
    <th>Error</th>
    <th>Solution</th>
  </tr>
  <tr>
    <td><code>BOT_TOKEN environment variable is required</code></td>
    <td>Add token to .env file</td>
  </tr>
  <tr>
    <td><code>GEMINI_API_KEY environment variable is required</code></td>
    <td>Add API key to .env file</td>
  </tr>
  <tr>
    <td><code>Failed to check channel membership</code></td>
    <td>Check bot permissions in channel</td>
  </tr>
  <tr>
    <td><code>Unexpected Telegram error</code></td>
    <td>Check console for detailed error</td>
  </tr>
</table>

<hr>

<h2>🔒 Security Considerations</h2>
<ul>
  <li><strong>Environment Variables:</strong> All sensitive data stored in <code>.env</code> file</li>
  <li><strong>No Data Persistence:</strong> Conversation history kept in-memory only</li>
  <li><strong>API Key Protection:</strong> Never commit <code>.env</code> file to version control</li>
  <li><strong>Error Handling:</strong> Sensitive info not exposed in error messages</li>
</ul>

<hr>

<h2>📈 Performance Optimization</h2>
<ul>
  <li><strong>In-memory caching</strong> for fast context retrieval</li>
  <li><strong>Queue system</strong> to handle concurrent requests</li>
  <li><strong>Context limiting</strong> to prevent memory issues</li>
  <li><strong>Efficient API calls</strong> with proper error recovery</li>
</ul>

<hr>

<h2 id="contributing">🤝 Contributing</h2>
<ol>
  <li>Fork the repository</li>
  <li>Create a feature branch (<code>git checkout -b feature/AmazingFeature</code>)</li>
  <li>Commit your changes (<code>git commit -m 'Add some AmazingFeature'</code>)</li>
  <li>Push to the branch (<code>git push origin feature/AmazingFeature</code>)</li>
  <li>Open a Pull Request</li>
</ol>

<hr>

<h2 id="license">📝 License</h2>
<p>This project is licensed under the MIT License - see the <a href="LICENSE">LICENSE</a> file for details.</p>

<hr>

<h2>🙏 Acknowledgments</h2>
<ul>
  <li><a href="https://grammy.dev/">grammy</a> - Excellent Telegram Bot framework</li>
  <li><a href="https://ai.google.dev/">Google Generative AI</a> - Powerful AI models</li>
  <li>Telegram community - Inspiration and support</li>
</ul>

<hr>

<p align="center">
  <em>Note: This bot is designed for educational and personal use. Ensure compliance with Telegram's terms of service and Google's AI usage guidelines when deploying.</em>
</p>