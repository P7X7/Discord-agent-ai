import { logEvent } from "./logger.js";
import config from "../config.json" assert { type: "json" };

const badWords = ["قحبه","خنيث","لعن","كس","fuck","shit","dick"];
const warnings = new Map();

export function initModeration(client) {
  client.on("messageCreate", (message) => {
    if (message.author.bot) return;
    const t = message.content.toLowerCase();

    // Spam (long repeated messages)
    if (t.length > 400) {
      safeDelete(message, "spam - too long");
      return;
    }

    // Bad words
    for (const w of badWords) {
      if (t.includes(w)) {
        safeDelete(message, "bad language");
        addWarn(message.author.id, message);
        return;
      }
    }

    // Links limit for non-admins
    if ((t.includes("http://") || t.includes("https://")) && !message.member.permissions.has("MANAGE_GUILD")) {
      safeDelete(message, "unallowed link");
      addWarn(message.author.id, message);
      return;
    }
  });
}

function safeDelete(message, reason) {
  try {
    message.delete().catch(()=>{});
    message.channel.send(`${message.author}, تم حذف الرسالة (${reason}).`).then(m=>setTimeout(()=>m.delete().catch(()=>{}),8000));
    logEvent(`Deleted message from ${message.author.tag}: ${reason}`);
  } catch(e) { logEvent("safeDelete error "+e); }
}

function addWarn(userId, message) {
  const count = (warnings.get(userId) || 0) + 1;
  warnings.set(userId, count);
  logEvent(`User ${message.author.tag} warned (${count})`);
  if (count === 3) {
    // timeout 1 minute (if supported) else send message
    messageTimeout(message, 60);
  }
  if (count >= 5) {
    banUser(message);
  }
}

function messageTimeout(message, seconds) {
  try {
    if (message.member.timeout) {
      message.member.timeout(seconds * 1000, "Auto timeout");
      message.channel.send(`${message.author}, تم إعطائك ميوت مؤقت.`);
    }
  } catch(e) {
    logEvent("Timeout failed: " + e);
  }
}

function banUser(message) {
  try {
    message.member.ban({ reason: "Auto ban by moderation system" });
    logEvent(`Banned ${message.author.tag}`);
  } catch(e) { logEvent("Ban failed: "+e); }
}

export function getWarnings() {
  // returns simple object for dashboard read
  const out = {};
  for (const [k,v] of warnings.entries()) out[k] = v;
  return out;
}
