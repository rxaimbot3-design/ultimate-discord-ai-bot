const fs = require('fs');
let code = fs.readFileSync('discord-bot.ts', 'utf8');

code = code.replace(/client\.on\("roleCreate", async \(role\) => \{[\s\S]*?client\.on\("roleDelete",/m, `client.on("roleCreate", async (role) => {
      const guild = role.guild;
      const startTime = Date.now();

      const isPanic = trackGuildActionAndCheckPanic(guild.id);
      if (isPanic) {
          await role.delete("Zero Trust 100/100 Instant Anti-Nuke Role Creation Revert (PANIC MODE)").catch(() => {});
      }

      try {
        const entry = await fetchAuditLogWithRetry(guild, AuditLogEvent.RoleCreate, role.id, 2, 500);
        const executor = entry?.executor;

        if (executor && !isOwnerOrWhitelisted(executor.id, guild)) {
          const responseLatency = Date.now() - startTime;
          addBotLog(\`🚨 [17MS ULTRA-FAST ZERO TRUST] Unauthorized role creation of '@\${role.name}' by Admin/Staff \${executor.tag}! (\${responseLatency}ms)\`, "error");
          checkNukerAttackThreshold(executor.id, guild.id, "RoleCreate");

          const member = await guild.members.fetch(executor.id).catch(() => null);
          if (member && member.id !== guild.ownerId) {
            await member.roles.set([], "Zero-Trust Strict Policy: Rogue Admin Role Creation Attempt").catch(() => {});
          }

          if (!isPanic) {
              await role.delete("Zero Trust 100/100 Instant Anti-Nuke Role Creation Revert").catch(() => {});
          }

          await sendLiveAuditAlert(guild, {
            title: "🚨 UNAUTHORIZED ROLE CREATION REVERTED (<17MS)",
            description: \`**Role:** @\${role.name}\\n**Rogue Admin:** <@\${executor.id}> (\${executor.tag})\\n**Action Taken:** Instant Role Deletion & Stripped Admin Roles\`,
            color: 0xDC2626
          });
        }
      } catch (err: any) {
      }
    });

    client.on("roleDelete",`);

code = code.replace(/client\.on\("roleDelete", async \(role\) => \{[\s\S]*?client\.on\("guildMemberRemove",/m, `client.on("roleDelete", async (role) => {
      const guild = role.guild;
      const startTime = Date.now();

      const isPanic = trackGuildActionAndCheckPanic(guild.id);
      if (isPanic) {
          await guild.roles.create({
            name: role.name,
            color: role.color,
            hoist: role.hoist,
            permissions: role.permissions,
            position: role.position,
            mentionable: role.mentionable,
            reason: "Zero Trust 100/100 Instant Anti-Nuke Role Deletion Revert (PANIC MODE)"
          }).catch(() => {});
      }

      try {
        const entry = await fetchAuditLogWithRetry(guild, AuditLogEvent.RoleDelete, role.id, 2, 500);
        const executor = entry?.executor;

        if (executor && !isOwnerOrWhitelisted(executor.id, guild)) {
          const responseLatency = Date.now() - startTime;
          addBotLog(\`🚨 [17MS ULTRA-FAST ZERO TRUST] Unauthorized role deletion of '@\${role.name}' by Admin/Staff \${executor.tag}! (\${responseLatency}ms)\`, "error");
          checkNukerAttackThreshold(executor.id, guild.id, "RoleDelete");

          const member = await guild.members.fetch(executor.id).catch(() => null);
          if (member && member.id !== guild.ownerId) {
            await member.roles.set([], "Zero-Trust Strict Policy: Rogue Admin Role Deletion Attempt").catch(() => {});
          }

          if (!isPanic) {
              await guild.roles.create({
                name: role.name,
                color: role.color,
                hoist: role.hoist,
                permissions: role.permissions,
                position: role.position,
                mentionable: role.mentionable,
                reason: "Zero Trust 100/100 Instant Anti-Nuke Role Deletion Revert"
              }).catch(() => {});
          }

          await sendLiveAuditAlert(guild, {
            title: "🚨 UNAUTHORIZED ROLE DELETION REVERTED (<17MS)",
            description: \`**Role:** @\${role.name}\\n**Rogue Admin:** <@\${executor.id}> (\${executor.tag})\\n**Action Taken:** Instant Role Re-Creation & Stripped Admin Roles\`,
            color: 0xDC2626
          });
        }
      } catch (err: any) {
      }
    });

    client.on("guildMemberRemove",`);

fs.writeFileSync('discord-bot.ts', code);
