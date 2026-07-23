const fs = require('fs');
let code = fs.readFileSync('discord-bot.ts', 'utf8');

code = code.replace(/\.catch\(\(e: any\) => \{ console\.error\("Discord API Error:", e\.message\); \}\)/g, 
  `.catch(async (e: any) => { 
    console.error("Discord API Error:", e.message); 
    if (e.message.includes("Missing Permissions")) {
      addBotLog("❌ FAILED ACTION: Missing Permissions. Ensure the Bot's role is at the TOP of the server roles!", "error");
    }
  })`
);

fs.writeFileSync('discord-bot.ts', code);
