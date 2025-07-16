import React, { useState } from 'react';
import { Search, CreditCard, DollarSign, TrendingUp, Calendar, User, CheckCircle, XCircle, Clock, Plus, FileText, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAuth } from '../../context/AuthContext';

interface Payment {
  id: string;
  patientName: string;
  doctorName: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'failed' | 'refunded';
  method: 'card' | 'cash' | 'insurance' | 'bank_transfer';
  description: string;
  invoiceId: string;
  transactionId?: string;
}

interface Invoice {
  id: string;
  patientName: string;
  doctorName: string;
  services: { name: string; amount: number }[];
  subtotal: number;
  tax: number;
  total: number;
  date: string;
  dueDate: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue';
}

const mockPayments: Payment[] = [
  {
    id: 'PAY001',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Smith',
    amount: 200,
    date: '2024-02-10',
    status: 'paid',
    method: 'card',
    description: 'Cardiology consultation',
    invoiceId: 'INV001',
    transactionId: 'TXN123456'
  },
  {
    id: 'PAY002',
    patientName: 'Emma Wilson',
    doctorName: 'Dr. Michael Johnson',
    amount: 150,
    date: '2024-02-09',
    status: 'pending',
    method: 'insurance',
    description: 'Neurology consultation',
    invoiceId: 'INV002'
  }
];

const mockInvoices: Invoice[] = [
  {
    id: 'INV001',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Smith',
    services: [
      { name: 'Cardiology Consultation', amount: 200 },
      { name: 'ECG Test', amount: 50 }
    ],
    subtotal: 250,
    tax: 25,
    total: 275,
    date: '2024-02-10',
    dueDate: '2024-02-25',
    status: 'paid'
  }
];

const mockPatients = ['John Doe', 'Emma Wilson', 'Robert Brown', 'Lisa Anderson', 'Michael Taylor'];
const mockDoctors = ['Dr. Sarah Smith', 'Dr. Michael Johnson', 'Dr. Emily Davis', 'Dr. Robert Wilson'];

const revenueData = [
  { month: 'Jan', revenue: 12500, transactions: 85 },
  { month: 'Feb', revenue: 15200, transactions: 102 },
  { month: 'Mar', revenue: 13800, transactions: 94 },
  { month: 'Apr', revenue: 16500, transactions: 118 },
  { month: 'May', revenue: 14200, transactions: 96 },
  { month: 'Jun', revenue: 18900, transactions: 135 },
];

const paymentMethodData = [
  { name: 'Credit Card', value: 45, color: '#3B82F6' },
  { name: 'Insurance', value: 30, color: '#10B981' },
  { name: 'Cash', value: 15, color: '#F59E0B' },
  { name: 'Bank Transfer', value: 10, color: '#8B5CF6' },
];

