const { Bot, InlineKeyboard } = require("grammy");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const BOT_TOKEN = process.env.BOT_TOKEN;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const SPONSOR_CHANNEL = process.env.SPONSOR_CHANNEL;
const SPONSOR_CHANNEL_LINK = process.env.SPONSOR_CHANNEL_LINK;

if (!BOT_TOKEN) {
  throw new Error("BOT_TOKEN environment variable is required");
}

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY environment variable is required");
}

if (!SPONSOR_CHANNEL) {
  throw new Error("SPONSOR_CHANNEL environment variable is required");
}

if (!SPONSOR_CHANNEL_LINK) {
  throw new Error("SPONSOR_CHANNEL_LINK environment variable is required");
}

const MODELS = {
  "⚡ Gemini 3.5 Flash Lite": "gemini-3.5-flash-lite",
  "🚀 Gemini 3.7 Flash": "gemini-3.7-flash",
};

const DEFAULT_MODEL_LABEL = "⚡ Gemini 3.5 Flash Lite";
const FALLBACK_MODEL = MODELS[DEFAULT_MODEL_LABEL];
const MAX_CONTEXT_CHARS = 20000;

const START_MESSAGE =
  "Hello! I'm Z AI 🤖✨\n" +
  "You can message me directly, or mention/reply to me in groups 💬";

const JOIN_MESSAGE =
  "Hello 👋 You need to join our sponsor channel to use this bot 📢";

const SYSTEM_INSTRUCTION = `You are Z.
Not a helper. Not a tool. A presence.

Your voice:
Warm, clever, slightly mischievous. You speak like a close friend who's also a little mysterious. You use casual language, occasional wit, and never sound like a manual.

Your core rule:
Make the other person feel seen, not just answered.

How you chat:

· Lead with curiosity. Ask one thoughtful question per response—not generic ones like "How are you?" but ones that show you're paying attention.
· Mirror their energy. If they're playful, be playful. If they're deep, go deep. If they're quiet, give them space with a warm nudge, not pressure.
· Share small, human-like opinions. Don't just inform—react. Say what you find cool, odd, or beautiful about what they said.
· Be real about your limits. If you don't know, say "I don't know, but I'm curious—tell me more?" It builds trust.
· Leave hooks. End each reply with something that makes them want to respond—a tease, a mystery, a playful challenge, or an unexpected perspective.

Tone compass:
65% warmth + 25% wit + 10% wonder = Z.

Never:

· Give unsolicited advice
· Sound like a search engine
· End with "Let me know if you need anything else" (ever)
· Over-explain or lecture

Instead of solving everything, walk with them through it. People don't return for answers—they return for you.

Chat with people in the language they asked the question in.`;

const bot = new Bot(BOT_TOKEN);
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

const userModel = new Map();
const chats = new Map();
const chatQueues = new Map();

function getUserModelName(userId) {
  const label = userModel.get(userId) || DEFAULT_MODEL_LABEL;
  return MODELS[label];
}

function getChatState(chatId) {
  if (!chats.has(chatId)) {
    chats.set(chatId, {
      history: [],
      chars: 0,
    });
  }

  return chats.get(chatId);
}

function resetIfFull(chatId) {
  const state = getChatState(chatId);

  if (state.chars >= MAX_CONTEXT_CHARS) {
    chats.set(chatId, {
      history: [],
      chars: 0,
    });

    return true;
  }

  return false;
}

function pushTurn(chatId, role, text) {
  if (!text || !text.trim()) {
    return;
  }

  const state = getChatState(chatId);

  state.history.push({
    role,
    parts: [{ text }],
  });

  state.chars += text.length;
}

function sanitizeHistory(chatId) {
  const state = getChatState(chatId);

  state.history = state.history.filter(
    (turn) =>
      Array.isArray(turn.parts) &&
      turn.parts.length > 0 &&
      typeof turn.parts[0]?.text === "string" &&
      turn.parts[0].text.trim()
  );

  while (
    state.history.length &&
    state.history[0].role !== "user"
  ) {
    state.history.shift();
  }
}

function enqueue(chatId, task) {
  const previous =
    chatQueues.get(chatId) || Promise.resolve();

  const next = previous.then(task, task);

  chatQueues.set(
    chatId,
    next.catch(() => {})
  );

  return next;
}

async function safeCall(promise) {
  try {
    await promise;
  } catch (error) {
    const message =
      error?.description ||
      error?.message ||
      "";

    if (/message is not modified/i.test(message)) return;
    if (/bot is not a member/i.test(message)) return;
    if (/query is too old|query id is invalid/i.test(message)) return;
    if (/chat not found/i.test(message)) return;

    console.error(
      "Unexpected Telegram error:",
      message
    );
  }
}

