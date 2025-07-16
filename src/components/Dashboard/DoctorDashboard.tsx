import React from 'react';
import { Calendar, Users, Clock, DollarSign, Video, FileText } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const appointmentData = [
  { day: 'Mon', appointments: 12, consultations: 8 },
  { day: 'Tue', appointments: 15, consultations: 12 },
  { day: 'Wed', appointments: 8, consultations: 6 },
  { day: 'Thu', appointments: 18, consultations: 14 },
  { day: 'Fri', appointments: 22, consultations: 18 },
  { day: 'Sat', appointments: 6, consultations: 4 },
  { day: 'Sun', appointments: 3, consultations: 2 },
];

const appointmentTypeData = [
  { name: 'Consultation', value: 45, color: '#3B82F6' },
  { name: 'Follow-up', value: 30, color: '#10B981' },
  { name: 'Emergency', value: 15, color: '#F59E0B' },
  { name: 'Video Call', value: 10, color: '#8B5CF6' },
];

export function DoctorDashboard() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Patients</p>
              <p className="text-3xl font-bold text-gray-900">247</p>
              <p className="text-sm text-green-600 mt-1">+5 new this week</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
              <p className="text-3xl font-bold text-gray-900">12</p>
              <p className="text-sm text-orange-600 mt-1">3 upcoming</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-green-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Consultation</p>
              <p className="text-3xl font-bold text-gray-900">45m</p>
              <p className="text-sm text-gray-600 mt-1">Per patient</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Clock className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Week's Revenue</p>
              <p className="text-3xl font-bold text-gray-900">$3,240</p>
              <p className="text-sm text-green-600 mt-1">+18% from last week</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Today's Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Weekly Appointments</h3>
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Scheduled</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Completed</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={appointmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="appointments" stroke="#3B82F6" strokeWidth={2} />
              <Line type="monotone" dataKey="consultations" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Appointment Types</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={appointmentTypeData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {appointmentTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {appointmentTypeData.map((item, index) => (
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
      </div>

      {/* Today's Schedule and Recent Patients */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Today's Schedule</h3>
          </div>
          <div className="p-6 space-y-4">
            {[
              { time: '09:00', patient: 'John Smith', type: 'Consultation', status: 'completed' },
              { time: '10:30', patient: 'Emma Johnson', type: 'Follow-up', status: 'completed' },
              { time: '11:45', patient: 'Michael Brown', type: 'Video Call', status: 'upcoming' },
              { time: '14:00', patient: 'Sarah Davis', type: 'Consultation', status: 'upcoming' },
              { time: '15:30', patient: 'Robert Wilson', type: 'Emergency', status: 'upcoming' },
            ].map((appointment, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">{appointment.time}</div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{appointment.patient}</p>
                    <p className="text-sm text-gray-500">{appointment.type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    appointment.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {appointment.status}
                  </span>
                  {appointment.type === 'Video Call' && (
                    <button className="p-1.5 text-purple-600 hover:bg-purple-50 rounded-lg">
                      <Video size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Patient Records</h3>
          </div>
          <div className="p-6 space-y-4">
            {[
              { name: 'Alice Cooper', lastVisit: '2 days ago', condition: 'Hypertension', status: 'stable' },
              { name: 'Mark Johnson', lastVisit: '5 days ago', condition: 'Diabetes', status: 'monitoring' },
              { name: 'Lisa Anderson', lastVisit: '1 week ago', condition: 'Migraine', status: 'improved' },
              { name: 'Tom Wilson', lastVisit: '2 weeks ago', condition: 'Back Pain', status: 'follow-up' },
            ].map((patient, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-700">
                      {patient.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{patient.name}</p>
                    <p className="text-sm text-gray-500">{patient.condition} • {patient.lastVisit}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    patient.status === 'stable' ? 'bg-green-100 text-green-800' :
                    patient.status === 'improved' ? 'bg-blue-100 text-blue-800' :
                    patient.status === 'monitoring' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-orange-100 text-orange-800'
                  }`}>
                    {patient.status}
                  </span>
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg">
                    <FileText size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}