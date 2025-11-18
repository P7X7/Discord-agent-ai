import { logEvent } from "./logger.js";

const tempVoice = new Map();

export function initRooms(client) {
  client.on("voiceStateUpdate", async (oldState, newState) => {
    try {
      // create temp channel when user joins "Create Room" channel name
      if (newState.channel && newState.channel.name === "Create Room" && !tempVoice.has(newState.member.id)) {
        const guild = newState.guild;
        const channel = await guild.channels.create({
          name: `${newState.member.user.username}'s room`,
          type: 2, // GUILD_VOICE
          userLimit: 6,
          permissionOverwrites: [
            { id: guild.roles.everyone.id, allow: ['ViewChannel', 'Connect'] }
          ]
        });
        tempVoice.set(newState.member.id, channel.id);
        // move member to channel
        newState.setChannel(channel);
        logEvent(`Created temp voice channel ${channel.name} for ${newState.member.user.tag}`);
      }

      // delete empty temp channels
      for (const [ownerId, channelId] of tempVoice.entries()) {
        const ch = newState.guild.channels.cache.get(channelId);
        if (ch && ch.members.size === 0) {
          try { await ch.delete(); } catch(e){ }
          tempVoice.delete(ownerId);
          logEvent(`Deleted empty temp channel ${channelId}`);
        }
      }
    } catch(e) { logEvent("rooms error "+e); }
  });
}