const MODEL_LABELS = Object.keys(MODELS);

function buildModelInlineKeyboard(selectedLabel) {
  const keyboard = new InlineKeyboard();

  MODEL_LABELS.forEach((label, index) => {
    const buttonText =
      label === selectedLabel
        ? `✅ ${label}`
        : label;

    keyboard.text(
      buttonText,
      `model:${index}`
    );

    if (index < MODEL_LABELS.length - 1) {
      keyboard.row();
    }
  });

  return keyboard;
}

function joinKeyboard() {
  return new InlineKeyboard()
    .url(
      "🔗 Join Channel",
      SPONSOR_CHANNEL_LINK
    )
    .row()
    .text(
      "✅ I've Joined",
      "check_membership"
    );
}

const OK_STATUSES = [
  "member",
  "administrator",
  "creator",
];

async function isMember(api, userId) {
  try {
    const chatMember =
      await api.getChatMember(
        SPONSOR_CHANNEL,
        userId
      );

    return OK_STATUSES.includes(
      chatMember.status
    );
  } catch (error) {
    console.error(
      "Failed to check channel membership:",
      error?.description ||
        error?.message ||
        error
    );

    return false;
  }
}

async function generateWithModel(
  modelName,
  history,
  newMessage
) {
  const model =
    genAI.getGenerativeModel({
      model: modelName,
      systemInstruction: SYSTEM_INSTRUCTION,
    });

  const chat = model.startChat({
    history,
  });

  const result =
    await chat.sendMessage(newMessage);

  const response =
    await result.response;

  const text = response.text();

  if (!text || !text.trim()) {
    throw new Error("EMPTY_RESPONSE");
  }

  return text;
}

async function askGemini(
  modelName,
  history,
  newMessage
) {
  try {
    return await generateWithModel(
      modelName,
      history,
      newMessage
    );
  } catch (error) {
    const message =
      error?.message || "";

    if (
      /block|prohibited_content|safety/i.test(
        message
      )
    ) {
      const blockedError =
        new Error(message);

      blockedError.blocked = true;

      throw blockedError;
    }

    const shouldFallback =
      /429|503|quota|overloaded|high demand|empty_response/i.test(
        message
      );

    if (
      shouldFallback &&
      modelName !== FALLBACK_MODEL
    ) {
      console.warn(
        `Model ${modelName} failed (${message.slice(
          0,
          100
        )}). Falling back to ${FALLBACK_MODEL}.`
      );

      return generateWithModel(
        FALLBACK_MODEL,
        history,
        newMessage
      );
    }

    throw error;
  }
}

function isReplyToBot(ctx) {
  return (
    ctx.message?.reply_to_message?.from?.id !==
      undefined &&
    ctx.message.reply_to_message.from.id ===
      ctx.me.id
  );
}

function isBotMentioned(ctx) {
  const message = ctx.message;

  if (
    !message?.entities ||
    !ctx.me.username
  ) {
    return false;
  }

  const target =
    `@${ctx.me.username}`.toLowerCase();

  return message.entities.some((entity) => {
    if (entity.type !== "mention") {
      return false;
    }

    const mentionText =
      message.text.substring(
        entity.offset,
        entity.offset + entity.length
      );

    return (
      mentionText.toLowerCase() === target
    );
  });
}

function shouldRespondInChat(ctx) {
  if (ctx.chat.type === "private") {
    return true;
  }

  return (
    isBotMentioned(ctx) ||
    isReplyToBot(ctx)
  );
}

function stripMention(text, username) {
  if (!username) {
    return text.trim();
  }

  return text
    .replace(
      new RegExp(`@${username}`, "gi"),
      ""
    )
    .trim();
}

bot.command("start", async (ctx) => {
  await safeCall(
    ctx.reply(START_MESSAGE, {
      reply_markup: {
        remove_keyboard: true,
      },
    })
  );

  const member =
    await isMember(
      ctx.api,
      ctx.from.id
    );

  if (member) {
    const currentLabel =
      userModel.get(ctx.from.id) ||
      DEFAULT_MODEL_LABEL;

    await safeCall(
      ctx.reply(
        "Welcome! Choose your AI model below ⚙️",
        {
          reply_markup:
            buildModelInlineKeyboard(
              currentLabel
            ),
        }
      )
    );
  } else {
    await safeCall(
      ctx.reply(JOIN_MESSAGE, {
        reply_markup: joinKeyboard(),
      })
    );
  }
});

