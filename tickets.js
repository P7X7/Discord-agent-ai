import { logEvent } from "./logger.js";
import config from "../config.json" assert { type: "json" };

const openTickets = new Map();

export function initTickets(client) {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;
    const t = message.content.toLowerCase();

    if (t.startsWith("!new") || t.includes("تذكرة")) {
      const guild = message.guild;
      let category = guild.channels.cache.find(c => c.name === config.ticket_category_name && c.type === 4);
      if (!category) {
        category = await guild.channels.create({
          name: config.ticket_category_name,
          type: 4
        });
      }
      const channel = await guild.channels.create({
        name: `ticket-${message.author.username}`,
        type: 0,
        parent: category.id,
        permissionOverwrites: [
          { id: guild.roles.everyone.id, deny: ['ViewChannel'] },
          // support role will be allowed below if exists
        ]
      });
      // allow support role
      const role = guild.roles.cache.find(r => r.name === config.ticket_role);
      if (role) channel.permissionOverwrites.edit(role.id, { ViewChannel: true, SendMessages: true });
      channel.permissionOverwrites.edit(message.author.id, { ViewChannel: true, SendMessages: true });
      channel.send(`مرحباً ${message.author}, افتتحت تذكرتك هنا. اكتب مشكلتك وسيقوم الدعم بالمساعدة.`);
      openTickets.set(channel.id, { user: message.author.id, channel: channel.id });
      logEvent(`Ticket opened: ${channel.name} by ${message.author.tag}`);
    }

    if (t.startsWith("!close") || t.includes("غلق التذكرة")) {
      // allow closing in ticket channel
      const info = openTickets.get(message.channel.id);
      if (!info) return message.reply("هذي مو قناة تذكرة.");
      message.channel.send("يتم الآن غلق التذكرة...").then(()=> {
        try {
          message.channel.delete();
          openTickets.delete(message.channel.id);
          logEvent(`Ticket closed in ${message.channel.name}`);
        } catch(e) { logEvent("Close ticket error "+e); }
      });
    }
  });
}

export function getOpenTickets() {
  return Array.from(openTickets.values());
}
