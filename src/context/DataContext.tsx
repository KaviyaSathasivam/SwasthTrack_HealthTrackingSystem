import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  dateOfBirth: string;
  address: string;
  emergencyContact: string;
  bloodType: string;
  allergies: string[];
  lastVisit: string;
  status: 'active' | 'inactive' | 'critical';
  assignedDoctor: string;
}

interface Doctor {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization: string;
  experience: number;
  rating: number;
  patients: number;
  consultationFee: number;
  availability: string[];
  status: 'active' | 'inactive' | 'on-leave';
  licenseNumber: string;
  education: string;
  joinedDate: string;
}

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  type: 'consultation' | 'followup' | 'emergency' | 'video';
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled';
  reason: string;
  duration: number;
  fee: number;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  paymentMethod?: 'card' | 'cash' | 'insurance' | 'bank_transfer';
  transactionId?: string;
}

interface HealthRecord {
  id: string;
  patientName: string;
  patientId: string;
  recordType: 'consultation' | 'lab-result' | 'imaging' | 'prescription' | 'vital-signs';
  title: string;
  description: string;
  doctorName: string;
  date: string;
  status: 'normal' | 'abnormal' | 'critical' | 'pending';
  attachments: string[];
  vitals?: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
    weight: number;
  };
}

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
  recordedBy: string;
}

interface Prescription {
  id: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  doctorId: string;
  date: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  diagnosis: string;
  instructions: string;
  status: 'active' | 'completed' | 'cancelled';
  refillsRemaining: number;
  validUntil: string;
}

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

interface DataContextType {
  patients: Patient[];
  doctors: Doctor[];
  appointments: Appointment[];
  healthRecords: HealthRecord[];
  vitalReadings: VitalReading[];
  prescriptions: Prescription[];
  videoCalls: VideoCall[];
  payments: Payment[];
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  addDoctor: (doctor: Omit<Doctor, 'id'>) => void;
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  addHealthRecord: (record: Omit<HealthRecord, 'id'>) => void;
  addVitalReading: (vital: Omit<VitalReading, 'id'>) => void;
  addPrescription: (prescription: Omit<Prescription, 'id'>) => void;
  addVideoCall: (call: Omit<VideoCall, 'id'>) => void;
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  updatePayment: (id: string, updates: Partial<Payment>) => void;
  updateVideoCall: (id: string, updates: Partial<VideoCall>) => void;
  getPatientData: (patientName: string) => {
    appointments: Appointment[];
    healthRecords: HealthRecord[];
    vitalReadings: VitalReading[];
    prescriptions: Prescription[];
    videoCalls: VideoCall[];
    payments: Payment[];
  };
  getDoctorData: (doctorName: string) => {
    appointments: Appointment[];
    patients: Patient[];
    prescriptions: Prescription[];
    videoCalls: VideoCall[];
    payments: Payment[];
  };
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Initial mock data with historical records
const initialPatients: Patient[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@email.com',
    phone: '+1-555-0123',
    age: 45,
    gender: 'Male',
    dateOfBirth: '1979-03-15',
    address: '123 Main St, Anytown, ST 12345',
    emergencyContact: '+1-555-0124',
    bloodType: 'O+',
    allergies: ['Penicillin', 'Peanuts'],
    lastVisit: '2024-02-01',
    status: 'active',
    assignedDoctor: 'Dr. Sarah Smith'
  },
  {
    id: '2',
    name: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    phone: '+1-555-0124',
    age: 32,
    gender: 'Female',
    dateOfBirth: '1992-07-22',
    address: '456 Oak Ave, Somewhere, ST 67890',
    emergencyContact: '+1-555-0125',
    bloodType: 'A+',
    allergies: ['Shellfish'],
    lastVisit: '2024-01-28',
    status: 'active',
    assignedDoctor: 'Dr. Michael Johnson'
  },
  {
    id: '3',
    name: 'Robert Brown',
    email: 'robert.brown@email.com',
    phone: '+1-555-0125',
    age: 58,
    gender: 'Male',
    dateOfBirth: '1966-11-08',
    address: '789 Pine St, Elsewhere, ST 54321',
    emergencyContact: '+1-555-0126',
    bloodType: 'B+',
    allergies: ['Latex'],
    lastVisit: '2024-01-15',
    status: 'active',
    assignedDoctor: 'Dr. Sarah Smith'
  }
];

const initialDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Smith',
    email: 'dr.smith@swasthtrack.com',
    phone: '+1-555-0201',
    specialization: 'Cardiology',
    experience: 12,
    rating: 4.9,
    patients: 247,
    consultationFee: 200,
    availability: ['Monday', 'Tuesday', 'Wednesday', 'Friday'],
    status: 'active',
    licenseNumber: 'MD-001-2024',
    education: 'Harvard Medical School',
    joinedDate: '2020-01-15'
  },
  {
    id: '2',
    name: 'Dr. Michael Johnson',
    email: 'dr.johnson@swasthtrack.com',
    phone: '+1-555-0202',
    specialization: 'Neurology',
    experience: 8,
    rating: 4.7,
    patients: 189,
    consultationFee: 180,
    availability: ['Monday', 'Wednesday', 'Thursday', 'Saturday'],
    status: 'active',
    licenseNumber: 'MD-002-2024',
    education: 'Johns Hopkins University',
    joinedDate: '2021-03-20'
  },
  {
    id: '3',
    name: 'Dr. Emily Davis',
    email: 'dr.davis@swasthtrack.com',
    phone: '+1-555-0203',
    specialization: 'Pediatrics',
    experience: 15,
    rating: 4.8,
    patients: 312,
    consultationFee: 150,
    availability: ['Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    status: 'active',
    licenseNumber: 'MD-003-2024',
    education: 'Stanford Medical School',
    joinedDate: '2019-08-10'
  }
];

// Historical appointments
const initialAppointments: Appointment[] = [
  {
    id: 'APT001',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Smith',
    date: '2024-01-15',
    time: '10:00',
    type: 'consultation',
    status: 'completed',
    reason: 'Annual cardiac checkup',
    duration: 45,
    fee: 200,
    paymentStatus: 'paid',
    paymentMethod: 'card',
    transactionId: 'TXN001234'
  },
  {
    id: 'APT002',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Smith',
    date: '2024-02-01',
    time: '14:30',
    type: 'followup',
    status: 'completed',
    reason: 'Blood pressure follow-up',
    duration: 30,
    fee: 150,
    paymentStatus: 'paid',
    paymentMethod: 'insurance',
    transactionId: 'TXN001235'
  },
  {
    id: 'APT003',
    patientName: 'Emma Wilson',
    doctorName: 'Dr. Michael Johnson',
    date: '2024-01-20',
    time: '09:15',
    type: 'consultation',
    status: 'completed',
    reason: 'Headache and dizziness evaluation',
    duration: 60,
    fee: 180,
    paymentStatus: 'paid',
    paymentMethod: 'card',
    transactionId: 'TXN001236'
  },
  {
    id: 'APT004',
    patientName: 'Emma Wilson',
    doctorName: 'Dr. Michael Johnson',
    date: '2024-01-28',
    time: '11:00',
    type: 'video',
    status: 'completed',
    reason: 'Follow-up consultation via video',
    duration: 30,
    fee: 150,
    paymentStatus: 'paid',
    paymentMethod: 'card',
    transactionId: 'TXN001237'
  },
  {
    id: 'APT005',
    patientName: 'Robert Brown',
    doctorName: 'Dr. Sarah Smith',
    date: '2024-01-10',
    time: '16:00',
    type: 'consultation',
    status: 'completed',
    reason: 'Chest pain evaluation',
    duration: 45,
    fee: 200,
    paymentStatus: 'paid',
    paymentMethod: 'insurance',
    transactionId: 'TXN001238'
  },
  {
    id: 'APT006',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Smith',
    date: '2024-02-15',
    time: '10:30',
    type: 'followup',
    status: 'scheduled',
    reason: 'Medication review and blood pressure check',
    duration: 30,
    fee: 150,
    paymentStatus: 'pending'
  }
];

