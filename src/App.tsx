import React, { useState } from 'react';
import Sidebar from './components/Sidebar.tsx';
import Dashboard from './components/Dashboard.tsx';
import AgentView from './components/AgentView.tsx';
import ProfileSetup from './components/ProfileSetup.tsx';
import ApplicationHistory from './components/ApplicationHistory.tsx';
import type { UserProfile, ApplicationRecord } from './types.ts';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Central State
  const [profile, setProfile] = useState<UserProfile>({
    name: 'Alex Developer',
    title: 'Frontend Engineer',
    experience: '4',
    skills: ['React', 'JavaScript', 'CSS', 'Node.js'],
    resumeText: 'Experienced Frontend Engineer specializing in React and modern web technologies. 4 years of experience building responsive web applications. Proficient in Tailwind CSS, TypeScript, and state management.',
    preferences: { remote: true, minSalary: 100000 }
  });

  const [applications, setApplications] = useState<ApplicationRecord[]>([]);

  const addApplication = (app: ApplicationRecord) => {
    setApplications(prev => [...prev, app]);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard applications={applications} />;
      case 'agent':
        return <AgentView profile={profile} applications={applications} addApplication={addApplication} />;
      case 'profile':
        return <ProfileSetup profile={profile} setProfile={setProfile} />;
      case 'history':
        return <ApplicationHistory applications={applications} />;
      default:
        return <Dashboard applications={applications} />;
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
      
      <main className="flex-1 ml-20 lg:ml-64 p-6 lg:p-8 transition-all duration-300">
        <header className="mb-8 flex justify-between items-center lg:hidden">
             <div className="text-xl font-bold text-slate-800">AutoApply</div>
        </header>
        {renderContent()}
      </main>
    </div>
  );
};

export default App;