export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'doctor' | 'patient';
  avatar?: string;
  phone?: string;
  specialization?: string; // for doctors
  licenseNumber?: string; // for doctors
  dateOfBirth?: string; // for patients
  address?: string;
  emergencyContact?: string;
  createdAt: string;
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  emergencyContact: string;
  bloodType: string;
  allergies: string[];
  medicalHistory: string[];
  assignedDoctorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthVital {
  id: string;
  patientId: string;
  type: 'blood_pressure' | 'heart_rate' | 'temperature' | 'weight' | 'height' | 'blood_sugar';
  value: string;
  unit: string;
  recordedAt: string;
  recordedBy: string;
  notes?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  duration: number; // in minutes
  type: 'consultation' | 'followup' | 'emergency' | 'video';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  reason: string;
  notes?: string;
  meetingLink?: string;
  fee: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  createdAt: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  medications: Medication[];
  diagnosis: string;
  instructions: string;
  createdAt: string;
  validUntil: string;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'appointment' | 'prescription' | 'vitals' | 'payment' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface DoctorStats {
  totalPatients: number;
  todayAppointments: number;
  weeklyRevenue: number;
  averageRating: number;
}

export interface AdminStats {
  totalUsers: number;
  totalDoctors: number;
  totalPatients: number;
  totalRevenue: number;
  todayAppointments: number;
  pendingPayments: number;
}