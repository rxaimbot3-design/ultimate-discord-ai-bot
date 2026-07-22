import React from 'react';
import { 
  Users, 
  MessageSquare, 
  ShieldCheck, 
  Activity, 
  Zap, 
  AlertTriangle,
  Lock,
  Unlock,
  RefreshCw,
  Clock
} from 'lucide-react';
import { DiscordServer, AuditLog } from '../types';

interface OverviewTabProps {
  server: DiscordServer;
  onToggleLockdown: () => void;
  logs: AuditLog[];
  onRefreshLogs: () => void;
}

export default function OverviewTab({ server, onToggleLockdown, logs, onRefreshLogs }: OverviewTabProps) {
  return (
    <div className="space-y-6" id="overview-tab-container">
      {/* Quick Server Banner */}
      <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white shadow-md relative overflow-hidden" id="server-banner">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-400/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-3xl font-black border border-white/20">
              {server.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black tracking-tight">{server.name}</h2>
                <span className={`px-2 py-0.5 text-[10px] font-extrabold uppercase rounded-md ${
                  server.status === 'lockdown' 
                    ? 'bg-rose-500 text-white animate-pulse' 
                    : 'bg-emerald-400/20 text-emerald-100 border border-emerald-400/30'
                }`}>
                  {server.status === 'lockdown' ? '🔒 LOCKDOWN ACTIVE' : '● Operational'}
                </span>
              </div>
              <p className="text-sm text-indigo-100 mt-1">
                Ultimate Discord Bot is guarding <strong>{server.memberCount.toLocaleString()}</strong> active community members.
              </p>
            </div>
          </div>

          <button
            onClick={onToggleLockdown}
            className={`px-5 py-2.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all duration-200 flex items-center gap-2 border ${
              server.status === 'lockdown'
                ? 'bg-white text-rose-600 hover:bg-rose-50 border-white'
                : 'bg-rose-600 hover:bg-rose-700 text-white border-rose-500'
            }`}
            id="lockdown-btn"
          >
            {server.status === 'lockdown' ? (
              <>
                <Unlock className="w-4 h-4" /> EMERGENCY UNLOCK
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" /> EMERGENCY LOCKDOWN
              </>
            )}
          </button>
        </div>
      </div>

      {/* Hero Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="metrics-grid">
        <div className="bg-white rounded-xl p-5 border border-zinc-200/80 flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Total Members</span>
            <span className="text-2xl font-black text-zinc-900">{server.memberCount.toLocaleString()}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-zinc-200/80 flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Active Tickets</span>
            <span className="text-2xl font-black text-zinc-900">{server.activeTickets}</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-zinc-200/80 flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Shield Status</span>
            <span className="text-2xl font-black text-zinc-900">100% Secure</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-zinc-200/80 flex items-center gap-4 shadow-xs">
          <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Bot Latency</span>
            <span className="text-2xl font-black text-zinc-900">18ms</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Server Health + Live Audit Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="overview-subgrid">
        {/* Server Health Status */}
        <div className="lg:col-span-1 bg-white rounded-xl p-5 border border-zinc-200/80 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">🤖 Server Health report</h3>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-zinc-600 mb-1">
                <span>Memory Allocation</span>
                <span className="text-zinc-900">42% (210MB/512MB)</span>
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[42%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-zinc-600 mb-1">
                <span>CPU Usage</span>
                <span className="text-zinc-900">2.4%</span>
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[2.4%] rounded-full"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-zinc-600 mb-1">
                <span>API Connection State</span>
                <span className="text-zinc-900">99.98% uptime</span>
              </div>
              <div className="w-full bg-zinc-100 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full w-[99.98%] rounded-full"></div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100">
            <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">Active Modules</h4>
            <div className="flex flex-wrap gap-1.5">
              {['AI Mod', 'Anti-Raid', 'Economy', 'Tickets', 'Leveling', 'Logs'].map((mod, idx) => (
                <span key={idx} className="text-[10px] font-bold bg-zinc-100 text-zinc-600 px-2 py-1 rounded-md border border-zinc-200/40">
                  ⚡ {mod}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Live Audit Logs */}
        <div className="lg:col-span-2 bg-white rounded-xl p-5 border border-zinc-200/80 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-400" />
                <h3 className="text-sm font-bold text-zinc-900 uppercase tracking-wider">📋 Live Security Audit Logs</h3>
              </div>
              <button 
                onClick={onRefreshLogs}
                className="p-1.5 text-zinc-400 hover:text-indigo-600 hover:bg-zinc-50 rounded-lg transition-colors border border-zinc-200/60"
                title="Refresh Logs"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1" id="audit-logs-list">
              {logs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-zinc-50 rounded-xl border border-zinc-200/40 text-xs">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${
                      log.severity === 'high' ? 'bg-rose-500' :
                      log.severity === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}></span>
                    <div>
                      <span className="font-extrabold text-zinc-900">{log.user}</span>
                      <span className="text-zinc-500 ml-1.5">{log.action}</span>
                    </div>
                  </div>
                  <span className="text-zinc-400 font-medium whitespace-nowrap">{log.time}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[10px] text-zinc-400 mt-4 pt-3 border-t border-zinc-100 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" /> Use the Lockdown button above to immediately lock channels during a server raid.
          </div>
        </div>
      </div>
    </div>
  );
}