// Historical health records
const initialHealthRecords: HealthRecord[] = [
  {
    id: 'HR001',
    patientName: 'John Doe',
    patientId: '1',
    recordType: 'consultation',
    title: 'Annual Cardiac Assessment',
    description: 'Comprehensive cardiac evaluation including ECG, stress test, and blood work. Patient shows stable condition with well-controlled hypertension.',
    doctorName: 'Dr. Sarah Smith',
    date: '2024-01-15',
    status: 'normal',
    attachments: ['ECG_Report.pdf', 'Blood_Work.pdf'],
    vitals: {
      bloodPressure: '128/82',
      heartRate: 72,
      temperature: 98.6,
      weight: 75.2
    }
  },
  {
    id: 'HR002',
    patientName: 'John Doe',
    patientId: '1',
    recordType: 'lab-result',
    title: 'Lipid Panel Results',
    description: 'Cholesterol levels within normal range. LDL: 95 mg/dL, HDL: 58 mg/dL, Total: 180 mg/dL. Continue current medication regimen.',
    doctorName: 'Dr. Sarah Smith',
    date: '2024-01-20',
    status: 'normal',
    attachments: ['Lipid_Panel.pdf']
  },
  {
    id: 'HR003',
    patientName: 'Emma Wilson',
    patientId: '2',
    recordType: 'consultation',
    title: 'Neurological Evaluation',
    description: 'Patient presented with recurring headaches and occasional dizziness. Neurological examination normal. Recommended lifestyle modifications and stress management.',
    doctorName: 'Dr. Michael Johnson',
    date: '2024-01-20',
    status: 'normal',
    attachments: ['Neuro_Exam.pdf'],
    vitals: {
      bloodPressure: '118/76',
      heartRate: 68,
      temperature: 98.4,
      weight: 62.5
    }
  },
  {
    id: 'HR004',
    patientName: 'Emma Wilson',
    patientId: '2',
    recordType: 'imaging',
    title: 'Brain MRI Scan',
    description: 'MRI scan of the brain shows no abnormalities. No signs of structural issues or lesions. Results support benign nature of headaches.',
    doctorName: 'Dr. Michael Johnson',
    date: '2024-01-25',
    status: 'normal',
    attachments: ['Brain_MRI.pdf', 'Radiologist_Report.pdf']
  },
  {
    id: 'HR005',
    patientName: 'Robert Brown',
    patientId: '3',
    recordType: 'consultation',
    title: 'Chest Pain Evaluation',
    description: 'Patient reported chest discomfort. ECG and cardiac enzymes normal. Likely musculoskeletal origin. Prescribed anti-inflammatory medication.',
    doctorName: 'Dr. Sarah Smith',
    date: '2024-01-10',
    status: 'normal',
    attachments: ['ECG_Report.pdf', 'Cardiac_Enzymes.pdf'],
    vitals: {
      bloodPressure: '135/88',
      heartRate: 78,
      temperature: 98.8,
      weight: 82.1
    }
  }
];

// Historical prescriptions
const initialPrescriptions: Prescription[] = [
  {
    id: 'RX001',
    patientName: 'John Doe',
    patientId: '1',
    doctorName: 'Dr. Sarah Smith',
    doctorId: '1',
    date: '2024-01-15',
    medications: [
      {
        name: 'Lisinopril',
        dosage: '10mg',
        frequency: 'Once daily',
        duration: '90 days',
        instructions: 'Take with or without food, preferably at the same time each day. Monitor blood pressure regularly.'
      },
      {
        name: 'Atorvastatin',
        dosage: '20mg',
        frequency: 'Once daily',
        duration: '90 days',
        instructions: 'Take in the evening with dinner. Avoid grapefruit juice.'
      }
    ],
    diagnosis: 'Hypertension and Hyperlipidemia',
    instructions: 'Continue current medications. Follow up in 3 months for blood pressure and lipid monitoring. Maintain low-sodium diet and regular exercise.',
    status: 'active',
    refillsRemaining: 2,
    validUntil: '2024-07-15'
  },
  {
    id: 'RX002',
    patientName: 'Emma Wilson',
    patientId: '2',
    doctorName: 'Dr. Michael Johnson',
    doctorId: '2',
    date: '2024-01-20',
    medications: [
      {
        name: 'Sumatriptan',
        dosage: '50mg',
        frequency: 'As needed',
        duration: '30 days',
        instructions: 'Take at the first sign of migraine. Do not exceed 2 doses in 24 hours. May cause drowsiness.'
      },
      {
        name: 'Magnesium Oxide',
        dosage: '400mg',
        frequency: 'Once daily',
        duration: '60 days',
        instructions: 'Take with food to prevent stomach upset. For migraine prevention.'
      }
    ],
    diagnosis: 'Migraine Headaches',
    instructions: 'Use sumatriptan for acute episodes. Take magnesium daily for prevention. Keep a headache diary. Avoid known triggers.',
    status: 'active',
    refillsRemaining: 1,
    validUntil: '2024-07-20'
  },
  {
    id: 'RX003',
    patientName: 'Robert Brown',
    patientId: '3',
    doctorName: 'Dr. Sarah Smith',
    doctorId: '1',
    date: '2024-01-10',
    medications: [
      {
        name: 'Ibuprofen',
        dosage: '400mg',
        frequency: 'Three times daily',
        duration: '14 days',
        instructions: 'Take with food to prevent stomach irritation. Do not exceed recommended dose.'
      }
    ],
    diagnosis: 'Musculoskeletal Chest Pain',
    instructions: 'Take anti-inflammatory as directed. Apply heat/cold therapy. Avoid strenuous activities for 1 week. Return if symptoms worsen.',
    status: 'completed',
    refillsRemaining: 0,
    validUntil: '2024-01-24'
  }
];

