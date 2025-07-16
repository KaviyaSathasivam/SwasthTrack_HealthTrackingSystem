import React, { useState } from 'react';
import { Calendar, Clock, Search, Filter, Plus, Video, CheckCircle, XCircle, Eye, X, User, CreditCard, DollarSign } from 'lucide-react';
import { format, parseISO, isToday, isTomorrow } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { useData } from '../../context/DataContext';
import { useAuth } from '../../context/AuthContext';

export function AppointmentList() {
  const { user } = useAuth();
  const { appointments, patients, doctors, addAppointment, addPayment, updateAppointment } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState<any>(null);
  const [selectedAppointmentForPayment, setSelectedAppointmentForPayment] = useState<any>(null);

  const [formData, setFormData] = useState({
    patientName: '',
    doctorName: user?.role === 'doctor' ? user.name : '',
    date: '',
    time: '',
    type: 'consultation' as const,
    reason: '',
    duration: '30',
    fee: '150'
  });

  const [paymentData, setPaymentData] = useState({
    paymentMethod: 'card' as const,
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    billingAddress: '',
    insuranceProvider: '',
    policyNumber: ''
  });

  const filteredAppointments = appointments.filter(appointment => {
    const matchesSearch = appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appointment.reason.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || appointment.status === statusFilter;
    const matchesType = typeFilter === 'all' || appointment.type === typeFilter;
    
    let matchesDate = true;
    if (dateFilter === 'today') {
      matchesDate = isToday(parseISO(appointment.date));
    } else if (dateFilter === 'tomorrow') {
      matchesDate = isTomorrow(parseISO(appointment.date));
    }

    // Role-based filtering
    if (user?.role === 'patient') {
      return matchesSearch && matchesStatus && matchesType && matchesDate && appointment.patientName === user.name;
    } else if (user?.role === 'doctor') {
      return matchesSearch && matchesStatus && matchesType && matchesDate && appointment.doctorName === user.name;
    }
    
    return matchesSearch && matchesStatus && matchesType && matchesDate;
  });

  const resetForm = () => {
    setFormData({
      patientName: '',
      doctorName: user?.role === 'doctor' ? user.name : '',
      date: '',
      time: '',
      type: 'consultation',
      reason: '',
      duration: '30',
      fee: '150'
    });
    setEditingAppointment(null);
  };

  const resetPaymentForm = () => {
    setPaymentData({
      paymentMethod: 'card',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: '',
      billingAddress: '',
      insuranceProvider: '',
      policyNumber: ''
    });
  };

  const handleAddAppointment = () => {
    setShowAddModal(true);
    resetForm();
  };

  const handlePayment = (appointment: any) => {
    setSelectedAppointmentForPayment(appointment);
    setShowPaymentModal(true);
    resetPaymentForm();
  };

  const processPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAppointmentForPayment) return;

    const transactionId = 'TXN' + Date.now().toString().slice(-6);
    
    // Update appointment payment status
    updateAppointment(selectedAppointmentForPayment.id, {
      paymentStatus: 'paid',
      paymentMethod: paymentData.paymentMethod,
      transactionId: transactionId
    });

    // Add payment record
    addPayment({
      patientName: selectedAppointmentForPayment.patientName,
      doctorName: selectedAppointmentForPayment.doctorName,
      amount: selectedAppointmentForPayment.fee,
      date: new Date().toISOString().split('T')[0],
      status: 'paid',
      method: paymentData.paymentMethod,
      description: `Payment for ${selectedAppointmentForPayment.type} appointment`,
      invoiceId: 'INV' + Date.now().toString().slice(-6),
      transactionId: transactionId
    });

    setShowPaymentModal(false);
    setSelectedAppointmentForPayment(null);
    resetPaymentForm();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const appointmentData = {
      patientName: formData.patientName,
      doctorName: formData.doctorName,
      date: formData.date,
      time: formData.time,
      type: formData.type,
      reason: formData.reason,
      duration: parseInt(formData.duration),
      fee: parseInt(formData.fee),
      status: 'scheduled' as const,
      paymentStatus: 'pending' as const
    };

    addAppointment(appointmentData);
    setShowAddModal(false);
    resetForm();
  };

  const handleStatusChange = (id: string, newStatus: 'confirmed' | 'cancelled') => {
    updateAppointment(id, { status: newStatus });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'consultation': return 'bg-blue-100 text-blue-800';
      case 'followup': return 'bg-green-100 text-green-800';
      case 'emergency': return 'bg-red-100 text-red-800';
      case 'video': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'refunded': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodIcon = (method?: string) => {
    switch (method) {
      case 'card': return <CreditCard size={14} className="text-blue-600" />;
      case 'cash': return <DollarSign size={14} className="text-green-600" />;
      case 'insurance': return <CheckCircle size={14} className="text-purple-600" />;
      case 'bank_transfer': return <CreditCard size={14} className="text-orange-600" />;
      default: return <DollarSign size={14} className="text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Appointment Management
          </h2>
          <p className="text-gray-600">
            {user?.role === 'patient' ? 'View and manage your appointments' : 'Schedule and manage patient appointments with integrated payment processing'}
          </p>
        </div>
        {(user?.role === 'admin' || user?.role === 'doctor') && (
          <button 
            onClick={handleAddAppointment}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Plus size={20} />
            <span>New Appointment</span>
          </button>
        )}
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200/50"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-5 gap-4">
          <div className="xl:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search appointments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Types</option>
            <option value="consultation">Consultation</option>
            <option value="followup">Follow-up</option>
            <option value="emergency">Emergency</option>
            <option value="video">Video Call</option>
          </select>
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Dates</option>
            <option value="today">Today</option>
            <option value="tomorrow">Tomorrow</option>
          </select>
        </div>
      </motion.div>

      {/* Appointment Stats */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-5 gap-6"
      >
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
          <div className="text-center">
            <p className="text-3xl font-bold text-blue-900">{appointments.filter(a => a.status === 'scheduled').length}</p>
            <p className="text-sm font-semibold text-blue-700">Scheduled</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
          <div className="text-center">
            <p className="text-3xl font-bold text-green-900">{appointments.filter(a => a.status === 'confirmed').length}</p>
            <p className="text-sm font-semibold text-green-700">Confirmed</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-2xl border border-gray-200">
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-900">{appointments.filter(a => a.status === 'completed').length}</p>
            <p className="text-sm font-semibold text-gray-700">Completed</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl border border-yellow-200">
          <div className="text-center">
            <p className="text-3xl font-bold text-yellow-900">{appointments.filter(a => a.paymentStatus === 'pending').length}</p>
            <p className="text-sm font-semibold text-yellow-700">Payment Pending</p>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-900">${appointments.filter(a => a.paymentStatus === 'paid').reduce((sum, a) => sum + a.fee, 0)}</p>
            <p className="text-sm font-semibold text-purple-700">Revenue Collected</p>
          </div>
        </div>
      </motion.div>

      {/* Appointments Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Patient</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Doctor</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Date & Time</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Type</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Reason</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Payment</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAppointments.map((appointment, index) => (
                <motion.tr 
                  key={appointment.id} 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                        {appointment.patientName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{appointment.patientName}</p>
                        <p className="text-sm text-gray-500">ID: {appointment.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-900">{appointment.doctorName}</p>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-900">{format(parseISO(appointment.date), 'MMM d, yyyy')}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock size={14} className="text-gray-400" />
                        <span className="text-sm text-gray-900">{appointment.time} ({appointment.duration}min)</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(appointment.type)}`}>
                        {appointment.type.charAt(0).toUpperCase() + appointment.type.slice(1)}
                      </span>
                      {appointment.type === 'video' && (
                        <Video size={14} className="text-purple-600" />
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <p className="text-sm text-gray-900">{appointment.reason}</p>
                  </td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4 px-6">
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-900">${appointment.fee}</p>
                      <div className="flex items-center space-x-1">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(appointment.paymentStatus)}`}>
                          {appointment.paymentStatus.charAt(0).toUpperCase() + appointment.paymentStatus.slice(1)}
                        </span>
                        {appointment.paymentMethod && (
                          <div className="flex items-center space-x-1">
                            {getPaymentMethodIcon(appointment.paymentMethod)}
                          </div>
                        )}
                      </div>
                      {appointment.transactionId && (
                        <p className="text-xs text-gray-500">ID: {appointment.transactionId}</p>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-2">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Eye size={16} />
                      </button>
                      {appointment.paymentStatus === 'pending' && user?.role !== 'patient' && (
                        <button 
                          onClick={() => handlePayment(appointment)}
                          className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                          title="Process Payment"
                        >
                          <CreditCard size={16} />
                        </button>
                      )}
                      {appointment.status === 'scheduled' && user?.role !== 'patient' && (
                        <>
                          <button 
                            onClick={() => handleStatusChange(appointment.id, 'confirmed')}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button 
                            onClick={() => handleStatusChange(appointment.id, 'cancelled')}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      {appointment.type === 'video' && appointment.status !== 'cancelled' && (
                        <button className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                          <Video size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredAppointments.length === 0 && (
          <div className="text-center py-12">
            <Calendar className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-500">No appointments found matching your criteria.</p>
          </div>
        )}
      </motion.div>

      {/* Add/Edit Appointment Modal */}
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
                  <h3 className="text-2xl font-bold text-gray-900">Schedule New Appointment</h3>
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="">Select Patient</option>
                      {patients.map(patient => (
                        <option key={patient.id} value={patient.name}>{patient.name}</option>
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
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select Doctor</option>
                        {doctors.map(doctor => (
                          <option key={doctor.id} value={doctor.name}>{doctor.name}</option>
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Appointment Type *
                    </label>
                    <select
                      required
                      value={formData.type}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="consultation">Consultation</option>
                      <option value="followup">Follow-up</option>
                      <option value="emergency">Emergency</option>
                      <option value="video">Video Call</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Duration (minutes) *
                    </label>
                    <select
                      required
                      value={formData.duration}
                      onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="45">45 minutes</option>
                      <option value="60">60 minutes</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Consultation Fee ($) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={formData.fee}
                      onChange={(e) => setFormData(prev => ({ ...prev, fee: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="150"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Reason for Visit *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={formData.reason}
                    onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Describe the reason for this appointment..."
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <div className="flex items-center space-x-2">
                    <CreditCard className="text-yellow-600" size={20} />
                    <p className="text-sm font-medium text-yellow-800">
                      Payment will be required for this appointment
                    </p>
                  </div>
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
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Schedule Appointment
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && selectedAppointmentForPayment && (
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
                  <h3 className="text-2xl font-bold text-gray-900">Payment for Appointment</h3>
                  <button
                    onClick={() => setShowPaymentModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <div className="p-6">
                {/* Appointment Summary */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Appointment Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Patient:</span>
                      <span className="ml-2 font-medium">{selectedAppointmentForPayment.patientName}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Doctor:</span>
                      <span className="ml-2 font-medium">{selectedAppointmentForPayment.doctorName}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Date:</span>
                      <span className="ml-2 font-medium">{format(parseISO(selectedAppointmentForPayment.date), 'MMM d, yyyy')}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Time:</span>
                      <span className="ml-2 font-medium">{selectedAppointmentForPayment.time}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-600">Amount:</span>
                      <span className="ml-2 font-bold text-lg text-green-600">${selectedAppointmentForPayment.fee}</span>
                    </div>
                  </div>
                </div>

                <form onSubmit={processPayment} className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      Payment Method *
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setPaymentData(prev => ({ ...prev, paymentMethod: 'card' }))}
                        className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                          paymentData.paymentMethod === 'card'
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <CreditCard className="mx-auto mb-2 text-blue-600" size={24} />
                        <p className="text-sm font-medium">Credit/Debit Card</p>
                      </button>
                      <button
                        type="button"
                        onClick={() => setPaymentData(prev => ({ ...prev, paymentMethod: 'insurance' }))}
                        className={`p-4 border-2 rounded-xl transition-all duration-200 ${
                          paymentData.paymentMethod === 'insurance'
                            ? 'border-purple-500 bg-purple-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <CheckCircle className="mx-auto mb-2 text-purple-600" size={24} />
                        <p className="text-sm font-medium">Insurance</p>
                      </button>
                    </div>
                  </div>

                  {paymentData.paymentMethod === 'card' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Cardholder Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={paymentData.cardholderName}
                          onChange={(e) => setPaymentData(prev => ({ ...prev, cardholderName: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Card Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={paymentData.cardNumber}
                          onChange={(e) => setPaymentData(prev => ({ ...prev, cardNumber: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="1234 5678 9012 3456"
                          maxLength={19}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Expiry Date *
                          </label>
                          <input
                            type="text"
                            required
                            value={paymentData.expiryDate}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, expiryDate: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="MM/YY"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            CVV *
                          </label>
                          <input
                            type="text"
                            required
                            value={paymentData.cvv}
                            onChange={(e) => setPaymentData(prev => ({ ...prev, cvv: e.target.value }))}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                            placeholder="123"
                            maxLength={4}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Billing Address *
                        </label>
                        <textarea
                          required
                          rows={2}
                          value={paymentData.billingAddress}
                          onChange={(e) => setPaymentData(prev => ({ ...prev, billingAddress: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                          placeholder="123 Main St, City, State, ZIP"
                        />
                      </div>
                    </div>
                  )}

                  {paymentData.paymentMethod === 'insurance' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Insurance Provider *
                        </label>
                        <select
                          required
                          value={paymentData.insuranceProvider}
                          onChange={(e) => setPaymentData(prev => ({ ...prev, insuranceProvider: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                        >
                          <option value="">Select Insurance Provider</option>
                          <option value="blue-cross">Blue Cross Blue Shield</option>
                          <option value="aetna">Aetna</option>
                          <option value="cigna">Cigna</option>
                          <option value="united">United Healthcare</option>
                          <option value="humana">Humana</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Policy Number *
                        </label>
                        <input
                          type="text"
                          required
                          value={paymentData.policyNumber}
                          onChange={(e) => setPaymentData(prev => ({ ...prev, policyNumber: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          placeholder="Policy number"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowPaymentModal(false)}
                      className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                    >
                      <CreditCard size={20} />
                      <span>Pay ${selectedAppointmentForPayment.fee}</span>
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}