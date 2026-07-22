import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Compass, 
  Sparkles, 
  Puzzle, 
  Workflow, 
  Palette, 
  ShieldCheck, 
  Ticket, 
  Key, 
  Settings, 
  Coins, 
  Radio, 
  Github,
  Bot,
  Zap,
  Activity,
  UserCheck
} from 'lucide-react';

import OverviewTab from './components/OverviewTab';
import AiSystemTab from './components/AiSystemTab';
import PluginsDeveloperTab from './components/PluginsDeveloperTab';
import AutomationsTab from './components/AutomationsTab';
import EmbedBuilderTab from './components/EmbedBuilderTab';
import SecurityTab from './components/SecurityTab';
import TicketUserTab from './components/TicketUserTab';
import EnterpriseBillingTab from './components/EnterpriseBillingTab';
import SettingsTab from './components/SettingsTab';
import EconomyTab from './components/EconomyTab';
import DiscordConnectTab from './components/DiscordConnectTab';
import GitHubTab from './components/GitHubTab';
import VerificationTab from './components/VerificationTab';

import { AuditLog, SecuritySetting, LeaderboardUser } from './types';

type DashboardTab = 
  | 'overview' 
  | 'aisystem' 
  | 'plugins' 
  | 'automations' 
  | 'embeds' 
  | 'security' 
  | 'verification'
  | 'tickets' 
  | 'billing' 
  | 'settings' 
  | 'economy' 
  | 'discord-connect' 
  | 'github';

