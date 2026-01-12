import React from 'react';
import type { ApplicationRecord } from '../types.ts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { ApplicationStatus } from '../types.ts';
import { TrendingUp, CheckCircle, XCircle, Clock } from 'lucide-react';

interface DashboardProps {
  applications: ApplicationRecord[];
}

const Dashboard: React.FC<DashboardProps> = ({ applications }) => {
  
  // Stats Calculation
  const total = applications.length;
  const applied = applications.filter(a => a.status === ApplicationStatus.APPLIED).length;
  const rejected = applications.filter(a => a.status === ApplicationStatus.REJECTED).length;
  const successRate = total > 0 ? Math.round((applied / total) * 100) : 0;

  // Chart Data Preparation
  const data = [
    { name: 'Total Scanned', value: total + 5 }, // Fake some scanned data not in record for visual
    { name: 'Matched', value: applied + rejected },
    { name: 'Applied', value: applied },
    { name: 'Skipped', value: rejected },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
        <div>
            <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
            <p className="text-slate-500">Overview of your AI agent's performance today.</p>
        </div>
        <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-slate-500">Last Active</p>
            <p className="text-slate-800 font-semibold">{new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
            title="Jobs Applied" 
            value={applied} 
            icon={<CheckCircle className="text-green-500 w-6 h-6"/>}
            bg="bg-green-50"
            trend="+12% from yesterday"
        />
        <StatCard 
            title="Success Rate" 
            value={`${successRate}%`} 
            icon={<TrendingUp className="text-indigo-500 w-6 h-6"/>}
            bg="bg-indigo-50"
            trend="Based on match score"
        />
        <StatCard 
            title="Jobs Skipped" 
            value={rejected} 
            icon={<XCircle className="text-red-500 w-6 h-6"/>}
            bg="bg-red-50"
            trend="Low match score"
        />
        <StatCard 
            title="Hours Saved" 
            value={(applied * 0.5).toFixed(1)} 
            icon={<Clock className="text-orange-500 w-6 h-6"/>}
            bg="bg-orange-50"
            trend="Est. 30 mins per app"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-semibold text-slate-800 mb-6">Activity Funnel</h3>
            <div className="h-[300px] w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={data.length > 0 ? data : [{name: 'No Data', value: 0}]}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                        <Tooltip 
                            cursor={{fill: '#f1f5f9'}}
                            contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                        />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={50}>
                             {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={['#94a3b8', '#6366f1', '#22c55e', '#ef4444'][index % 4]} />
                             ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>

        {/* Recent Activity List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
             <h3 className="text-lg font-semibold text-slate-800 mb-4">Recent Actions</h3>
             <div className="flex-1 overflow-y-auto pr-2 space-y-4 max-h-[300px] scrollbar-thin">
                {applications.length === 0 ? (
                    <div className="text-center py-10 text-slate-400">
                        No activity yet. Start the agent!
                    </div>
                ) : (
                    [...applications].reverse().slice(0, 10).map((app) => (
                        <div key={app.id} className="flex items-start p-3 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${app.status === ApplicationStatus.APPLIED ? 'bg-green-500' : 'bg-red-400'}`}></div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-slate-800">{app.jobTitle}</p>
                                <p className="text-xs text-slate-500">{app.company}</p>
                                <p className="text-xs text-slate-400 mt-1">{new Date(app.timestamp).toLocaleTimeString()}</p>
                            </div>
                            <div className="ml-auto text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
                                {app.matchScore}%
                            </div>
                        </div>
                    ))
                )}
             </div>
        </div>

      </div>
    </div>
  );
};

// Helper Component
const StatCard = ({ title, value, icon, bg, trend }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 transition-hover hover:shadow-md">
        <div className="flex items-start justify-between">
            <div>
                <p className="text-sm font-medium text-slate-500">{title}</p>
                <h3 className="text-3xl font-bold text-slate-800 mt-2">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${bg}`}>
                {icon}
            </div>
        </div>
        <p className="text-xs text-slate-400 mt-4 flex items-center">
            {trend}
        </p>
    </div>
);

export default Dashboard;