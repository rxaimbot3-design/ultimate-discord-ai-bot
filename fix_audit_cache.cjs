const fs = require('fs');
let code = fs.readFileSync('discord-bot.ts', 'utf8');

const newAuditFunction = `
const pendingAuditLogRequests = new Map<string, Promise<any>>();
const auditLogCache = new Map<string, { timestamp: number, logs: any }>();

async function fetchAuditLogsDeduplicated(guild: Guild, type: AuditLogEvent) {
  const cacheKey = \`\${guild.id}-\${type}\`;
  const now = Date.now();
  const cached = auditLogCache.get(cacheKey);
  if (cached && now - cached.timestamp < 1500) {
    return cached.logs;
  }

  if (pendingAuditLogRequests.has(cacheKey)) {
    return pendingAuditLogRequests.get(cacheKey);
  }

  const promise = guild.fetchAuditLogs({ limit: 50, type }).then(logs => {
    auditLogCache.set(cacheKey, { timestamp: Date.now(), logs });
    pendingAuditLogRequests.delete(cacheKey);
    return logs;
  }).catch(e => {
    pendingAuditLogRequests.delete(cacheKey);
    console.error(\`fetchAuditLogs error for type \${type}:\`, e);
    return null;
  });

  pendingAuditLogRequests.set(cacheKey, promise);
  return promise;
}

// Smart Polling Helper to fetch audit logs with retries to handle Discord API eventually consistent delays
async function fetchAuditLogWithRetry(guild: Guild, type: AuditLogEvent, targetId?: string, retries = 4, delayMs = 800) {
  for (let i = 0; i < retries; i++) {
    const logs = await fetchAuditLogsDeduplicated(guild, type);
    if (logs && logs.entries.size > 0) {
      if (targetId) {
        const entry = logs.entries.find((e: any) => e.targetId === targetId);
        if (entry) return entry;
      } else {
        return logs.entries.first();
      }
    }
    await new Promise(r => setTimeout(r, delayMs)); // Wait and poll again to catch late logs
  }
  console.log(\`[AuditLog Warning] Could not find audit log for type \${type} and target \${targetId} after \${retries} retries.\`);
  return null;
}
`;

code = code.replace(/\/\/ Smart Polling Helper[\s\S]*?return null;\n\}/, newAuditFunction.trim());
fs.writeFileSync('discord-bot.ts', code);
console.log("Updated fetchAuditLogWithRetry");
