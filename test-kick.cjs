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
  process.exit(0);
});

client.login(process.env.DISCORD_BOT_TOKEN).catch(e => {
  console.error("Login failed:", e);
  process.exit(1);
});
