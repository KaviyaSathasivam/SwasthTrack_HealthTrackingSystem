import React, { useState } from 'react';
import { Video, Calendar, Clock, Users, Phone, PhoneOff, Settings, Monitor, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

interface VideoCall {
  id: string;
  patientName: string;
  doctorName: string;
  scheduledTime: string;
  duration: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'missed';
  meetingLink: string;
  roomId: string;
  notes?: string;
  recordingAvailable: boolean;
}

const mockVideoCalls: VideoCall[] = [
  {
    id: 'VC001',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Smith',
    scheduledTime: '2024-02-10T14:30:00',
    duration: 30,
    status: 'scheduled',
    meetingLink: 'https://meet.healthtrack.com/room/vc001',
    roomId: 'vc001',
    notes: 'Follow-up consultation for hypertension management',
    recordingAvailable: false
  },
  {
    id: 'VC002',
    patientName: 'Emma Wilson',
    doctorName: 'Dr. Michael Johnson',
    scheduledTime: '2024-02-10T10:00:00',
    duration: 45,
    status: 'in-progress',
    meetingLink: 'https://meet.healthtrack.com/room/vc002',
    roomId: 'vc002',
    notes: 'Initial consultation for neurological symptoms',
    recordingAvailable: false
  }
];

const mockPatients = ['John Doe', 'Emma Wilson', 'Robert Brown', 'Lisa Anderson', 'Michael Taylor'];
const mockDoctors = ['Dr. Sarah Smith', 'Dr. Michael Johnson', 'Dr. Emily Davis', 'Dr. Robert Wilson'];

export function VideoCallManagement() {
  const { user } = useAuth();
  const [videoCalls, setVideoCalls] = useState<VideoCall[]>(mockVideoCalls);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showScheduleModal, setShowScheduleModal] = useState(false);

  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: user?.role === 'doctor' ? user.name : '',
    date: '',
    time: '',
    duration: '30',
    notes: ''
  });

  const filteredCalls = videoCalls.filter(call => {
    const matchesStatus = statusFilter === 'all' || call.status === statusFilter;
    
    // Role-based filtering
    if (user?.role === 'patient') {
      return matchesStatus && call.patientName === user.name;
    } else if (user?.role === 'doctor') {
      return matchesStatus && call.doctorName === user.name;
    }
    
    return matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      patientName: '',
      doctorName: user?.role === 'doctor' ? user.name : '',
      date: '',
      time: '',
      duration: '30',
      notes: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newCall: VideoCall = {
      id: 'VC' + Date.now().toString().slice(-3),
      patientName: formData.patientName,
      doctorName: formData.doctorName,
      scheduledTime: `${formData.date}T${formData.time}:00`,
      duration: parseInt(formData.duration),
      status: 'scheduled',
      meetingLink: `https://meet.healthtrack.com/room/vc${Date.now().toString().slice(-3)}`,
      roomId: `vc${Date.now().toString().slice(-3)}`,
      notes: formData.notes,
      recordingAvailable: false
    };

    setVideoCalls(prev => [newCall, ...prev]);
    setShowScheduleModal(false);
    resetForm();
  };

  const startInstantCall = () => {
    const roomId = `instant-${Date.now().toString().slice(-6)}`;
    const meetingLink = `https://meet.healthtrack.com/room/${roomId}`;
    
    // In a real app, this would open the video call interface
    window.open(meetingLink, '_blank');
  };

  const joinCall = (call: VideoCall) => {
    // In a real app, this would open the video call interface
    window.open(call.meetingLink, '_blank');
    
    // Update call status to in-progress
    setVideoCalls(prev => prev.map(c => 
      c.id === call.id ? { ...c, status: 'in-progress' } : c
    ));
  };

  const endCall = (callId: string) => {
    setVideoCalls(prev => prev.map(c => 
      c.id === callId ? { ...c, status: 'completed', recordingAvailable: true } : c
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      case 'missed': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Calendar size={16} />;
      case 'in-progress': return <Video size={16} />;
      case 'completed': return <Phone size={16} />;
      case 'cancelled': return <PhoneOff size={16} />;
      case 'missed': return <PhoneOff size={16} />;
      default: return <Video size={16} />;
    }
  };

  const getStats = () => {
    return {
      total: videoCalls.length,
      scheduled: videoCalls.filter(c => c.status === 'scheduled').length,
      inProgress: videoCalls.filter(c => c.status === 'in-progress').length,
      completed: videoCalls.filter(c => c.status === 'completed').length,
      missed: videoCalls.filter(c => c.status === 'missed').length,
    };
  };

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Video Call Management
          </h2>
          <p className="text-gray-600 mt-1">
            {user?.role === 'patient' ? 'Join video consultations with your doctors' : 'Manage virtual consultations and telemedicine sessions'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {user?.role === 'doctor' && (
            <>
              <button 
                onClick={startInstantCall}
                className="flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Video size={20} />
                <span>Start Instant Call</span>
              </button>
              <button 
                onClick={() => setShowScheduleModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-6 py-3 rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Calendar size={20} />
                <span>Schedule Call</span>
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-6"
      >
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-700">Total Calls</p>
              <p className="text-3xl font-bold text-blue-900">{stats.total}</p>
            </div>
            <Video className="text-blue-600" size={32} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-700">Scheduled</p>
              <p className="text-3xl font-bold text-purple-900">{stats.scheduled}</p>
            </div>
            <Calendar className="text-purple-600" size={32} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-700">In Progress</p>
              <p className="text-3xl font-bold text-green-900">{stats.inProgress}</p>
            </div>
            <Phone className="text-green-600" size={32} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-700">Completed</p>
              <p className="text-3xl font-bold text-gray-900">{stats.completed}</p>
            </div>
            <Monitor className="text-gray-600" size={32} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-orange-700">Missed</p>
              <p className="text-3xl font-bold text-orange-900">{stats.missed}</p>
            </div>
            <PhoneOff className="text-orange-600" size={32} />
          </div>
        </div>
      </motion.div>

      {/* Filter */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200/50"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Video Call Sessions</h3>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="missed">Missed</option>
          </select>
        </div>
      </motion.div>

      {/* Video Calls List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {filteredCalls.map((call, index) => (
          <motion.div
            key={call.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3">
                  <div className={`p-3 rounded-xl ${
                    call.status === 'in-progress' ? 'bg-green-100' :
                    call.status === 'scheduled' ? 'bg-blue-100' :
                    call.status === 'completed' ? 'bg-gray-100' :
                    'bg-orange-100'
                  }`}>
                    <Video className={`${
                      call.status === 'in-progress' ? 'text-green-600' :
                      call.status === 'scheduled' ? 'text-blue-600' :
                      call.status === 'completed' ? 'text-gray-600' :
                      'text-orange-600'
                    }`} size={24} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">Call #{call.id}</h3>
                    <p className="text-sm text-gray-600">Room: {call.roomId}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border flex items-center space-x-1 ${getStatusColor(call.status)}`}>
                  {getStatusIcon(call.status)}
                  <span>{call.status.replace('-', ' ')}</span>
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Patient:</span>
                  <span className="font-medium text-gray-900">{call.patientName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Doctor:</span>
                  <span className="font-medium text-gray-900">{call.doctorName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Scheduled:</span>
                  <span className="font-medium text-gray-900">
                    {new Date(call.scheduledTime).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Duration:</span>
                  <span className="font-medium text-gray-900">{call.duration} minutes</span>
                </div>
              </div>

              {call.notes && (
                <div className="mb-4 p-3 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-700">{call.notes}</p>
                </div>
              )}

              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="flex items-center space-x-2">
                  {call.recordingAvailable && (
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-lg">
                      Recording Available
                    </span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  {call.status === 'scheduled' && (
                    <button 
                      onClick={() => joinCall(call)}
                      className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center space-x-1"
                    >
                      <Video size={14} />
                      <span>Join Call</span>
                    </button>
                  )}
                  {call.status === 'in-progress' && user?.role === 'doctor' && (
                    <button 
                      onClick={() => endCall(call.id)}
                      className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors flex items-center space-x-1"
                    >
                      <PhoneOff size={14} />
                      <span>End Call</span>
                    </button>
                  )}
                  {call.status === 'completed' && call.recordingAvailable && (
                    <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors flex items-center space-x-1">
                      <Monitor size={14} />
                      <span>View Recording</span>
                    </button>
                  )}
                  <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors">
                    <Settings size={16} />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Schedule Call Modal */}
      <AnimatePresence>
        {showScheduleModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">Schedule Video Call</h3>
                  <button
                    onClick={() => setShowScheduleModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Patient *
                    </label>
                    <select
                      required
                      value={formData.patientName}
                      onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Patient</option>
                      {mockPatients.map(patient => (
                        <option key={patient} value={patient}>{patient}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Doctor *
                    </label>
                    {user?.role === 'doctor' ? (
                      <input
                        type="text"
                        value={user.name}
                        disabled
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-600"
                      />
                    ) : (
                      <select
                        required
                        value={formData.doctorName}
                        onChange={(e) => setFormData(prev => ({ ...prev, doctorName: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select Doctor</option>
                        {mockDoctors.map(doctor => (
                          <option key={doctor} value={doctor}>{doctor}</option>
                        ))}
                      </select>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      required
                      value={formData.time}
                      onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Duration (minutes) *
                    </label>
                    <select
                      required
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Purpose of the video call or any special instructions..."
                  />
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowScheduleModal(false)}
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl hover:from-cyan-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Schedule Call
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredCalls.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Video className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500">No video calls found matching your criteria.</p>
        </motion.div>
      )}
    </div>
  );
}