// Historical payments
const initialPayments: Payment[] = [
  {
    id: 'PAY001',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Smith',
    amount: 200,
    date: '2024-01-15',
    status: 'paid',
    method: 'card',
    description: 'Annual cardiac checkup consultation',
    invoiceId: 'INV001',
    transactionId: 'TXN001234'
  },
  {
    id: 'PAY002',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Smith',
    amount: 150,
    date: '2024-02-01',
    status: 'paid',
    method: 'insurance',
    description: 'Blood pressure follow-up consultation',
    invoiceId: 'INV002',
    transactionId: 'TXN001235'
  },
  {
    id: 'PAY003',
    patientName: 'Emma Wilson',
    doctorName: 'Dr. Michael Johnson',
    amount: 180,
    date: '2024-01-20',
    status: 'paid',
    method: 'card',
    description: 'Neurological evaluation consultation',
    invoiceId: 'INV003',
    transactionId: 'TXN001236'
  },
  {
    id: 'PAY004',
    patientName: 'Emma Wilson',
    doctorName: 'Dr. Michael Johnson',
    amount: 150,
    date: '2024-01-28',
    status: 'paid',
    method: 'card',
    description: 'Video consultation follow-up',
    invoiceId: 'INV004',
    transactionId: 'TXN001237'
  },
  {
    id: 'PAY005',
    patientName: 'Robert Brown',
    doctorName: 'Dr. Sarah Smith',
    amount: 200,
    date: '2024-01-10',
    status: 'paid',
    method: 'insurance',
    description: 'Chest pain evaluation consultation',
    invoiceId: 'INV005',
    transactionId: 'TXN001238'
  }
];

