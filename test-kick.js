const { Client, GatewayIntentBits, AuditLogEvent } = require('discord.js');
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildModeration
  ]
});

client.on('ready', () => {
  console.log('Bot is ready as', client.user.tag);
});

client.on('guildMemberRemove', async (member) => {
  console.log('Member removed:', member.user.tag);
});

client.login(process.env.DISCORD_BOT_TOKEN).catch(console.error);
