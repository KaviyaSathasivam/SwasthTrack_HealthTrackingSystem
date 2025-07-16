import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { LandingPage } from './components/Landing/LandingPage';
import { AuthModal } from './components/Auth/AuthModal';
import { Sidebar } from './components/Layout/Sidebar';
import { Header } from './components/Layout/Header';
import { AdminDashboard } from './components/Dashboard/AdminDashboard';
import { DoctorDashboard } from './components/Dashboard/DoctorDashboard';
import { PatientDashboard } from './components/Dashboard/PatientDashboard';
import { PatientList } from './components/Patients/PatientList';
import { AppointmentList } from './components/Appointments/AppointmentList';
import { DoctorManagement } from './components/Doctors/DoctorManagement';
import { HealthRecords } from './components/HealthRecords/HealthRecords';
import { VitalSigns } from './components/VitalSigns/VitalSigns';
import { PrescriptionManagement } from './components/Prescriptions/PrescriptionManagement';
import { VideoCallManagement } from './components/VideoCalls/VideoCallManagement';
import { PaymentManagement } from './components/Payments/PaymentManagement';
import { ReportsAnalytics } from './components/Reports/ReportsAnalytics';
import { NotificationCenter } from './components/Notifications/NotificationCenter';
import { UserManagement } from './components/UserManagement/UserManagement';
import { motion } from 'framer-motion';

function App() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authType, setAuthType] = useState<'login' | 'signup' | 'forgot'>('login');
  const [authRole, setAuthRole] = useState<'admin' | 'doctor' | 'patient' | undefined>();

  const handleShowAuth = (type: 'login' | 'signup', role?: 'admin' | 'doctor' | 'patient') => {
    setAuthType(type);
    setAuthRole(role);
    setShowAuthModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading SwasthTrack...</p>
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <LandingPage onShowAuth={handleShowAuth} />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          initialType={authType}
          initialRole={authRole}
        />
      </>
    );
  }

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return `${user.role === 'admin' ? 'Admin' : user.role === 'doctor' ? 'Doctor' : 'Patient'} Dashboard`;
      case 'patients':
        return 'Patient Management';
      case 'doctors':
        return 'Doctor Management';
      case 'appointments':
        return 'Appointment Management';
      case 'health-records':
        return 'Health Records';
      case 'vitals':
        return 'Vital Signs Monitoring';
      case 'prescriptions':
        return 'Prescription Management';
      case 'video-calls':
        return 'Video Call Management';
      case 'payments':
        return 'Payment Management';
      case 'reports':
        return 'Reports & Analytics';
      case 'notifications':
        return 'Notification Center';
      case 'user-management':
        return 'User Management';
      case 'settings':
        return 'Settings & Preferences';
      default:
        return 'Dashboard';
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        if (user.role === 'admin') return <AdminDashboard />;
        if (user.role === 'doctor') return <DoctorDashboard />;
        return <PatientDashboard />;
      case 'patients':
        return <PatientList />;
      case 'doctors':
        return <DoctorManagement />;
      case 'appointments':
        return <AppointmentList />;
      case 'health-records':
        return <HealthRecords />;
      case 'vitals':
        return <VitalSigns />;
      case 'prescriptions':
        return <PrescriptionManagement />;
      case 'video-calls':
        return <VideoCallManagement />;
      case 'payments':
        return <PaymentManagement />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'notifications':
        return <NotificationCenter />;
      case 'user-management':
        return <UserManagement />;
      case 'settings':
        return (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 p-12">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-2xl">⚙️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Settings & Preferences</h3>
              <p className="text-gray-600 mb-6">Customize your SwasthTrack experience</p>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                Configure Settings
              </button>
            </div>
          </motion.div>
        );
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1 flex flex-col">
        <Header title={getPageTitle()} />
        <main className="flex-1 p-6 overflow-y-auto">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {renderContent()}
          </motion.div>
        </main>
      </div>
    </div>
  );
}

export default App;