// Historical video calls
const initialVideoCalls: VideoCall[] = [
  {
    id: 'VC001',
    patientName: 'Emma Wilson',
    doctorName: 'Dr. Michael Johnson',
    scheduledTime: '2024-01-28T11:00:00',
    duration: 30,
    status: 'completed',
    meetingLink: 'https://meet.swasthtrack.com/room/vc001',
    roomId: 'vc001',
    notes: 'Follow-up consultation for headache management. Patient reported improvement with prescribed medications.',
    recordingAvailable: true
  },
  {
    id: 'VC002',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Smith',
    scheduledTime: '2024-02-15T14:30:00',
    duration: 30,
    status: 'scheduled',
    meetingLink: 'https://meet.swasthtrack.com/room/vc002',
    roomId: 'vc002',
    notes: 'Scheduled video consultation for medication review',
    recordingAvailable: false
  }
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [patients, setPatients] = useState<Patient[]>(initialPatients);
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors);
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [healthRecords, setHealthRecords] = useState<HealthRecord[]>(initialHealthRecords);
  const [vitalReadings, setVitalReadings] = useState<VitalReading[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(initialPrescriptions);
  const [videoCalls, setVideoCalls] = useState<VideoCall[]>(initialVideoCalls);
  const [payments, setPayments] = useState<Payment[]>(initialPayments);

  // Auto-add user to appropriate list when they register
  useEffect(() => {
    if (user) {
      if (user.role === 'patient') {
        const existingPatient = patients.find(p => p.email === user.email);
        if (!existingPatient) {
          const newPatient: Patient = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            age: user.dateOfBirth ? new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear() : 0,
            gender: 'Not specified',
            dateOfBirth: user.dateOfBirth || '',
            address: user.address || '',
            emergencyContact: user.emergencyContact || '',
            bloodType: 'Unknown',
            allergies: [],
            lastVisit: new Date().toISOString().split('T')[0],
            status: 'active',
            assignedDoctor: ''
          };
          setPatients(prev => [...prev, newPatient]);
        }
      } else if (user.role === 'doctor') {
        const existingDoctor = doctors.find(d => d.email === user.email);
        if (!existingDoctor) {
          const newDoctor: Doctor = {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            specialization: user.specialization || 'General Medicine',
            experience: 0,
            rating: 4.5,
            patients: 0,
            consultationFee: 150,
            availability: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            status: 'active',
            licenseNumber: user.licenseNumber || '',
            education: '',
            joinedDate: new Date().toISOString().split('T')[0]
          };
          setDoctors(prev => [...prev, newDoctor]);
        }
      }
    }
  }, [user, patients, doctors]);

  const addPatient = (patient: Omit<Patient, 'id'>) => {
    const newPatient = { ...patient, id: Date.now().toString() };
    setPatients(prev => [...prev, newPatient]);
  };

  const addDoctor = (doctor: Omit<Doctor, 'id'>) => {
    const newDoctor = { ...doctor, id: Date.now().toString() };
    setDoctors(prev => [...prev, newDoctor]);
  };

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment = { ...appointment, id: 'APT' + Date.now().toString().slice(-6) };
    setAppointments(prev => [newAppointment, ...prev]);
  };

  const addHealthRecord = (record: Omit<HealthRecord, 'id'>) => {
    const newRecord = { ...record, id: 'HR' + Date.now().toString().slice(-6) };
    setHealthRecords(prev => [newRecord, ...prev]);
  };

  const addVitalReading = (vital: Omit<VitalReading, 'id'>) => {
    const newVital = { ...vital, id: 'VR' + Date.now().toString().slice(-6) };
    setVitalReadings(prev => [newVital, ...prev]);
  };

  const addPrescription = (prescription: Omit<Prescription, 'id'>) => {
    const newPrescription = { ...prescription, id: 'RX' + Date.now().toString().slice(-6) };
    setPrescriptions(prev => [newPrescription, ...prev]);
  };

  const addVideoCall = (call: Omit<VideoCall, 'id'>) => {
    const newCall = { ...call, id: 'VC' + Date.now().toString().slice(-6) };
    setVideoCalls(prev => [newCall, ...prev]);
  };

  const addPayment = (payment: Omit<Payment, 'id'>) => {
    const newPayment = { ...payment, id: 'PAY' + Date.now().toString().slice(-6) };
    setPayments(prev => [newPayment, ...prev]);
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => prev.map(apt => apt.id === id ? { ...apt, ...updates } : apt));
  };

  const updatePayment = (id: string, updates: Partial<Payment>) => {
    setPayments(prev => prev.map(pay => pay.id === id ? { ...pay, ...updates } : pay));
  };

  const updateVideoCall = (id: string, updates: Partial<VideoCall>) => {
    setVideoCalls(prev => prev.map(call => call.id === id ? { ...call, ...updates } : call));
  };

  const getPatientData = (patientName: string) => {
    return {
      appointments: appointments.filter(apt => apt.patientName === patientName),
      healthRecords: healthRecords.filter(hr => hr.patientName === patientName),
      vitalReadings: vitalReadings.filter(vr => vr.patientName === patientName),
      prescriptions: prescriptions.filter(rx => rx.patientName === patientName),
      videoCalls: videoCalls.filter(vc => vc.patientName === patientName),
      payments: payments.filter(pay => pay.patientName === patientName)
    };
  };

  const getDoctorData = (doctorName: string) => {
    const doctorAppointments = appointments.filter(apt => apt.doctorName === doctorName);
    const doctorPatients = patients.filter(p => p.assignedDoctor === doctorName);
    
    return {
      appointments: doctorAppointments,
      patients: doctorPatients,
      prescriptions: prescriptions.filter(rx => rx.doctorName === doctorName),
      videoCalls: videoCalls.filter(vc => vc.doctorName === doctorName),
      payments: payments.filter(pay => pay.doctorName === doctorName)
    };
  };

  return (
    <DataContext.Provider value={{
      patients,
      doctors,
      appointments,
      healthRecords,
      vitalReadings,
      prescriptions,
      videoCalls,
      payments,
      addPatient,
      addDoctor,
      addAppointment,
      addHealthRecord,
      addVitalReading,
      addPrescription,
      addVideoCall,
      addPayment,
      updateAppointment,
      updatePayment,
      updateVideoCall,
      getPatientData,
      getDoctorData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}