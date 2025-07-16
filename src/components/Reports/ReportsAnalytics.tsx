import React, { useState } from 'react';
import { BarChart3, TrendingUp, Download, Calendar, Users, DollarSign, Activity, FileText, X, Printer } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const monthlyData = [
  { month: 'Jan', patients: 245, appointments: 320, revenue: 45000, satisfaction: 4.2 },
  { month: 'Feb', patients: 267, appointments: 380, revenue: 52000, satisfaction: 4.3 },
  { month: 'Mar', patients: 289, appointments: 340, revenue: 48000, satisfaction: 4.1 },
  { month: 'Apr', patients: 312, appointments: 420, revenue: 61000, satisfaction: 4.4 },
  { month: 'May', patients: 298, appointments: 390, revenue: 55000, satisfaction: 4.2 },
  { month: 'Jun', patients: 334, appointments: 450, revenue: 67000, satisfaction: 4.5 },
];

const departmentData = [
  { name: 'Cardiology', patients: 89, revenue: 23400, color: '#EF4444' },
  { name: 'Neurology', patients: 67, revenue: 18900, color: '#3B82F6' },
  { name: 'Pediatrics', patients: 123, revenue: 15600, color: '#10B981' },
  { name: 'Orthopedics', patients: 45, revenue: 12800, color: '#F59E0B' },
  { name: 'General Medicine', patients: 156, revenue: 19200, color: '#8B5CF6' },
];

const appointmentStatusData = [
  { name: 'Completed', value: 78, color: '#10B981' },
  { name: 'Scheduled', value: 15, color: '#3B82F6' },
  { name: 'Cancelled', value: 5, color: '#EF4444' },
  { name: 'No Show', value: 2, color: '#F59E0B' },
];

