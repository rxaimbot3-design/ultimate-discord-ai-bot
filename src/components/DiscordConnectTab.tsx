import React, { useState, useEffect } from "react";
import { 
  Power, 
  Terminal, 
  Link as LinkIcon, 
  RefreshCw, 
  Layers, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  HelpCircle,
  Copy,
  ChevronRight
} from "lucide-react";

interface DiscordStatus {
  status: "online" | "offline" | "connecting" | "error";
  tokenConfigured: boolean;
  clientIdConfigured: boolean;
  botUser: { username: string; tag: string; id: string; avatarUrl: string } | null;
  guilds: Array<{ id: string; name: string; memberCount: number }>;
  inviteLink: string;
  logs: Array<{ timestamp: string; type: "info" | "success" | "warning" | "error"; message: string }>;
}

export default function DiscordConnectTab() {
  const [statusData, setStatusData] = useState<DiscordStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await fetch("/api/discord/status");
      const data = await res.json();
      setStatusData(data);
    } catch (err) {
      console.error("Error fetching Discord status:", err);
    }
  };

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 3000); // Poll status every 3s for live console logs!
    return () => clearInterval(interval);
  }, []);

  const [inputToken, setInputToken] = useState("");
  const [inputClientId, setInputClientId] = useState("");
  const [connectMessage, setConnectMessage] = useState<string | null>(null);

  const handleConnect = async () => {
    setConnecting(true);
    setConnectMessage(null);
    try {
      const res = await fetch("/api/discord/connect", { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: inputToken, clientId: inputClientId })
      });
      const data = await res.json();
      if (data.success) {
        setConnectMessage("✅ Connection process launched successfully!");
        await fetchStatus();
      } else {
        setConnectMessage(`❌ Connection failed: ${data.error}`);
      }
    } catch (err: any) {
      setConnectMessage(`❌ Connection failed: ${err.message}`);
    } finally {
      setConnecting(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!statusData) {
    return (
      <div className="flex items-center justify-center h-64 bg-white rounded-2xl border border-zinc-200/80">
        <div className="flex items-center gap-2 text-zinc-500 font-bold text-xs">
          <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
          লোডিং করা হচ্ছে...
        </div>
      </div>
    );
  }

  const { status, tokenConfigured, clientIdConfigured, botUser, guilds, inviteLink, logs } = statusData;

  return (
    <div className="space-y-6" id="discord-connect-tab">
      
      {/* Bot Connection Health Status Card */}
      <div className="bg-white rounded-2xl border border-zinc-200/80 p-6" id="bot-status-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black text-2xl shrink-0 ${
              status === "online" 
                ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                : status === "connecting"
                ? "bg-amber-50 text-amber-600 border border-amber-200"
                : "bg-rose-50 text-rose-600 border border-rose-200"
            }`}>
              {botUser ? (
                <img src={botUser.avatarUrl} alt="avatar" className="w-full h-full rounded-2xl object-cover" referrerPolicy="no-referrer" />
              ) : (
                "🤖"
              )}
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base text-zinc-900">
                  {botUser ? botUser.tag : "Discord Bot Connection Manager"}
                </h3>
                
                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                  status === "online"
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
                    : status === "connecting"
                    ? "bg-amber-50 text-amber-700 border-amber-200/60 animate-pulse"
                    : "bg-rose-50 text-rose-700 border-rose-200/60"
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${
                    status === "online" 
                      ? "bg-emerald-500" 
                      : status === "connecting"
                      ? "bg-amber-500 animate-pulse"
                      : "bg-rose-500"
                  }`} />
                  {status === "online" ? "সংযুক্ত (Connected)" : status === "connecting" ? "সংযোগ করা হচ্ছে..." : "অফলাইন (Offline)"}
                </span>
              </div>
              <p className="text-xs text-zinc-500 font-medium mt-1 leading-normal">
                {status === "online" 
                  ? "আপনার রিয়েল-টাইম ডিসকর্ড বট এআই ফিচারের সাথে সফলভাবে সংযুক্ত রয়েছে!" 
                  : "ডিসকর্ড বটের সাথে এই প্যানেলটি লিঙ্ক করুন রিয়েল-টাইম অটোমেশন এবং এআই কন্ট্রোলের জন্য।"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-center">
            <button
              onClick={fetchStatus}
              className="p-2.5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-600 transition"
              title="রিফ্রেশ করুন"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <button
              onClick={handleConnect}
              disabled={connecting || !tokenConfigured}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black transition ${
                !tokenConfigured
                  ? "bg-zinc-100 text-zinc-400 border border-zinc-200/60 cursor-not-allowed"
                  : status === "online"
                  ? "bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100"
                  : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md shadow-indigo-500/10"
              }`}
            >
              <Power className="w-4 h-4" />
              <span>
                {status === "online" ? "পুনরায় সংযোগ করুন (Reconnect)" : "বট চালু করুন (Start Bot)"}
              </span>
            </button>
          </div>
        </div>

        {/* Direct Token Connection Input Box */}
        <div className="mt-6 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100/80 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-black text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
              <Power className="w-3.5 h-3.5 text-indigo-600" /> Direct Bot Token & Client ID Gateway Connection
            </h4>
            <span className="text-[10px] text-indigo-700 font-bold bg-indigo-100/80 px-2 py-0.5 rounded-full">
              Instant Connection
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Bot Token (DISCORD_BOT_TOKEN)</label>
              <input 
                type="password"
                placeholder="Paste Bot Token (MTA..."
                value={inputToken}
                onChange={(e) => setInputToken(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Client ID (DISCORD_CLIENT_ID)</label>
              <input 
                type="text"
                placeholder="Paste Application Client ID (123..."
                value={inputClientId}
                onChange={(e) => setInputClientId(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-zinc-200 rounded-xl text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {connectMessage && (
            <p className="text-xs font-bold text-indigo-900 bg-white p-2 rounded-lg border border-indigo-100">{connectMessage}</p>
          )}

          <button
            onClick={handleConnect}
            disabled={connecting}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Power className="w-4 h-4" /> CONNECT BOT IMMEDIATELY (তাৎক্ষণিক সংযোগ করুন)
          </button>
        </div>

        {/* Configurations Status Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-6 pt-5 border-t border-zinc-100">
          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              <span className="text-xs font-bold text-zinc-600">Bot Token Configured</span>
            </div>
            {tokenConfigured ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            )}
          </div>

          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              <span className="text-xs font-bold text-zinc-600">Client ID Provided</span>
            </div>
            {clientIdConfigured ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
            )}
          </div>

          <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/40 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              <span className="text-xs font-bold text-zinc-600">Active Guilds / Servers</span>
            </div>
            <span className="text-xs font-black text-indigo-700">{guilds.length} Servers</span>
          </div>
        </div>
      </div>

      {/* Invite section & Server info */}
      {status === "online" && inviteLink && (
        <div className="bg-emerald-50/50 border border-emerald-200/60 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-3">
            <LinkIcon className="w-5 h-5 text-emerald-700 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-black text-emerald-800">বটটিকে আপনার সার্ভারে ইনভাইট করুন (Invite Bot)</h4>
              <p className="text-[11px] text-emerald-700 leading-normal mt-1">
                আপনার বটটি এখন সচল রয়েছে! নিচের লিঙ্কে ক্লিক করে সহজেই আপনার ডিসকর্ড সার্ভারে এটি যোগ করুন।
              </p>
            </div>
          </div>
          <a
            href={inviteLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 transition shadow-sm"
          >
            <LinkIcon className="w-3.5 h-3.5" />
            সার্ভারে যোগ করুন (Add to Server)
          </a>
        </div>
      )}

      {/* Main Grid: Left Setup Guide, Right Active Guilds & Console logs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Step by Step Setup Guide */}
        <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-4" id="setup-guide-card">
          <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <h3 className="font-black text-sm text-zinc-900">ডিসকর্ড বট সেটআপ গাইড (Setup Guide)</h3>
          </div>

          <div className="space-y-4 text-xs text-zinc-600">
            <div className="relative pl-7 pb-4 border-l border-zinc-100 last:border-0 last:pb-0">
              <span className="absolute left-[-11px] top-0.5 w-5 h-5 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-[10px] text-indigo-600">1</span>
              <h4 className="font-black text-zinc-900 mb-1">ডিসকর্ড অ্যাপ্লিকেশন তৈরি করুন</h4>
              <p className="leading-relaxed">
                <a href="https://discord.com/developers/applications" target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-bold hover:underline inline-flex items-center gap-0.5">
                  Discord Developer Portal
                </a> এ যান। <strong>"New Application"</strong> বাটনে ক্লিক করে একটি সুন্দর নাম দিয়ে অ্যাপ্লিকেশনটি তৈরি করুন।
              </p>
            </div>

            <div className="relative pl-7 pb-4 border-l border-zinc-100 last:border-0 last:pb-0">
              <span className="absolute left-[-11px] top-0.5 w-5 h-5 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-[10px] text-indigo-600">2</span>
              <h4 className="font-black text-zinc-900 mb-1">বট টোকেন এবং ক্লায়েন্ট আইডি সংগ্রহ করুন</h4>
              <p className="leading-relaxed mb-2">
                অ্যাপ্লিকেশন ড্যাশবোর্ডে <strong>"OAuth2"</strong> ট্যাব থেকে <strong>"Client ID"</strong> কপি করুন। এরপর <strong>"Bot"</strong> ট্যাবে গিয়ে একটি বট অ্যাকাউন্ট যুক্ত করুন এবং সেটির <strong>"Bot Token"</strong> কপি করে নিন।
              </p>
              <div className="p-2 bg-zinc-50 border border-zinc-200/60 rounded-lg text-[10px] flex items-center justify-between">
                <span className="font-bold text-zinc-500">Enable Gateway Intents:</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700 font-bold">Message Content Intent</span>
              </div>
            </div>

            <div className="relative pl-7 pb-4 border-l border-zinc-100 last:border-0 last:pb-0">
              <span className="absolute left-[-11px] top-0.5 w-5 h-5 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-[10px] text-indigo-600">3</span>
              <h4 className="font-black text-zinc-900 mb-1">সিক্রেট প্যানেল থেকে কনফিগার করুন (Critical)</h4>
              <p className="leading-relaxed mb-2">
                এই এআই স্টুডিও ওয়েব প্যানেলের <strong>Settings → Secrets (উপরে ডান কোনায়)</strong> অপশনে গিয়ে নিচের ভ্যারিয়েবলগুলো সঠিকভাবে যোগ করুন:
              </p>
              <ul className="space-y-1.5 list-none pl-0">
                <li className="flex items-center justify-between p-2 bg-zinc-50 rounded-lg border border-zinc-100">
                  <code className="text-indigo-600 font-bold font-mono">DISCORD_BOT_TOKEN</code>
                  <button onClick={() => copyToClipboard("DISCORD_BOT_TOKEN", "t1")} className="text-zinc-400 hover:text-zinc-700">
                    {copiedId === "t1" ? <span className="text-[10px] text-emerald-600 font-bold">Copied!</span> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </li>
                <li className="flex items-center justify-between p-2 bg-zinc-50 rounded-lg border border-zinc-100">
                  <code className="text-indigo-600 font-bold font-mono">DISCORD_CLIENT_ID</code>
                  <button onClick={() => copyToClipboard("DISCORD_CLIENT_ID", "t2")} className="text-zinc-400 hover:text-zinc-700">
                    {copiedId === "t2" ? <span className="text-[10px] text-emerald-600 font-bold">Copied!</span> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </li>
                <li className="flex items-center justify-between p-2 bg-zinc-50 rounded-lg border border-zinc-100">
                  <div className="flex flex-col">
                    <code className="text-indigo-600 font-bold font-mono">DISCORD_GUILD_ID</code>
                    <span className="text-[9px] text-zinc-400">(Optional for instant commands)</span>
                  </div>
                  <button onClick={() => copyToClipboard("DISCORD_GUILD_ID", "t3")} className="text-zinc-400 hover:text-zinc-700">
                    {copiedId === "t3" ? <span className="text-[10px] text-emerald-600 font-bold">Copied!</span> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </li>
              </ul>
            </div>

            <div className="relative pl-7 last:border-0">
              <span className="absolute left-[-11px] top-0.5 w-5 h-5 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center font-bold text-[10px] text-indigo-600">4</span>
              <h4 className="font-black text-zinc-900 mb-1">বট চালনা ও স্ল্যাশ কমান্ড টেস্টিং</h4>
              <p className="leading-relaxed">
                প্যানেলে এসে <strong>"Start Bot"</strong> বাটনে ক্লিক করুন। বট অনলাইনের পর ইনভাইট লিংক ব্যবহার করে আপনার সার্ভারে যোগ করুন। এবার যেকোনো চ্যানেলে গিয়ে নিচের কমান্ডগুলো টেস্ট করুন:
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <span className="px-2 py-1 bg-zinc-100 border border-zinc-200 text-zinc-700 font-mono text-[10px] rounded-md font-bold">/ask</span>
                <span className="px-2 py-1 bg-zinc-100 border border-zinc-200 text-zinc-700 font-mono text-[10px] rounded-md font-bold">/translate</span>
                <span className="px-2 py-1 bg-zinc-100 border border-zinc-200 text-zinc-700 font-mono text-[10px] rounded-md font-bold">/summarize</span>
                <span className="px-2 py-1 bg-zinc-100 border border-zinc-200 text-zinc-700 font-mono text-[10px] rounded-md font-bold">/toxicity</span>
              </div>
            </div>
          </div>
        </div>

        {/* Console Logs / Servers Grid */}
        <div className="space-y-6">
          
          {/* Active Servers List */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-zinc-100">
              <Layers className="w-4 h-4 text-indigo-600" />
              <h3 className="font-black text-sm text-zinc-900">সংযুক্ত ডিসকর্ড সার্ভারসমূহ ({guilds.length})</h3>
            </div>

            {guilds.length === 0 ? (
              <div className="p-6 text-center text-zinc-400 bg-zinc-50 rounded-xl border border-zinc-100">
                <Info className="w-5 h-5 mx-auto mb-2 text-zinc-300" />
                <p className="text-xs font-bold leading-normal">এখনও কোনো সার্ভার সংযুক্ত করা হয়নি।</p>
              </div>
            ) : (
              <div className="space-y-2.5 max-h-36 overflow-y-auto pr-1">
                {guilds.map((g) => (
                  <div key={g.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-200/40 text-xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-black">
                        🛡️
                      </div>
                      <div>
                        <p className="font-black text-zinc-900">{g.name}</p>
                        <p className="text-[10px] text-zinc-400 font-medium">Server ID: {g.id}</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-indigo-50 border border-indigo-100 text-indigo-700 font-black">
                      {g.memberCount} Members
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Live Bot Console Logs Output */}
          <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-100">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-zinc-900" />
                <h3 className="font-black text-sm text-zinc-900">লাইভ বট কনসোল লগ (Live Console)</h3>
              </div>
              <span className="flex items-center gap-1.5 text-[9px] font-black uppercase text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-100">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Stream Live
              </span>
            </div>

            <div className="p-4 bg-zinc-950 rounded-xl font-mono text-[10px] text-zinc-300 space-y-2 h-48 overflow-y-auto shadow-inner leading-relaxed">
              {logs.length === 0 ? (
                <div className="text-zinc-500 italic flex items-center justify-center h-full">
                  No active console logs. Start the bot connection to see stream.
                </div>
              ) : (
                logs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2 border-b border-zinc-900/60 pb-1.5 last:border-0 last:pb-0">
                    <span className="text-zinc-500 shrink-0 font-bold">[{log.timestamp}]</span>
                    <span className={`shrink-0 font-black px-1 rounded text-[9px] leading-none py-0.5 ${
                      log.type === "success" 
                        ? "bg-emerald-950/80 text-emerald-400" 
                        : log.type === "error"
                        ? "bg-rose-950/80 text-rose-400"
                        : log.type === "warning"
                        ? "bg-amber-950/80 text-amber-400"
                        : "bg-zinc-800 text-zinc-300"
                    }`}>
                      {log.type.toUpperCase()}
                    </span>
                    <span className="text-zinc-100 whitespace-pre-wrap">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