export function PaymentManagement() {
  const { user } = useAuth();
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [showProcessModal, setShowProcessModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'payments' | 'invoices'>('payments');

  const [paymentForm, setPaymentForm] = useState({
    patientName: '',
    doctorName: user?.role === 'doctor' ? user.name : '',
    amount: '',
    method: 'card' as const,
    description: ''
  });

  const [invoiceForm, setInvoiceForm] = useState({
    patientName: '',
    doctorName: user?.role === 'doctor' ? user.name : '',
    services: [{ name: '', amount: '' }]
  });

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    const matchesMethod = methodFilter === 'all' || payment.method === methodFilter;
    
    // Role-based filtering
    if (user?.role === 'patient') {
      return matchesSearch && matchesStatus && matchesMethod && payment.patientName === user.name;
    } else if (user?.role === 'doctor') {
      return matchesSearch && matchesStatus && matchesMethod && payment.doctorName === user.name;
    }
    
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newPayment: Payment = {
      id: 'PAY' + Date.now().toString().slice(-3),
      patientName: paymentForm.patientName,
      doctorName: paymentForm.doctorName,
      amount: parseFloat(paymentForm.amount),
      date: new Date().toISOString().split('T')[0],
      status: 'paid',
      method: paymentForm.method,
      description: paymentForm.description,
      invoiceId: 'INV' + Date.now().toString().slice(-3),
      transactionId: 'TXN' + Date.now().toString().slice(-6)
    };

    setPayments(prev => [newPayment, ...prev]);
    setShowProcessModal(false);
    setPaymentForm({
      patientName: '',
      doctorName: user?.role === 'doctor' ? user.name : '',
      amount: '',
      method: 'card',
      description: ''
    });
  };

  const handleGenerateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    
    const subtotal = invoiceForm.services.reduce((sum, service) => sum + parseFloat(service.amount || '0'), 0);
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;

    const newInvoice: Invoice = {
      id: 'INV' + Date.now().toString().slice(-3),
      patientName: invoiceForm.patientName,
      doctorName: invoiceForm.doctorName,
      services: invoiceForm.services.map(s => ({ name: s.name, amount: parseFloat(s.amount) })),
      subtotal,
      tax,
      total,
      date: new Date().toISOString().split('T')[0],
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 15 days
      status: 'draft'
    };

    setInvoices(prev => [newInvoice, ...prev]);
    setShowInvoiceModal(false);
    setInvoiceForm({
      patientName: '',
      doctorName: user?.role === 'doctor' ? user.name : '',
      services: [{ name: '', amount: '' }]
    });
  };

  const addService = () => {
    setInvoiceForm(prev => ({
      ...prev,
      services: [...prev.services, { name: '', amount: '' }]
    }));
  };

  const removeService = (index: number) => {
    setInvoiceForm(prev => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index)
    }));
  };

  const updateService = (index: number, field: 'name' | 'amount', value: string) => {
    setInvoiceForm(prev => ({
      ...prev,
      services: prev.services.map((service, i) => 
        i === index ? { ...service, [field]: value } : service
      )
    }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 border-green-200';
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'failed': return 'bg-red-100 text-red-800 border-red-200';
      case 'refunded': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'draft': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sent': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'overdue': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'paid': return <CheckCircle size={16} className="text-green-600" />;
      case 'pending': return <Clock size={16} className="text-yellow-600" />;
      case 'failed': return <XCircle size={16} className="text-red-600" />;
      case 'refunded': return <TrendingUp size={16} className="text-gray-600" />;
      default: return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getMethodIcon = (method: string) => {
    switch (method) {
      case 'card': return <CreditCard size={16} className="text-blue-600" />;
      case 'cash': return <DollarSign size={16} className="text-green-600" />;
      case 'insurance': return <CheckCircle size={16} className="text-purple-600" />;
      case 'bank_transfer': return <TrendingUp size={16} className="text-orange-600" />;
      default: return <DollarSign size={16} className="text-gray-600" />;
    }
  };

  const getStats = () => {
    const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0);
    const refundedAmount = payments.filter(p => p.status === 'refunded').reduce((sum, p) => sum + p.amount, 0);
    
    return {
      totalRevenue,
      pendingAmount,
      refundedAmount,
      totalTransactions: payments.length,
      paidTransactions: payments.filter(p => p.status === 'paid').length,
      pendingTransactions: payments.filter(p => p.status === 'pending').length,
      failedTransactions: payments.filter(p => p.status === 'failed').length,
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
            Payment Management
          </h2>
          <p className="text-gray-600 mt-1">Track payments, invoices, and financial transactions</p>
        </div>
        <div className="flex items-center space-x-3">
          {(user?.role === 'admin' || user?.role === 'doctor') && (
            <>
              <button 
                onClick={() => setShowProcessModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <DollarSign size={20} />
                <span>Process Payment</span>
              </button>
              <button 
                onClick={() => setShowInvoiceModal(true)}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <FileText size={20} />
                <span>Generate Invoice</span>
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
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-700">Total Revenue</p>
              <p className="text-3xl font-bold text-green-900">${stats.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="text-green-600" size={32} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-2xl border border-yellow-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-yellow-700">Pending</p>
              <p className="text-3xl font-bold text-yellow-900">${stats.pendingAmount.toLocaleString()}</p>
            </div>
            <Clock className="text-yellow-600" size={32} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-700">Transactions</p>
              <p className="text-3xl font-bold text-blue-900">{stats.totalTransactions}</p>
            </div>
            <CreditCard className="text-blue-600" size={32} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-700">Success Rate</p>
              <p className="text-3xl font-bold text-purple-900">
                {Math.round((stats.paidTransactions / stats.totalTransactions) * 100)}%
              </p>
            </div>
            <TrendingUp className="text-purple-600" size={32} />
          </div>
        </div>
      </motion.div>

      {/* Charts */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200/50">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Revenue Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="revenue" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200/50">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Payment Methods</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentMethodData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {paymentMethodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {paymentMethodData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200/50"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex space-x-1 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'payments'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Payments
            </button>
            <button
              onClick={() => setActiveTab('invoices')}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                activeTab === 'invoices'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Invoices
            </button>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            {activeTab === 'payments' && (
              <>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">All Status</option>
                  <option value="paid">Paid</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
                <select
                  value={methodFilter}
                  onChange={(e) => setMethodFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="all">All Methods</option>
                  <option value="card">Credit Card</option>
                  <option value="cash">Cash</option>
                  <option value="insurance">Insurance</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </select>
              </>
            )}
          </div>
        </div>

        {/* Payments Table */}
        {activeTab === 'payments' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Payment ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Patient</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Doctor</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Method</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPayments.map((payment, index) => (
                  <motion.tr
                    key={payment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <div>
                        <p className="font-medium text-gray-900">{payment.id}</p>
                        <p className="text-sm text-gray-500">Invoice: {payment.invoiceId}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User size={16} className="text-gray-600" />
                        </div>
                        <span className="font-medium text-gray-900">{payment.patientName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-900">{payment.doctorName}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-lg font-bold text-gray-900">${payment.amount}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        {getMethodIcon(payment.method)}
                        <span className="text-gray-900 capitalize">{payment.method.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border flex items-center space-x-1 w-fit ${getStatusColor(payment.status)}`}>
                        {getStatusIcon(payment.status)}
                        <span>{payment.status}</span>
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <Calendar size={14} className="text-gray-400" />
                        <span className="text-gray-900">{new Date(payment.date).toLocaleDateString()}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                          View
                        </button>
                        {payment.status === 'paid' && (
                          <button className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                            Receipt
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Invoices Table */}
        {activeTab === 'invoices' && (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Invoice ID</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Patient</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Doctor</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Amount</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Status</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Due Date</th>
                  <th className="text-left py-4 px-6 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {invoices.map((invoice, index) => (
                  <motion.tr
                    key={invoice.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * index }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-6">
                      <p className="font-medium text-gray-900">{invoice.id}</p>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-gray-900">{invoice.patientName}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-900">{invoice.doctorName}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-lg font-bold text-gray-900">${invoice.total}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-900">{new Date(invoice.date).toLocaleDateString()}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-900">{new Date(invoice.dueDate).toLocaleDateString()}</span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                          View
                        </button>
                        <button className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
                          Send
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      {/* Process Payment Modal */}
      <AnimatePresence>
        {showProcessModal && (
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
                  <h3 className="text-2xl font-bold text-gray-900">Process Payment</h3>
                  <button
                    onClick={() => setShowProcessModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleProcessPayment} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Patient *
                    </label>
                    <select
                      required
                      value={paymentForm.patientName}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, patientName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
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
                        value={paymentForm.doctorName}
                        onChange={(e) => setPaymentForm(prev => ({ ...prev, doctorName: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
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
                      Amount ($) *
                    </label>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={paymentForm.amount}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, amount: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                      placeholder="200.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Payment Method *
                    </label>
                    <select
                      required
                      value={paymentForm.method}
                      onChange={(e) => setPaymentForm(prev => ({ ...prev, method: e.target.value as any }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    >
                      <option value="card">Credit Card</option>
                      <option value="cash">Cash</option>
                      <option value="insurance">Insurance</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={paymentForm.description}
                    onChange={(e) => setPaymentForm(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                    placeholder="Description of services provided..."
                  />
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowProcessModal(false)}
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Process Payment
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generate Invoice Modal */}
      <AnimatePresence>
        {showInvoiceModal && (
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">Generate Invoice</h3>
                  <button
                    onClick={() => setShowInvoiceModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleGenerateInvoice} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Patient *
                    </label>
                    <select
                      required
                      value={invoiceForm.patientName}
                      onChange={(e) => setInvoiceForm(prev => ({ ...prev, patientName: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
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
                        value={invoiceForm.doctorName}
                        onChange={(e) => setInvoiceForm(prev => ({ ...prev, doctorName: e.target.value }))}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      >
                        <option value="">Select Doctor</option>
                        {mockDoctors.map(doctor => (
                          <option key={doctor} value={doctor}>{doctor}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">Services</h4>
                    <button
                      type="button"
                      onClick={addService}
                      className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      Add Service
                    </button>
                  </div>

                  <div className="space-y-4">
                    {invoiceForm.services.map((service, index) => (
                      <div key={index} className="p-4 border border-gray-200 rounded-xl">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="font-medium text-gray-900">Service {index + 1}</h5>
                          {invoiceForm.services.length > 1 && (
                            <button
                              type="button"
                              onClick={() => removeService(index)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <X size={16} />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Service Name *
                            </label>
                            <input
                              type="text"
                              required
                              value={service.name}
                              onChange={(e) => updateService(index, 'name', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="e.g., Consultation"
                            />
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Amount ($) *
                            </label>
                            <input
                              type="number"
                              required
                              min="0"
                              step="0.01"
                              value={service.amount}
                              onChange={(e) => updateService(index, 'amount', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="200.00"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowInvoiceModal(false)}
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Generate Invoice
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