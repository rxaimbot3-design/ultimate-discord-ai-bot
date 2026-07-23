const fs = require('fs');
let code = fs.readFileSync('discord-bot.ts', 'utf8');

// 1. We need a function to just trigger guild panic globally
const panicLogic = `
function trackGuildActionAndCheckPanic(guildId: string): boolean {
  const now = Date.now();
  let guildTimes = guildBurstActions.get(guildId) || [];
  guildTimes = guildTimes.filter(t => now - t < 3000);
  guildTimes.push(now);
  guildBurstActions.set(guildId, guildTimes);

  if (guildTimes.length >= 4) {
    if (!panicLockdownActive) {
      addBotLog(\`🚨 [EMERGENCY] 100-NUKER SIMULTANEOUS ATTACK DETECTED! Triggering Global Panic Lockdown!\`, "error");
      panicLockdownActive = true;
    }
    return true;
  }
  return panicLockdownActive;
}
`;

code = code.replace(/function checkNukerAttackThreshold[\s\S]*?return false;\n\}/, (match) => {
  return match + '\n' + panicLogic;
});

// Now we update channelCreate to use it
code = code.replace(/client\.on\("channelCreate", async \(channel\) => \{[\s\S]*?client\.on\("channelDelete",/m, `client.on("channelCreate", async (channel) => {
      if (!("guild" in channel) || !channel.guild) return;
      const guild = channel.guild;
      const startTime = Date.now();
      
      const isPanic = trackGuildActionAndCheckPanic(guild.id);
      if (isPanic) {
          // Instant Channel Auto-Deletion without waiting for audit log
          await channel.delete("Zero Trust 100/100 Instant Anti-Nuke Channel Creation Revert (PANIC MODE)").catch(() => {});
      }

      try {
        const entry = await fetchAuditLogWithRetry(guild, AuditLogEvent.ChannelCreate, channel.id, 2, 500); // lower retries for performance
        const executor = entry?.executor;

        if (executor && !isOwnerOrWhitelisted(executor.id, guild)) {
          const responseLatency = Date.now() - startTime;
          addBotLog(\`🚨 [17MS ULTRA-FAST ZERO TRUST] Unauthorized channel creation of #\${channel.name} by Admin/Staff \${executor.tag}! (\${responseLatency}ms)\`, "error");
          checkNukerAttackThreshold(executor.id, guild.id, "ChannelCreate");

          // Strip ALL roles from Rogue Admin / Staff instantly
          const member = await guild.members.fetch(executor.id).catch(() => null);
          if (member && member.id !== guild.ownerId) {
            await member.roles.set([], "Zero-Trust Strict Policy: Rogue Admin Channel Creation Attempt").catch(() => {});
          }

          // Delete if not already deleted by panic
          if (!isPanic) {
              await channel.delete("Zero Trust 100/100 Instant Anti-Nuke Channel Creation Revert").catch(() => {});
          }

          await sendLiveAuditAlert(guild, {
            title: "🚨 UNAUTHORIZED CHANNEL CREATION REVERTED (<17MS)",
            description: \`**Channel:** #\${channel.name}\\n**Rogue Admin:** <@\${executor.id}> (\${executor.tag})\\n**Action Taken:** Instant Channel Deletion & Stripped Admin Roles\`,
            color: 0xDC2626
          });
        }
      } catch (err: any) {
        // ignore
      }
    });

    client.on("channelDelete",`);

fs.writeFileSync('discord-bot.ts', code);
