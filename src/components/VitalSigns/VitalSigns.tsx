import React, { useState } from 'react';
import { Plus, Heart, Activity, Thermometer, Weight, TrendingUp, TrendingDown, Calendar, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

interface VitalReading {
  id: string;
  patientName: string;
  type: 'blood_pressure' | 'heart_rate' | 'temperature' | 'weight' | 'blood_sugar' | 'oxygen_saturation';
  value: string;
  unit: string;
  date: string;
  time: string;
  status: 'normal' | 'high' | 'low' | 'critical';
  notes?: string;
}

const mockVitals: VitalReading[] = [
  {
    id: '1',
    patientName: 'John Doe',
    type: 'blood_pressure',
    value: '120/80',
    unit: 'mmHg',
    date: '2024-02-10',
    time: '09:30',
    status: 'normal',
    notes: 'Patient rested for 5 minutes before measurement'
  },
  {
    id: '2',
    patientName: 'Emma Wilson',
    type: 'heart_rate',
    value: '72',
    unit: 'BPM',
    date: '2024-02-10',
    time: '10:15',
    status: 'normal'
  },
  {
    id: '3',
    patientName: 'Robert Brown',
    type: 'temperature',
    value: '101.2',
    unit: '°F',
    date: '2024-02-10',
    time: '11:00',
    status: 'high',
    notes: 'Patient reported feeling feverish'
  }
];

const mockPatients = ['John Doe', 'Emma Wilson', 'Robert Brown', 'Lisa Anderson', 'Michael Taylor'];

const trendData = [
  { date: '2/1', bloodPressure: 118, heartRate: 68, temperature: 98.4, weight: 68.2 },
  { date: '2/3', bloodPressure: 122, heartRate: 72, temperature: 98.6, weight: 68.3 },
  { date: '2/5', bloodPressure: 120, heartRate: 70, temperature: 98.2, weight: 68.1 },
  { date: '2/7', bloodPressure: 125, heartRate: 75, temperature: 98.8, weight: 68.4 },
  { date: '2/9', bloodPressure: 119, heartRate: 69, temperature: 98.5, weight: 68.5 },
  { date: '2/10', bloodPressure: 120, heartRate: 72, temperature: 101.2, weight: 68.5 },
];

export function VitalSigns() {
  const [vitals, setVitals] = useState<VitalReading[]>(mockVitals);
  const [selectedVital, setSelectedVital] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const [formData, setFormData] = useState({
    patientName: '',
    type: 'blood_pressure' as const,
    value: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().slice(0, 5),
    notes: ''
  });

  const resetForm = () => {
    setFormData({
      patientName: '',
      type: 'blood_pressure',
      value: '',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().slice(0, 5),
      notes: ''
    });
  };

  const getVitalUnit = (type: string) => {
    switch (type) {
      case 'blood_pressure': return 'mmHg';
      case 'heart_rate': return 'BPM';
      case 'temperature': return '°F';
      case 'weight': return 'kg';
      case 'blood_sugar': return 'mg/dL';
      case 'oxygen_saturation': return '%';
      default: return '';
    }
  };

  const determineStatus = (type: string, value: string): 'normal' | 'high' | 'low' | 'critical' => {
    // Simple status determination logic
    switch (type) {
      case 'heart_rate':
        const hr = parseInt(value);
        if (hr < 60) return 'low';
        if (hr > 100) return 'high';
        return 'normal';
      case 'temperature':
        const temp = parseFloat(value);
        if (temp < 97) return 'low';
        if (temp > 99.5) return 'high';
        return 'normal';
      case 'blood_sugar':
        const bs = parseInt(value);
        if (bs < 70) return 'low';
        if (bs > 140) return 'high';
        return 'normal';
      default:
        return 'normal';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const vitalData: VitalReading = {
      id: Date.now().toString(),
      patientName: formData.patientName,
      type: formData.type,
      value: formData.value,
      unit: getVitalUnit(formData.type),
      date: formData.date,
      time: formData.time,
      status: determineStatus(formData.type, formData.value),
      notes: formData.notes || undefined
    };

    setVitals(prev => [vitalData, ...prev]);
    setShowAddModal(false);
    resetForm();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'bg-green-100 text-green-800 border-green-200';
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'low': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'critical': return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getVitalIcon = (type: string) => {
    switch (type) {
      case 'blood_pressure': return <Heart size={24} className="text-red-500" />;
      case 'heart_rate': return <Activity size={24} className="text-pink-500" />;
      case 'temperature': return <Thermometer size={24} className="text-orange-500" />;
      case 'weight': return <Weight size={24} className="text-blue-500" />;
      case 'blood_sugar': return <Activity size={24} className="text-purple-500" />;
      case 'oxygen_saturation': return <Heart size={24} className="text-cyan-500" />;
      default: return <Activity size={24} className="text-gray-500" />;
    }
  };

  const getVitalStats = () => {
    const stats = {
      normal: vitals.filter(v => v.status === 'normal').length,
      high: vitals.filter(v => v.status === 'high').length,
      low: vitals.filter(v => v.status === 'low').length,
      critical: vitals.filter(v => v.status === 'critical').length,
    };
    return stats;
  };

  const stats = getVitalStats();

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
            Vital Signs Monitoring
          </h2>
          <p className="text-gray-600 mt-1">Track and analyze patient vital signs and health metrics</p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus size={20} />
          <span>Record Vitals</span>
        </button>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-700">Normal</p>
              <p className="text-3xl font-bold text-green-900">{stats.normal}</p>
            </div>
            <TrendingUp className="text-green-600" size={32} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-red-700">High</p>
              <p className="text-3xl font-bold text-red-900">{stats.high}</p>
            </div>
            <TrendingUp className="text-red-600" size={32} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-700">Low</p>
              <p className="text-3xl font-bold text-blue-900">{stats.low}</p>
            </div>
            <TrendingDown className="text-blue-600" size={32} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-700">Critical</p>
              <p className="text-3xl font-bold text-purple-900">{stats.critical}</p>
            </div>
            <Activity className="text-purple-600" size={32} />
          </div>
        </div>
      </motion.div>

      {/* Trends Charts */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Blood Pressure & Heart Rate</h3>
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Blood Pressure</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-pink-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Heart Rate</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="bloodPressure" stroke="#EF4444" strokeWidth={3} />
              <Line type="monotone" dataKey="heartRate" stroke="#EC4899" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Temperature & Weight</h3>
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Temperature</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Weight</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="temperature" stroke="#F97316" strokeWidth={3} />
              <Line type="monotone" dataKey="weight" stroke="#3B82F6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Recent Readings */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Recent Vital Signs</h3>
            <select
              value={selectedVital}
              onChange={(e) => setSelectedVital(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
            >
              <option value="all">All Vitals</option>
              <option value="blood_pressure">Blood Pressure</option>
              <option value="heart_rate">Heart Rate</option>
              <option value="temperature">Temperature</option>
              <option value="weight">Weight</option>
              <option value="blood_sugar">Blood Sugar</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {vitals
            .filter(vital => selectedVital === 'all' || vital.type === selectedVital)
            .map((vital, index) => (
            <motion.div
              key={vital.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-gray-50 rounded-xl">
                    {getVitalIcon(vital.type)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-3 mb-1">
                      <h4 className="font-bold text-gray-900 capitalize">
                        {vital.type.replace('_', ' ')}
                      </h4>
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(vital.status)}`}>
                        {vital.status}
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">
                      {vital.value} <span className="text-sm font-normal text-gray-500">{vital.unit}</span>
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                      <span className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{new Date(vital.date).toLocaleDateString()} at {vital.time}</span>
                      </span>
                      <span>Patient: {vital.patientName}</span>
                    </div>
                    {vital.notes && (
                      <p className="text-sm text-gray-600 mt-2 italic">{vital.notes}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    vital.status === 'normal' ? 'bg-green-100 text-green-800' :
                    vital.status === 'high' ? 'bg-red-100 text-red-800' :
                    vital.status === 'low' ? 'bg-blue-100 text-blue-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {vital.status === 'normal' && <TrendingUp size={14} className="mr-1" />}
                    {vital.status === 'high' && <TrendingUp size={14} className="mr-1" />}
                    {vital.status === 'low' && <TrendingDown size={14} className="mr-1" />}
                    {vital.status === 'critical' && <Activity size={14} className="mr-1" />}
                    {vital.status}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Add Vital Signs Modal */}
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
                  <h3 className="text-2xl font-bold text-gray-900">Record Vital Signs</h3>
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Patient</option>
                      {mockPatients.map(patient => (
                        <option key={patient} value={patient}>{patient}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Vital Sign Type *
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="blood_pressure">Blood Pressure</option>
                      <option value="heart_rate">Heart Rate</option>
                      <option value="temperature">Temperature</option>
                      <option value="weight">Weight</option>
                      <option value="blood_sugar">Blood Sugar</option>
                      <option value="oxygen_saturation">Oxygen Saturation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Value *
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        value={formData.value}
                        onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                        placeholder={
                          formData.type === 'blood_pressure' ? '120/80' :
                          formData.type === 'heart_rate' ? '72' :
                          formData.type === 'temperature' ? '98.6' :
                          formData.type === 'weight' ? '70.5' :
                          formData.type === 'blood_sugar' ? '95' :
                          '98'
                        }
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                        {getVitalUnit(formData.type)}
                      </span>
                    </div>
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    />
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
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                    placeholder="Any additional notes about this reading..."
                  />
                </div>

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
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl hover:from-red-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Record Vital Signs
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}