export function ReportsAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [selectedReport, setSelectedReport] = useState('overview');
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportType, setReportType] = useState<'financial' | 'patient' | 'operational' | 'custom'>('financial');

  const [reportForm, setReportForm] = useState({
    title: '',
    dateFrom: '',
    dateTo: '',
    includeCharts: true,
    includeDetails: true,
    format: 'pdf' as 'pdf' | 'excel' | 'csv'
  });

  const generateReport = (type: string) => {
    setReportType(type as any);
    setReportForm({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
      dateFrom: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      dateTo: new Date().toISOString().split('T')[0],
      includeCharts: true,
      includeDetails: true,
      format: 'pdf'
    });
    setShowReportModal(true);
  };

  const handleGenerateReport = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate report generation
    const reportData = {
      id: 'RPT' + Date.now().toString().slice(-6),
      type: reportType,
      title: reportForm.title,
      dateRange: `${reportForm.dateFrom} to ${reportForm.dateTo}`,
      format: reportForm.format,
      generatedAt: new Date().toISOString(),
      data: {
        summary: {
          totalPatients: 1825,
          totalRevenue: 328000,
          totalAppointments: 2300,
          averageSatisfaction: 4.3
        },
        charts: reportForm.includeCharts,
        details: reportForm.includeDetails
      }
    };

    // In a real app, this would trigger actual report generation
    console.log('Generating report:', reportData);
    
    // Simulate download
    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportData.title.replace(/\s+/g, '_')}_${reportData.id}.${reportForm.format}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setShowReportModal(false);
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
            Reports & Analytics
          </h2>
          <p className="text-gray-600 mt-1">Comprehensive insights and performance metrics</p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="1month">Last Month</option>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
          <button 
            onClick={() => generateReport('comprehensive')}
            className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            <Download size={20} />
            <span>Export Report</span>
          </button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
      >
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-700">Total Patients</p>
              <p className="text-3xl font-bold text-blue-900">1,825</p>
              <p className="text-sm text-blue-600 mt-1">+12% from last period</p>
            </div>
            <Users className="text-blue-600" size={32} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-green-700">Total Revenue</p>
              <p className="text-3xl font-bold text-green-900">$328K</p>
              <p className="text-sm text-green-600 mt-1">+18% from last period</p>
            </div>
            <DollarSign className="text-green-600" size={32} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-2xl border border-purple-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-purple-700">Appointments</p>
              <p className="text-3xl font-bold text-purple-900">2,300</p>
              <p className="text-sm text-purple-600 mt-1">+8% from last period</p>
            </div>
            <Calendar className="text-purple-600" size={32} />
          </div>
        </div>
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-orange-700">Satisfaction</p>
              <p className="text-3xl font-bold text-orange-900">4.3/5</p>
              <p className="text-sm text-orange-600 mt-1">+0.2 from last period</p>
            </div>
            <TrendingUp className="text-orange-600" size={32} />
          </div>
        </div>
      </motion.div>

      {/* Charts Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Monthly Trends */}
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200/50">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900">Monthly Trends</h3>
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Patients</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Revenue</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="patients" stroke="#3B82F6" strokeWidth={3} />
              <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Department Performance */}
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200/50">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Department Performance</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="patients" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Additional Charts */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Appointment Status Distribution */}
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200/50">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Appointment Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={appointmentStatusData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={120}
                paddingAngle={5}
                dataKey="value"
              >
                {appointmentStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {appointmentStatusData.map((item, index) => (
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

        {/* Patient Satisfaction Trend */}
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200/50">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Patient Satisfaction Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[3.5, 5]} />
              <Tooltip />
              <Area type="monotone" dataKey="satisfaction" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Report Generation Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-gray-200/50"
      >
        <h3 className="text-xl font-bold text-gray-900 mb-6">Generate Custom Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => generateReport('financial')}
            className="p-6 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left group hover:shadow-lg"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                <DollarSign className="text-green-600" size={24} />
              </div>
              <h4 className="font-semibold text-gray-900">Financial Report</h4>
            </div>
            <p className="text-sm text-gray-600">Revenue, payments, and financial analytics with detailed breakdowns</p>
          </button>
          
          <button 
            onClick={() => generateReport('patient')}
            className="p-6 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left group hover:shadow-lg"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Users className="text-blue-600" size={24} />
              </div>
              <h4 className="font-semibold text-gray-900">Patient Report</h4>
            </div>
            <p className="text-sm text-gray-600">Patient demographics, health metrics, and treatment outcomes</p>
          </button>
          
          <button 
            onClick={() => generateReport('operational')}
            className="p-6 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-left group hover:shadow-lg"
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                <Activity className="text-purple-600" size={24} />
              </div>
              <h4 className="font-semibold text-gray-900">Operational Report</h4>
            </div>
            <p className="text-sm text-gray-600">Appointments, efficiency metrics, and operational insights</p>
          </button>
        </div>
      </motion.div>

      {/* Department Details */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-200/50 overflow-hidden"
      >
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-xl font-bold text-gray-900">Department Performance Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Department</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Patients</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Revenue</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Avg. per Patient</th>
                <th className="text-left py-4 px-6 font-semibold text-gray-900">Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {departmentData.map((dept, index) => (
                <motion.tr
                  key={dept.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * index }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: dept.color }}></div>
                      <span className="font-medium text-gray-900">{dept.name}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-900">{dept.patients}</td>
                  <td className="py-4 px-6 text-gray-900">${dept.revenue.toLocaleString()}</td>
                  <td className="py-4 px-6 text-gray-900">${Math.round(dept.revenue / dept.patients)}</td>
                  <td className="py-4 px-6">
                    <span className="flex items-center space-x-1 text-green-600">
                      <TrendingUp size={14} />
                      <span>+{Math.floor(Math.random() * 20 + 5)}%</span>
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Generate Report Modal */}
      <AnimatePresence>
        {showReportModal && (
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
                  <h3 className="text-2xl font-bold text-gray-900">Generate Report</h3>
                  <button
                    onClick={() => setShowReportModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleGenerateReport} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Report Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={reportForm.title}
                    onChange={(e) => setReportForm(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter report title"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      From Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={reportForm.dateFrom}
                      onChange={(e) => setReportForm(prev => ({ ...prev, dateFrom: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      To Date *
                    </label>
                    <input
                      type="date"
                      required
                      value={reportForm.dateTo}
                      onChange={(e) => setReportForm(prev => ({ ...prev, dateTo: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Export Format *
                  </label>
                  <select
                    required
                    value={reportForm.format}
                    onChange={(e) => setReportForm(prev => ({ ...prev, format: e.target.value as any }))}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="excel">Excel Spreadsheet</option>
                    <option value="csv">CSV File</option>
                  </select>
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">Report Options</h4>
                  
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="includeCharts"
                      checked={reportForm.includeCharts}
                      onChange={(e) => setReportForm(prev => ({ ...prev, includeCharts: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="includeCharts" className="text-sm font-medium text-gray-700">
                      Include Charts and Graphs
                    </label>
                  </div>

                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      id="includeDetails"
                      checked={reportForm.includeDetails}
                      onChange={(e) => setReportForm(prev => ({ ...prev, includeDetails: e.target.checked }))}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="includeDetails" className="text-sm font-medium text-gray-700">
                      Include Detailed Data Tables
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowReportModal(false)}
                    className="px-6 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center space-x-2"
                  >
                    <Download size={20} />
                    <span>Generate & Download</span>
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