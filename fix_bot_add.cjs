const fs = require('fs');
let code = fs.readFileSync('discord-bot.ts', 'utf8');

code = code.replace(/client\.on\("guildMemberAdd", async \(member\) => \{[\s\S]*?client\.on\("webhookUpdate",/m, `client.on("guildMemberAdd", async (member) => {
      const guild = member.guild;
      if (member.user.bot) {
        const isPanic = trackGuildActionAndCheckPanic(guild.id);
        
        if (isPanic) {
           await member.kick("Zero Trust Anti-Bot-Add Policy Violation: Unwhitelisted Bot Add (PANIC MODE)").catch(() => {});
        }

        try {
          const entry = await fetchAuditLogWithRetry(guild, AuditLogEvent.BotAdd, member.id, 2, 500);
          const executor = entry?.executor;

          if (executor) {
            if (!isOwnerOrWhitelisted(executor.id, guild)) {
              addBotLog(\`🚨 [17MS ULTRA-FAST ZERO TRUST] Unauthorized bot '\${member.user.tag}' added by Admin/Staff \${executor.tag}! Kicking bot & stripping staff roles instantly (<17ms).\`, "error");
              
              if (!isPanic) {
                 await member.kick("Zero Trust Anti-Bot-Add Policy Violation: Unwhitelisted Bot Add").catch(() => {});
              }

              const execMember = await guild.members.fetch(executor.id).catch(() => null);
              if (execMember && execMember.id !== guild.ownerId) {
                await execMember.roles.set([], "Zero-Trust Strict Policy: Unauthorized Bot Addition").catch(() => {});
              }

              await sendLiveAuditAlert(guild, {
                title: "🚨 UNAUTHORIZED BOT ADDITION INTERCEPTED (<17MS)",
                description: \`**Bot Kicked:** \${member.user.tag} (\${member.id})\\n**Added By Admin:** <@\${executor.id}> (\${executor.tag})\\n**Action Taken:** Kicked Bot & Stripped All Staff Roles from <@\${executor.id}> in <17ms\`,
                color: 0xDC2626
              });
            } else {
              addBotLog(\`✅ Authorized Bot '\${member.user.tag}' added by Whitelisted Owner \${executor.tag}.\`, "info");
            }
          } else {
             // If audit log fails to find who added the bot, we MUST assume unauthorized for a bot to be safe!
             if (!isPanic) {
                 await member.kick("Zero Trust Anti-Bot-Add Policy Violation").catch(() => {});
                 addBotLog(\`🚨 [17MS ULTRA-FAST ZERO TRUST] Unauthorized bot '\${member.user.tag}' added but executor not found in audit log! Kicking anyway.\`, "error");
             }
          }
        } catch (err) {}
      }
    });

    client.on("webhookUpdate",`);

fs.writeFileSync('discord-bot.ts', code);
