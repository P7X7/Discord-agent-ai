import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import config from "../config.json" assert { type: "json" };
import { logEvent } from "./logger.js";

const commands = [
  {
    name: "ticket",
    description: "Open a support ticket"
  },
  {
    name: "close",
    description: "Close current ticket"
  },
  {
    name: "announce",
    description: "Make an announcement",
    options: [{ name: "text", type: 3, required: true, description: "Announcement text" }]
  },
  {
    name: "logs",
    description: "Get recent logs"
  }
];

export async function initSlash(client) {
  try {
    const rest = new REST({ version: "10" }).setToken(config.token);
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    logEvent("Slash commands registered.");
    client.on("interactionCreate", async (interaction) => {
      if (!interaction.isCommand()) return;
      const { commandName } = interaction;
      if (commandName === "ticket") {
        await interaction.reply("To open a ticket type: !new or send 'تذكرة'");
      } else if (commandName === "close") {
        await interaction.reply("To close a ticket, inside ticket channel type: !close");
      } else if (commandName === "announce") {
        const text = interaction.options.getString("text");
        const guild = interaction.guild;
        if (guild.systemChannel) guild.systemChannel.send(`📢 ${text}`);
        await interaction.reply({ content: "Announcement sent.", ephemeral: true });
      } else if (commandName === "logs") {
        await interaction.reply({ content: (global.botLogs||[]).slice(-20).join("\n") || "No logs", ephemeral: true });
      }
    });
  } catch (e) {
    logEvent("Slash init error: " + e);
  }
}
