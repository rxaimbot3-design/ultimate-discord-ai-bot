const fs = require('fs');
let code = fs.readFileSync('discord-bot.ts', 'utf8');

code = code.replace(/client\.on\("channelDelete", async \(channel\) => \{[\s\S]*?client\.on\("roleCreate",/m, `client.on("channelDelete", async (channel) => {
      if (!("guild" in channel) || !channel.guild) return;
      const guild = channel.guild;
      const startTime = Date.now();

      const isPanic = trackGuildActionAndCheckPanic(guild.id);
      if (isPanic) {
          // Re-create the channel instantly
          const clonedChannel = await guild.channels.create({
            name: channel.name,
            type: channel.type,
            permissionOverwrites: channel.permissionOverwrites?.cache || [],
            parent: channel.parentId,
            reason: "Zero Trust 100/100 Instant Anti-Nuke Channel Deletion Revert (PANIC MODE)"
          }).catch(() => {});
      }

      try {
        const entry = await fetchAuditLogWithRetry(guild, AuditLogEvent.ChannelDelete, channel.id, 2, 500);
        const executor = entry?.executor;

        if (executor && !isOwnerOrWhitelisted(executor.id, guild)) {
          const responseLatency = Date.now() - startTime;
          addBotLog(\`🚨 [17MS ULTRA-FAST ZERO TRUST] Unauthorized channel deletion of #\${channel.name} by Admin/Staff \${executor.tag}! (\${responseLatency}ms)\`, "error");
          checkNukerAttackThreshold(executor.id, guild.id, "ChannelDelete");

          const member = await guild.members.fetch(executor.id).catch(() => null);
          if (member && member.id !== guild.ownerId) {
            await member.roles.set([], "Zero-Trust Strict Policy: Rogue Admin Channel Deletion Attempt").catch(() => {});
          }

          if (!isPanic) {
              await guild.channels.create({
                name: channel.name,
                type: channel.type,
                permissionOverwrites: channel.permissionOverwrites?.cache || [],
                parent: channel.parentId,
                reason: "Zero Trust 100/100 Instant Anti-Nuke Channel Deletion Revert"
              }).catch(() => {});
          }

          await sendLiveAuditAlert(guild, {
            title: "🚨 UNAUTHORIZED CHANNEL DELETION REVERTED (<17MS)",
            description: \`**Channel:** #\${channel.name}\\n**Rogue Admin:** <@\${executor.id}> (\${executor.tag})\\n**Action Taken:** Instant Channel Re-Creation & Stripped Admin Roles\`,
            color: 0xDC2626
          });
        }
      } catch (err: any) {
      }
    });

    client.on("roleCreate",`);

fs.writeFileSync('discord-bot.ts', code);
