import { Client, GatewayIntentBits, Partials, Collection } from "discord.js";
import config from "./config.json" assert { type: "json" };
import { runAgent } from "./ai/agent.js";
import { startDashboard } from "./dashboard/server.js";
import { initModeration } from "./modules/moderation.js";
import { initTickets } from "./modules/tickets.js";
import { initRooms } from "./modules/rooms.js";
import { initSlash } from "./modules/slash.js";
import { logEvent } from "./modules/logger.js";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [Partials.Channel]
});

client.commands = new Collection();
client.botLogs = [];

client.once("ready", async () => {
  console.log(`Logged in as ${client.user.tag}`);
  logEvent("Bot started");
  startDashboard(client);
  initModeration(client);
  initTickets(client);
  initRooms(client);
  await initSlash(client);
});

client.on("guildMemberAdd", async (member) => {
  const ch = member.guild.channels.cache.get(config.welcome_channel);
  if (ch) ch.send(`حياك الله ${member}! 🌟`);
});

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  // moderation
  // tickets and tools inside modules will handle triggers
  runAgent(client, message);
});

process.on('unhandledRejection', error => {
  console.error('Unhandled promise rejection:', error);
  logEvent(`UnhandledRejection: ${String(error)}`);
});

client.login(config.token);
