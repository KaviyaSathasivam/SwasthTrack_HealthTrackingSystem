import React, { useState } from 'react';
import { Bell, Check, X, Calendar, Heart, CreditCard, User, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Notification {
  id: string;
  type: 'appointment' | 'payment' | 'health' | 'system' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  actionUrl?: string;
  metadata?: any;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'appointment',
    title: 'Upcoming Appointment',
    message: 'You have an appointment with Dr. Sarah Smith tomorrow at 2:30 PM',
    timestamp: '2024-02-10T10:30:00',
    read: false,
    priority: 'high',
    actionUrl: '/appointments',
    metadata: { doctorName: 'Dr. Sarah Smith', time: '2:30 PM' }
  },
  {
    id: '2',
    type: 'payment',
    title: 'Payment Received',
    message: 'Payment of $200 has been successfully processed for your consultation',
    timestamp: '2024-02-10T09:15:00',
    read: false,
    priority: 'medium',
    actionUrl: '/payments',
    metadata: { amount: 200, paymentId: 'PAY001' }
  },
  {
    id: '3',
    type: 'health',
    title: 'Lab Results Available',
    message: 'Your blood test results are now available for review',
    timestamp: '2024-02-09T16:45:00',
    read: true,
    priority: 'high',
    actionUrl: '/health-records',
    metadata: { testType: 'Blood Test' }
  },
  {
    id: '4',
    type: 'reminder',
    title: 'Medication Reminder',
    message: 'Time to take your evening medication - Lisinopril 10mg',
    timestamp: '2024-02-09T20:00:00',
    read: false,
    priority: 'urgent',
    actionUrl: '/prescriptions',
    metadata: { medication: 'Lisinopril', dosage: '10mg' }
  },
  {
    id: '5',
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance will occur tonight from 2:00 AM to 4:00 AM',
    timestamp: '2024-02-09T14:20:00',
    read: true,
    priority: 'low',
    metadata: { maintenanceWindow: '2:00 AM - 4:00 AM' }
  },
  {
    id: '6',
    type: 'appointment',
    title: 'Appointment Confirmed',
    message: 'Your appointment with Dr. Michael Johnson has been confirmed for Feb 15th',
    timestamp: '2024-02-09T11:30:00',
    read: false,
    priority: 'medium',
    actionUrl: '/appointments',
    metadata: { doctorName: 'Dr. Michael Johnson', date: 'Feb 15th' }
  }
];

export function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<string>('all');

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !notif.read;
    return notif.type === filter;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'appointment': return <Calendar size={20} className="text-blue-600" />;
      case 'payment': return <CreditCard size={20} className="text-green-600" />;
      case 'health': return <Heart size={20} className="text-red-600" />;
      case 'reminder': return <Bell size={20} className="text-orange-600" />;
      case 'system': return <Info size={20} className="text-gray-600" />;
      default: return <Bell size={20} className="text-gray-600" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'border-l-red-500 bg-red-50';
      case 'high': return 'border-l-orange-500 bg-orange-50';
      case 'medium': return 'border-l-blue-500 bg-blue-50';
      case 'low': return 'border-l-gray-500 bg-gray-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

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
            Notification Center
          </h2>
          <p className="text-gray-600 mt-1">Stay updated with important alerts and reminders</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {unreadCount} unread
          </span>
          <button 
            onClick={markAllAsRead}
            className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <CheckCircle size={20} />
            <span>Mark All Read</span>
          </button>
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
              <p className="text-sm font-semibold text-blue-700">Total</p>
              <p className="text-3xl font-bold text-blue-900">{notifications.length}</p>
            </div>
            <Bell className="text-blue-600" size={32} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-orange-700">Unread</p>
              <p className="text-3xl font-bold text-orange-900">{unreadCount}</p>
            </div>
            <AlertTriangle className="text-orange-600" size={32} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-red-700">Urgent</p>
              <p className="text-3xl font-bold text-red-900">
                {notifications.filter(n => n.priority === 'urgent').length}
              </p>
            </div>
            <Heart className="text-red-600" size={32} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-700">Health</p>
              <p className="text-3xl font-bold text-green-900">
                {notifications.filter(n => n.type === 'health').length}
              </p>
            </div>
            <Heart className="text-green-600" size={32} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-700">Appointments</p>
              <p className="text-3xl font-bold text-purple-900">
                {notifications.filter(n => n.type === 'appointment').length}
              </p>
            </div>
            <Calendar className="text-purple-600" size={32} />
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200/50"
      >
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All Notifications' },
            { key: 'unread', label: 'Unread' },
            { key: 'appointment', label: 'Appointments' },
            { key: 'health', label: 'Health' },
            { key: 'payment', label: 'Payments' },
            { key: 'reminder', label: 'Reminders' },
            { key: 'system', label: 'System' },
          ].map(filterOption => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                filter === filterOption.key
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filterOption.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Notifications List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="space-y-4"
      >
        {filteredNotifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * index }}
            className={`bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border-l-4 overflow-hidden hover:shadow-xl transition-all duration-300 ${
              getPriorityColor(notification.priority)
            } ${!notification.read ? 'border-r-4 border-r-blue-500' : ''}`}
          >
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="p-3 bg-white rounded-xl shadow-sm">
                    {getTypeIcon(notification.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className={`text-lg font-bold ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                        {notification.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full border ${getPriorityBadge(notification.priority)}`}>
                        {notification.priority}
                      </span>
                      {!notification.read && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                    <p className={`text-gray-600 mb-3 ${!notification.read ? 'font-medium' : ''}`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{new Date(notification.timestamp).toLocaleString()}</span>
                      <span className="capitalize">{notification.type}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2 ml-4">
                  {!notification.read && (
                    <button
                      onClick={() => markAsRead(notification.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Mark as read"
                    >
                      <Check size={16} />
                    </button>
                  )}
                  <button
                    onClick={() => deleteNotification(notification.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete notification"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
              
              {notification.actionUrl && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium">
                    View Details
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {filteredNotifications.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <Bell className="mx-auto text-gray-400 mb-4" size={48} />
          <p className="text-gray-500">No notifications found matching your criteria.</p>
        </motion.div>
      )}
    </div>
  );
}