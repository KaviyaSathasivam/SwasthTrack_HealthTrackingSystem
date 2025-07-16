import React from 'react';
import { Calendar, Heart, Activity, Pill, Clock, AlertCircle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

const vitalsData = [
  { date: '1/1', bloodPressure: 120, heartRate: 72, weight: 70 },
  { date: '1/7', bloodPressure: 118, heartRate: 68, weight: 69.8 },
  { date: '1/14', bloodPressure: 122, heartRate: 75, weight: 70.2 },
  { date: '1/21', bloodPressure: 115, heartRate: 70, weight: 69.5 },
  { date: '1/28', bloodPressure: 119, heartRate: 73, weight: 69.7 },
  { date: '2/4', bloodPressure: 117, heartRate: 71, weight: 69.3 },
];

const medicationSchedule = [
  { time: '08:00', medication: 'Lisinopril', dosage: '10mg', taken: true },
  { time: '12:00', medication: 'Metformin', dosage: '500mg', taken: true },
  { time: '18:00', medication: 'Lisinopril', dosage: '10mg', taken: false },
  { time: '22:00', medication: 'Vitamin D', dosage: '1000IU', taken: false },
];

export function PatientDashboard() {
  return (
    <div className="space-y-6">
      {/* Health Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Blood Pressure</p>
              <p className="text-2xl font-bold text-gray-900">117/78</p>
              <p className="text-sm text-green-600 mt-1">Normal range</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Heart className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Heart Rate</p>
              <p className="text-2xl font-bold text-gray-900">71 BPM</p>
              <p className="text-sm text-green-600 mt-1">Resting rate</p>
            </div>
            <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center">
              <Activity className="text-pink-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Weight</p>
              <p className="text-2xl font-bold text-gray-900">69.3 kg</p>
              <p className="text-sm text-blue-600 mt-1">-0.7 kg this month</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Activity className="text-blue-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Next Appointment</p>
              <p className="text-2xl font-bold text-gray-900">Feb 15</p>
              <p className="text-sm text-gray-600 mt-1">Dr. Sarah Smith</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Calendar className="text-green-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Health Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Vital Signs Trends</h3>
            <div className="flex space-x-4 text-sm">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Blood Pressure</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span className="text-gray-600">Heart Rate</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={vitalsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="bloodPressure" stroke="#EF4444" strokeWidth={2} />
              <Line type="monotone" dataKey="heartRate" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Weight Progress</h3>
            <span className="text-sm text-gray-500">Last 6 weeks</span>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={vitalsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={['dataMin - 1', 'dataMax + 1']} />
              <Tooltip />
              <Area type="monotone" dataKey="weight" stroke="#10B981" fill="#10B981" fillOpacity={0.2} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Medication Schedule and Upcoming Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Today's Medications</h3>
              <Pill className="text-purple-600" size={20} />
            </div>
          </div>
          <div className="p-6 space-y-4">
            {medicationSchedule.map((med, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="text-center">
                    <div className="text-sm font-medium text-gray-900">{med.time}</div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{med.medication}</p>
                    <p className="text-sm text-gray-500">{med.dosage}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {med.taken ? (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                      Taken
                    </span>
                  ) : (
                    <button className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors">
                      Mark Taken
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Upcoming Appointments</h3>
          </div>
          <div className="p-6 space-y-4">
            {[
              { date: 'Feb 15, 2024', time: '10:30 AM', doctor: 'Dr. Sarah Smith', type: 'Follow-up', location: 'Cardiology Clinic' },
              { date: 'Feb 22, 2024', time: '2:00 PM', doctor: 'Dr. Michael Johnson', type: 'Lab Results', location: 'General Medicine' },
              { date: 'Mar 1, 2024', time: '9:00 AM', doctor: 'Dr. Sarah Smith', type: 'Routine Check', location: 'Cardiology Clinic' },
            ].map((appointment, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Calendar className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{appointment.doctor}</p>
                    <p className="text-sm text-gray-500">{appointment.type} • {appointment.location}</p>
                    <p className="text-xs text-gray-400">{appointment.date} at {appointment.time}</p>
                  </div>
                </div>
                <button className="px-3 py-1 text-xs font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Health Alerts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Health Alerts</h3>
              <AlertCircle className="text-orange-600" size={20} />
            </div>
          </div>
          <div className="p-6 space-y-4">
            {[
              { type: 'medication', message: 'Evening medication reminder in 2 hours', priority: 'medium' },
              { type: 'appointment', message: 'Appointment with Dr. Smith tomorrow at 10:30 AM', priority: 'high' },
              { type: 'vitals', message: 'Time to record your daily blood pressure', priority: 'low' },
              { type: 'lab', message: 'Lab results are ready for review', priority: 'high' },
            ].map((alert, index) => (
              <div key={index} className="flex items-start space-x-3 py-3 border-b border-gray-50 last:border-0">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  alert.priority === 'high' ? 'bg-red-500' :
                  alert.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm text-gray-900">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1 capitalize">{alert.type} • {alert.priority} priority</p>
                </div>
                <button className="text-xs text-blue-600 hover:text-blue-800">
                  View
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-6 space-y-4">
            {[
              { action: 'Recorded blood pressure', value: '117/78 mmHg', time: '2 hours ago' },
              { action: 'Took Lisinopril', value: '10mg', time: '4 hours ago' },
              { action: 'Completed health survey', value: 'General wellness', time: '1 day ago' },
              { action: 'Recorded weight', value: '69.3 kg', time: '2 days ago' },
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.value}</p>
                </div>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}