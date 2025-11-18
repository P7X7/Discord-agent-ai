export const tools = [
  {
    name: "create_ticket",
    triggers: ["تذكرة","!new","/ticket"],
    run: async (client, msg) => {
      // delegate to tickets module by sending '!new' or letting ticket module catch it
      await msg.channel.send("جاري فتح تذكرتك...").catch(()=>{});
      // ticket module will handle creation based on message content
    }
  },
  {
    name: "give_role",
    triggers: ["اعطني رتبة","!role","!giverole"],
    run: async (client, msg) => {
      const role = msg.guild.roles.cache.find(r => r.name === "Member");
      if (!role) return msg.reply("ما فيه رتبة Member");
      try {
        await msg.member.roles.add(role);
        msg.reply("تم إعطاءك رتبة Member");
      } catch(e) { msg.reply("ما قدرت أعطيك الرتبة."); }
    }
  },
  {
    name: "announce",
    triggers: ["أعلن","announce","!announce"],
    run: async (client, msg) => {
      const text = msg.content.replace(/أعلن|announce|!announce/gi, "").trim();
      if (!text) return msg.reply("اكتب نص الإعلان بعد الأمر.");
      if (msg.guild.systemChannel) msg.guild.systemChannel.send(`📢 إعلان:\n${text}`);
    }
  }
];