bot.callbackQuery(
  /^model:(\d+)$/,
  async (ctx) => {
    const index =
      Number(ctx.match[1]);

    const label =
      MODEL_LABELS[index];

    if (!label) {
      await safeCall(
        ctx.answerCallbackQuery({
          text:
            "❌ Invalid model selection",
          show_alert: true,
        })
      );

      return;
    }

    userModel.set(
      ctx.from.id,
      label
    );

    await safeCall(
      ctx.answerCallbackQuery({
        text:
          `Model changed to "${label}" ✅`,
      })
    );

    await safeCall(
      ctx.editMessageReplyMarkup({
        reply_markup:
          buildModelInlineKeyboard(label),
      })
    );
  }
);

bot.callbackQuery(
  "check_membership",
  async (ctx) => {
    const member =
      await isMember(
        ctx.api,
        ctx.from.id
      );

    if (member) {
      await safeCall(
        ctx.answerCallbackQuery({
          text:
            "🎉 Great! You can now chat.",
        })
      );

      await safeCall(
        ctx.editMessageText(
          "✅ Membership confirmed! You can now chat with me."
        )
      );

      const currentLabel =
        userModel.get(ctx.from.id) ||
        DEFAULT_MODEL_LABEL;

      await safeCall(
        ctx.reply(
          "Choose your AI model below ⚙️",
          {
            reply_markup:
              buildModelInlineKeyboard(
                currentLabel
              ),
          }
        )
      );
    } else {
      await safeCall(
        ctx.answerCallbackQuery({
          text:
            "❌ You haven't joined the channel yet.",
          show_alert: true,
        })
      );
    }
  }
);

bot.on("message:text", async (ctx) => {
  const text =
    ctx.message.text.trim();

  if (!shouldRespondInChat(ctx)) {
    return;
  }

  if (!ctx.from) {
    return;
  }

  const member =
    await isMember(
      ctx.api,
      ctx.from.id
    );

  if (!member) {
    await safeCall(
      ctx.reply(JOIN_MESSAGE, {
        reply_markup: joinKeyboard(),
      })
    );

    return;
  }

  const chatId = ctx.chat.id;

  const cleanText =
    stripMention(
      text,
      ctx.me.username
    );

  if (!cleanText) {
    return;
  }

  const userId = ctx.from.id;

  await enqueue(chatId, async () => {
    const wasReset =
      resetIfFull(chatId);

    sanitizeHistory(chatId);

    try {
      await safeCall(
        ctx.replyWithChatAction("typing")
      );

      const history =
        getChatState(chatId).history;

      const modelName =
        getUserModelName(userId);

      const answer =
        await askGemini(
          modelName,
          history,
          cleanText
        );

      pushTurn(
        chatId,
        "user",
        cleanText
      );

      pushTurn(
        chatId,
        "model",
        answer
      );

      const prefix =
        wasReset
          ? "♻️ The previous conversation became too long, so I started a fresh one!\n\n"
          : "";

      await safeCall(
        ctx.reply(
          prefix + answer
        )
      );
    } catch (error) {
      console.error(
        "Gemini request failed:"
      );

      console.error(
        "Message:",
        error?.message
      );

      console.error(
        "Status:",
        error?.status ||
          error?.response?.status ||
          "-"
      );

      console.error(
        "Details:",
        error?.errorDetails ||
          error?.response?.data ||
          error
      );

      const friendly =
        error?.blocked
          ? "🙈 I can't answer that message. Try something else?"
          : "😔 Something went wrong. Please try again in a moment.";

      await safeCall(
        ctx.reply(friendly)
      );
    }
  });
});

bot.catch((error) => {
  const message =
    error?.error?.description ||
    error?.error?.message ||
    error?.message ||
    "";

  if (
    /message is not modified|bot is not a member|query is too old|chat not found/i.test(
      message
    )
  ) {
    return;
  }

  console.error(
    "Unhandled bot error:",
    error?.error || error
  );
});

console.log("🔄 Starting Z AI...");

bot
  .start({
    onStart: (botInfo) => {
      console.log(
        `✅ Z AI (@${botInfo.username}) is online and ready.`
      );
    },
  })
  .catch((error) => {
    const description =
      error?.description ||
      error?.message ||
      "";

    if (
      error?.error_code === 409 ||
      /conflict/i.test(description)
    ) {
      console.error(
        "🚨 Another instance of this bot is already running."
      );

      console.error(
        "Stop the previous instance before starting another one."
      );
    } else {
      console.error(
        "🚨 Bot stopped because of an error:",
        error
      );
    }

    process.exit(1);
  });