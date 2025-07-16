import React, { useState } from 'react';
import { Search, Plus, FileText, Download, Eye, Calendar, Activity, Heart, Thermometer, X, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import { useData } from '../../context/DataContext';

const vitalsData = [
  { date: '1/1', bloodPressure: 120, heartRate: 72, temperature: 98.6 },
  { date: '1/7', bloodPressure: 118, heartRate: 68, temperature: 98.4 },
  { date: '1/14', bloodPressure: 122, heartRate: 75, temperature: 98.8 },
  { date: '1/21', bloodPressure: 115, heartRate: 70, temperature: 98.2 },
  { date: '1/28', bloodPressure: 119, heartRate: 73, temperature: 98.6 },
  { date: '2/4', bloodPressure: 117, heartRate: 71, temperature: 98.5 },
];

export function HealthRecords() {
  const { user } = useAuth();
  const { healthRecords, patients, addHealthRecord, getPatientData } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    patientName: '',
    recordType: 'consultation' as const,
    title: '',
    description: '',
    status: 'normal' as const,
    bloodPressure: '',
    heartRate: '',
    temperature: '',
    weight: ''
  });

  const filteredRecords = healthRecords.filter(record => {
    const matchesSearch = record.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         record.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || record.recordType === typeFilter;
    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;
    
    // If patient, only show their own records
    if (user?.role === 'patient') {
      return matchesSearch && matchesType && matchesStatus && record.patientName === user.name;
    }
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const resetForm = () => {
    setFormData({
      patientName: '',
      recordType: 'consultation',
      title: '',
      description: '',
      status: 'normal',
      bloodPressure: '',
      heartRate: '',
      temperature: '',
      weight: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newRecord = {
      patientName: formData.patientName,
      patientId: 'P' + Date.now().toString().slice(-3),
      recordType: formData.recordType,
      title: formData.title,
      description: formData.description,
      doctorName: user?.name || 'Dr. Unknown',
      date: new Date().toISOString().split('T')[0],
      status: formData.status,
      attachments: [],
      vitals: formData.recordType === 'vital-signs' ? {
        bloodPressure: formData.bloodPressure,
        heartRate: parseInt(formData.heartRate),
        temperature: parseFloat(formData.temperature),
        weight: parseFloat(formData.weight)
      } : undefined
    };

    addHealthRecord(newRecord);
    setShowAddModal(false);
    resetForm();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      case 'abnormal': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'pending': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'consultation': return <FileText size={20} className="text-blue-600" />;
      case 'lab-result': return <Activity size={20} className="text-green-600" />;
      case 'imaging': return <Eye size={20} className="text-purple-600" />;
      case 'prescription': return <Heart size={20} className="text-red-600" />;
      case 'vital-signs': return <Thermometer size={20} className="text-orange-600" />;
      default: return <FileText size={20} className="text-gray-600" />;
    }
  };

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
            Health Records
          </h2>
          <p className="text-gray-600 mt-1">
            {user?.role === 'patient' ? 'View your health records and medical history' : 'Comprehensive patient health documentation and history'}
          </p>
        </div>
        {user?.role === 'doctor' && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus size={20} />
            <span>Add Record</span>
          </button>
        )}
      </motion.div>

      {/* Vitals Overview Chart - Only for patients */}
      {user?.role === 'patient' && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200/50"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Health Trends</h3>
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Blood Pressure</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Heart Rate</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Temperature</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={vitalsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="bloodPressure" stroke="#EF4444" strokeWidth={3} />
              <Line type="monotone" dataKey="heartRate" stroke="#3B82F6" strokeWidth={3} />
              <Line type="monotone" dataKey="temperature" stroke="#10B981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      )}

      {/* Search and Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200/50"
      >
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search records by title, patient, or doctor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Types</option>
            <option value="consultation">Consultation</option>
            <option value="lab-result">Lab Result</option>
            <option value="imaging">Imaging</option>
            <option value="prescription">Prescription</option>
            <option value="vital-signs">Vital Signs</option>
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Status</option>
            <option value="normal">Normal</option>
            <option value="abnormal">Abnormal</option>
            <option value="critical">Critical</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </motion.div>

      {/* Records List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {filteredRecords.map((record, index) => (
          <motion.div
            key={record.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden hover:shadow-xl transition-all duration-300"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-4">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    {getTypeIcon(record.recordType)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{record.title}</h3>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">{record.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{new Date(record.date).toLocaleDateString()}</span>
                      </span>
                      <span>Patient: {record.patientName}</span>
                      <span>Doctor: {record.doctorName}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <Eye size={16} />
                  </button>
                  <button className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                    <Download size={16} />
                  </button>
                </div>
              </div>

              {record.vitals && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-xl">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Blood Pressure</p>
                    <p className="text-lg font-bold text-gray-900">{record.vitals.bloodPressure}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Heart Rate</p>
                    <p className="text-lg font-bold text-gray-900">{record.vitals.heartRate} BPM</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Temperature</p>
                    <p className="text-lg font-bold text-gray-900">{record.vitals.temperature}°F</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Weight</p>
                    <p className="text-lg font-bold text-gray-900">{record.vitals.weight} kg</p>
                  </div>
                </div>
              )}

              {record.attachments.length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-2">Attachments</p>
                  <div className="flex flex-wrap gap-2">
                    {record.attachments.map((attachment, idx) => (
                      <span key={idx} className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg flex items-center space-x-1">
                        <FileText size={12} />
                        <span>{attachment}</span>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Add Health Record Modal */}
      <AnimatePresence>
        {showAddModal && (
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
                  <h3 className="text-2xl font-bold text-gray-900">Add Health Record</h3>
                  <button
                    onClick={() => setShowAddModal(false)}
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Patient</option>
                      {patients.map(patient => (
                        <option key={patient.id} value={patient.name}>{patient.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Record Type *
                    </label>
                    <select
                      required
                      value={formData.recordType}
                      onChange={(e) => setFormData(prev => ({ ...prev, recordType: e.target.value as any }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="consultation">Consultation</option>
                      <option value="lab-result">Lab Result</option>
                      <option value="imaging">Imaging</option>
                      <option value="prescription">Prescription</option>
                      <option value="vital-signs">Vital Signs</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter record title"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Description *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="Detailed description of the record"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status *
                    </label>
                    <select
                      required
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value as any }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="normal">Normal</option>
                      <option value="abnormal">Abnormal</option>
                      <option value="critical">Critical</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>
                </div>

                {formData.recordType === 'vital-signs' && (
                  <div className="border-t border-gray-200 pt-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Vital Signs</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Blood Pressure
                        </label>
                        <input
                          type="text"
                          value={formData.bloodPressure}
                          onChange={(e) => setFormData(prev => ({ ...prev, bloodPressure: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          placeholder="120/80"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Heart Rate (BPM)
                        </label>
                        <input
                          type="number"
                          value={formData.heartRate}
                          onChange={(e) => setFormData(prev => ({ ...prev, heartRate: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          placeholder="72"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Temperature (°F)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.temperature}
                          onChange={(e) => setFormData(prev => ({ ...prev, temperature: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          placeholder="98.6"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Weight (kg)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          value={formData.weight}
                          onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                          placeholder="70.5"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Add Record
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {filteredRecords.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <FileText className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500">No health records found matching your criteria.</p>
        </motion.div>
      )}
    </div>
  );
}