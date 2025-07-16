import React from 'react';
import { 
  Home, 
  Users, 
  Calendar, 
  FileText, 
  BarChart3, 
  Settings, 
  Heart,
  CreditCard,
  Bell,
  UserPlus,
  Stethoscope,
  Activity,
  Pill,
  Video,
  Shield,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  roles: ('admin' | 'doctor' | 'patient')[];
  color: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} />, roles: ['admin', 'doctor', 'patient'], color: 'blue' },
  { id: 'patients', label: 'Patients', icon: <Users size={20} />, roles: ['admin', 'doctor'], color: 'green' },
  { id: 'doctors', label: 'Doctors', icon: <Stethoscope size={20} />, roles: ['admin'], color: 'purple' },
  { id: 'appointments', label: 'Appointments', icon: <Calendar size={20} />, roles: ['admin', 'doctor', 'patient'], color: 'orange' },
  { id: 'health-records', label: 'Health Records', icon: <Activity size={20} />, roles: ['admin', 'doctor', 'patient'], color: 'red' },
  { id: 'prescriptions', label: 'Prescriptions', icon: <Pill size={20} />, roles: ['doctor', 'patient'], color: 'indigo' },
  { id: 'video-calls', label: 'Video Calls', icon: <Video size={20} />, roles: ['doctor', 'patient'], color: 'cyan' },
  { id: 'payments', label: 'Payments', icon: <CreditCard size={20} />, roles: ['admin', 'doctor', 'patient'], color: 'emerald' },
  { id: 'reports', label: 'Reports', icon: <BarChart3 size={20} />, roles: ['admin', 'doctor'], color: 'yellow' },
  { id: 'notifications', label: 'Notifications', icon: <Bell size={20} />, roles: ['admin', 'doctor', 'patient'], color: 'rose' },
  { id: 'user-management', label: 'User Management', icon: <UserPlus size={20} />, roles: ['admin'], color: 'violet' },
  { id: 'settings', label: 'Settings', icon: <Settings size={20} />, roles: ['admin', 'doctor', 'patient'], color: 'gray' },
];

const getColorClasses = (color: string, isActive: boolean) => {
  const colors = {
    blue: isActive ? 'bg-blue-600 text-white border-blue-500' : 'text-gray-300 hover:bg-gray-700 hover:text-blue-400',
    green: isActive ? 'bg-green-600 text-white border-green-500' : 'text-gray-300 hover:bg-gray-700 hover:text-green-400',
    purple: isActive ? 'bg-purple-600 text-white border-purple-500' : 'text-gray-300 hover:bg-gray-700 hover:text-purple-400',
    orange: isActive ? 'bg-orange-600 text-white border-orange-500' : 'text-gray-300 hover:bg-gray-700 hover:text-orange-400',
    red: isActive ? 'bg-red-600 text-white border-red-500' : 'text-gray-300 hover:bg-gray-700 hover:text-red-400',
    pink: isActive ? 'bg-pink-600 text-white border-pink-500' : 'text-gray-300 hover:bg-gray-700 hover:text-pink-400',
    indigo: isActive ? 'bg-indigo-600 text-white border-indigo-500' : 'text-gray-300 hover:bg-gray-700 hover:text-indigo-400',
    cyan: isActive ? 'bg-cyan-600 text-white border-cyan-500' : 'text-gray-300 hover:bg-gray-700 hover:text-cyan-400',
    emerald: isActive ? 'bg-emerald-600 text-white border-emerald-500' : 'text-gray-300 hover:bg-gray-700 hover:text-emerald-400',
    yellow: isActive ? 'bg-yellow-600 text-white border-yellow-500' : 'text-gray-300 hover:bg-gray-700 hover:text-yellow-400',
    rose: isActive ? 'bg-rose-600 text-white border-rose-500' : 'text-gray-300 hover:bg-gray-700 hover:text-rose-400',
    violet: isActive ? 'bg-violet-600 text-white border-violet-500' : 'text-gray-300 hover:bg-gray-700 hover:text-violet-400',
    gray: isActive ? 'bg-gray-600 text-white border-gray-500' : 'text-gray-300 hover:bg-gray-700 hover:text-gray-400',
  };
  return colors[color as keyof typeof colors] || colors.gray;
};

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const { user } = useAuth();

  const filteredNavItems = navItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <div className="w-72 bg-gray-900 border-r border-gray-700 flex flex-col shadow-lg" style={{ backgroundColor: 'rgba(17, 24, 39, 1)' }}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 border-b border-gray-700"
      >
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
            <Heart className="text-white" size={28} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">
              SwasthTrack
            </h1>
            <div className="flex items-center gap-1">
              <Shield size={12} className="text-blue-400" />
              <p className="text-xs text-gray-400 font-medium">Advanced Healthcare</p>
            </div>
          </div>
        </div>
      </motion.div>

      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {filteredNavItems.map((item, index) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 font-medium ${
              activeTab === item.id
                ? `${getColorClasses(item.color, true)} border shadow-sm transform scale-[1.02]`
                : `${getColorClasses(item.color, false)} hover:transform hover:scale-[1.01]`
            }`}
          >
            <div className={`p-1 rounded-lg ${activeTab === item.id ? 'bg-white/20' : ''}`}>
              {item.icon}
            </div>
            <span>{item.label}</span>
            {activeTab === item.id && (
              <motion.div
                layoutId="activeIndicator"
                className="ml-auto w-2 h-2 bg-current rounded-full"
              />
            )}
          </motion.button>
        ))}
      </nav>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="p-4 border-t border-gray-700"
      >
        <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-sm">
            {user?.name.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">
              {user?.name}
            </p>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${
                user?.role === 'admin' ? 'bg-red-500' :
                user?.role === 'doctor' ? 'bg-green-500' : 'bg-blue-500'
              }`}></div>
              <p className="text-xs text-gray-400 capitalize font-medium">{user?.role}</p>
            </div>
          </div>
          <TrendingUp size={16} className="text-gray-400" />
        </div>
      </motion.div>
    </div>
  );
}