export default function App() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  
  const [server, setServer] = useState({
    id: '709581762663',
    name: 'Enterprise Ultra Cluster Node #1',
    icon: '🚀',
    memberCount: 18420,
    activeTickets: 3,
    status: 'online' as const
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    { id: '1', time: new Date().toLocaleTimeString(), user: 'ClusterWorker-01', action: 'Auto Sharding Cluster Engine started. 4 shards active.', severity: 'low' },
    { id: '2', time: new Date().toLocaleTimeString(), user: 'Gemini-AI', action: 'Google Search Live Grounding & Anti-Scam Shield online.', severity: 'low' },
    { id: '3', time: new Date().toLocaleTimeString(), user: 'SecurityCenter', action: 'Immutable audit trail cryptographically verified.', severity: 'low' }
  ]);

  // AI Chat System State
  const [aiMessages, setAiMessages] = useState<Array<{ sender: 'user' | 'assistant'; text: string; sources?: Array<{ title: string; uri: string }>; isError?: boolean }>>([
    { sender: 'assistant', text: 'Hello! I am your Enterprise Gemini AI Assistant. How can I help optimize your cluster today?' }
  ]);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState<SecuritySetting[]>([
    { id: 'sec-1', name: 'Anti-Raid Mass Join Shield', description: 'Auto-kick accounts joining in burst patterns > 10 joins/sec', enabled: true, category: 'anti-nuke', riskLevel: 'critical' },
    { id: 'sec-2', name: 'Gemini Crypto Scam & Link Filter', description: 'Analyze link destinations using Gemini 3.6 Flash live threat scan', enabled: true, category: 'links', riskLevel: 'high' },
    { id: 'sec-3', name: 'Immutable Cryptographic Audit Logging', description: 'Hash each log entry sequentially to prevent audit trail tampering', enabled: true, category: 'compliance', riskLevel: 'medium' },
    { id: 'sec-4', name: 'Self-Healing Crash Recovery & Health Checks', description: 'Automatically reboot frozen cluster worker isolates in under 100ms', enabled: true, category: 'permission', riskLevel: 'low' }
  ]);

  // Economy Leaderboard State
  const [leaderboard] = useState<LeaderboardUser[]>([
    { rank: 1, username: 'rxaimbot3#0001', level: 99, xp: 142500, coins: 50000 },
    { rank: 2, username: 'cyber_ninja#1002', level: 42, xp: 58200, coins: 12400 },
    { rank: 3, username: 'dev_alex#8891', level: 38, xp: 49100, coins: 8900 }
  ]);

  const handleAddLog = (action: string, severity: 'low' | 'medium' | 'high' = 'low') => {
    const newEntry: AuditLog = {
      id: `log-${Date.now()}`,
      time: new Date().toLocaleTimeString(),
      user: 'Admin',
      action,
      severity
    };
    setAuditLogs(prev => [newEntry, ...prev]);
  };

  const handleSendMessageToAi = async (text: string) => {
    if (!text.trim()) return;
    const userMsg = { sender: 'user' as const, text };
    setAiMessages(prev => [...prev, userMsg]);
    setIsGeneratingAi(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history: aiMessages })
      });
      const data = await response.json();
      if (response.ok) {
        setAiMessages(prev => [...prev, { sender: 'assistant', text: data.reply, sources: data.sources }]);
      } else {
        setAiMessages(prev => [...prev, { sender: 'assistant', text: data.error || 'Failed to generate AI response.', isError: true }]);
      }
    } catch (err: any) {
      setAiMessages(prev => [...prev, { sender: 'assistant', text: 'Network error connecting to Gemini AI.', isError: true }]);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleToggleSecuritySetting = (id: string) => {
    setSecuritySettings(prev => prev.map(s => {
      if (s.id === id) {
        const next = !s.enabled;
        handleAddLog(`Toggled security policy '${s.name}' to ${next}`, 'medium');
        return { ...s, enabled: next };
      }
      return s;
    }));
  };

  const handleSimulateRaid = (msg: string) => {
    handleAddLog(`🛡️ [SECURITY SHIELD TRIGGERED] ${msg}`, 'high');
  };

  const handleToggleLockdown = () => {
    setServer(prev => {
      const nextStatus = prev.status === 'lockdown' ? 'online' : 'lockdown';
      handleAddLog(nextStatus === 'lockdown' ? '🚨 EMERGENCY LOCKDOWN TRIGGERED' : 'Lockdown lifted across all shards', 'high');
      return { ...prev, status: nextStatus };
    });
  };

  const navigationItems = [
    { id: 'overview', icon: Compass, label: 'Overview & Cluster Health', category: 'CORE ENGINE' },
    { id: 'aisystem', icon: Sparkles, label: 'AI System & Insights', category: 'INTELLIGENCE' },
    { id: 'verification', icon: UserCheck, label: 'Verification System & CAPTCHA', category: 'SECURITY' },
    { id: 'plugins', icon: Puzzle, label: 'Plugins & APIs (REST/GraphQL)', category: 'DEVELOPER' },
    { id: 'automations', icon: Workflow, label: 'Workflows & Cron Scheduler', category: 'AUTOMATION' },
    { id: 'embeds', icon: Palette, label: 'Visual Embed Builder', category: 'BUILDER' },
    { id: 'security', icon: ShieldCheck, label: 'Security & Database Backup', category: 'PROTECTION' },
    { id: 'tickets', icon: Ticket, label: 'Tickets & User Control', category: 'MANAGEMENT' },
    { id: 'billing', icon: Key, label: 'License Keys & Analytics', category: 'ENTERPRISE' },
    { id: 'settings', icon: Settings, label: 'Themes & Multi-Language', category: 'SYSTEM' },
    { id: 'economy', icon: Coins, label: 'Guild Economy & XP', category: 'ENGAGEMENT' },
    { id: 'discord-connect', icon: Radio, label: 'Discord Bot & Live Console', category: 'GATEWAY' },
    { id: 'github', icon: Github, label: 'GitHub Sync & Deployment', category: 'DEVOPS' }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-zinc-800 font-sans antialiased flex flex-col selection:bg-indigo-100 selection:text-indigo-950" id="dashboard-root">
      
      {/* Header */}
      <header className="border-b border-zinc-200 bg-white/90 backdrop-blur-md sticky top-0 z-50 px-6 py-3.5 flex items-center justify-between shadow-xs" id="dashboard-header">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-800 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 font-black">
            <Bot className="w-5.5 h-5.5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black tracking-tight text-zinc-900">Enterprise Bot Control Panel</h1>
              <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 text-[10px] font-black uppercase rounded-md border border-indigo-200/50">
                v4.8.2 Ultra
              </span>
            </div>
            <p className="text-xs text-zinc-500 font-bold">Multi-Tenant • Cluster Support • Hot Reload • AI Grounding</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-zinc-50 rounded-xl border border-zinc-200/60 text-xs font-bold text-zinc-600">
            <Activity className="w-3.5 h-3.5 text-indigo-600" />
            <span>Cluster Ping: 18ms</span>
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            High Availability (4/4 Shards)
          </span>
        </div>
      </header>

      {/* Main Layout Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6" id="dashboard-body">
        
        {/* Navigation Sidebar */}
        <section className="lg:col-span-3 flex flex-col gap-4" id="sidebar-panel">
          <div className="bg-white rounded-2xl p-4 border border-zinc-200/80 shadow-xs flex flex-col gap-3 sticky top-20">
            <div className="pb-2 border-b border-zinc-100 flex items-center justify-between">
              <div>
                <h2 className="text-xs font-black text-zinc-400 uppercase tracking-wider">Enterprise Modules</h2>
                <p className="text-[10px] text-zinc-500 font-semibold">সকল এন্টারপ্রাইজ ফিচার কন্ট্রোল হাব</p>
              </div>
              <Zap className="w-4 h-4 text-indigo-600" />
            </div>

            <nav className="flex flex-col gap-1 max-h-[calc(100vh-180px)] overflow-y-auto pr-1" id="nav-list">
              {navigationItems.map((tab) => {
                const IconComponent = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-150 text-left ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950'
                    }`}
                  >
                    <IconComponent className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-zinc-500'}`} />
                    <span className="truncate">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </section>

        {/* Dynamic Content Canvas */}
        <section className="lg:col-span-9 flex flex-col" id="content-canvas">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.15 }}
              className="flex-1"
            >
              {activeTab === 'overview' && (
                <OverviewTab 
                  server={server} 
                  onToggleLockdown={handleToggleLockdown} 
                  logs={auditLogs}
                  onRefreshLogs={() => handleAddLog('Refreshed cluster telemetry logs', 'low')}
                />
              )}

              {activeTab === 'aisystem' && (
                <AiSystemTab 
                  messages={aiMessages}
                  isGenerating={isGeneratingAi}
                  onSendMessage={handleSendMessageToAi}
                />
              )}

              {activeTab === 'plugins' && (
                <PluginsDeveloperTab onAddLog={handleAddLog} />
              )}

              {activeTab === 'automations' && (
                <AutomationsTab onAddLog={handleAddLog} />
              )}

              {activeTab === 'embeds' && (
                <EmbedBuilderTab onAddLog={handleAddLog} />
              )}

              {activeTab === 'security' && (
                <SecurityTab 
                  settings={securitySettings}
                  onToggleSetting={handleToggleSecuritySetting}
                  onSimulateRaid={handleSimulateRaid}
                />
              )}

              {activeTab === 'verification' && (
                <VerificationTab onAddLog={handleAddLog} />
              )}

              {activeTab === 'tickets' && (
                <TicketUserTab onAddLog={handleAddLog} />
              )}

              {activeTab === 'billing' && (
                <EnterpriseBillingTab onAddLog={handleAddLog} />
              )}

              {activeTab === 'settings' && (
                <SettingsTab onAddLog={handleAddLog} />
              )}

              {activeTab === 'economy' && (
                <EconomyTab 
                  leaderboard={leaderboard}
                  onAddLog={handleAddLog}
                />
              )}

              {activeTab === 'discord-connect' && (
                <DiscordConnectTab />
              )}

              {activeTab === 'github' && (
                <GitHubTab />
              )}
            </motion.div>
          </AnimatePresence>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200/80 bg-white py-4 text-center text-xs text-zinc-400 font-medium mt-auto" id="dashboard-footer">
        © {new Date().getFullYear()} Enterprise Discord Bot Core Engine. High Availability & Multi-Tenant Architecture.
      </footer>
    </div>
  );
}
