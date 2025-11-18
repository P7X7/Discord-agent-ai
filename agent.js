import OpenAI from "openai";
import config from "../config.json" assert { type: "json" };
import { logEvent } from "../modules/logger.js";

const client = new OpenAI({ apiKey: config.openai_key });
let memory = [];

function pruneMemory() {
  while (memory.length > config.memory_limit) memory.shift();
}

export async function runAgent(botClient, msg) {
  try {
    if (msg.author.bot) return;

    memory.push({ user: msg.author.username, content: msg.content });
    pruneMemory();

    // quick commands: support tools triggers handled elsewhere
    // create strong system prompt and context
    const systemPrompt = `
You are the AI Server Manager for a Discord server. You must:
- Be concise and polite in Arabic (Gulf dialect) unless asked otherwise.
- Manage moderation, tickets, roles, and provide admin suggestions.
- Keep answers short when asked for quick help, and expand when asked.
`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...memory.slice(-20).map(m => ({ role: "user", content: `${m.user}: ${m.content}` })),
      { role: "user", content: `User ${msg.author.username} asked: ${msg.content}` }
    ];

    const res = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages
    });

    const reply = res.choices?.[0]?.message?.content || "آسف، ما قدرت أجاوب الحين.";
    await msg.reply(reply);
    logEvent(`AI replied to ${msg.author.tag}`);
  } catch (e) {
    logEvent("agent error: " + e);
    try { msg.reply("صار خطأ داخلي بالـ AI، تواصل مع المدير."); } catch {}
  }
}
