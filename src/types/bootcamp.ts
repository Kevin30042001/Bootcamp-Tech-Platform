// src/types/bootcamp.ts

// Interfaz para los horarios disponibles
export interface Schedule {
    morning?: string;
    afternoon?: string;
    evening?: string;
    [key: string]: string | undefined;
  }
  
  // Interfaz para los planes de pago
  export interface PaymentPlan {
    type: string;
    price: string;
    discount?: string;
    installments?: number;
    description?: string;
  }
  
  // Interfaz para documentos requeridos
  export interface RequiredDocument {
    type: string;
    description: string;
    isRequired: boolean;
  }
  
  // Interfaz principal del Bootcamp
  export interface Bootcamp {
    id: number;
    name: string;
    description: string;
    duration: string;
    price: string;
    schedule: Schedule;
    requirements: string[];
    skills: string[];
    maxStudents: number;
    availableSpots: number;
    startDates: string[];
    instructor: string;
    level: 'Principiante' | 'Intermedio' | 'Avanzado';
    language: string;
    certificationType: string;
    paymentPlans: PaymentPlan[];
    image?: string;
    category?: string;
    tags?: string[];
    syllabus?: {
      week: number;
      title: string;
      description: string;
      topics: string[];
    }[];
    requiredDocuments?: RequiredDocument[];
    location?: {
      type: 'Online' | 'Presencial' | 'Híbrido';
      address?: string;
      city?: string;
      country?: string;
    };
  }
  
  // Interfaz para el formulario de registro
  export interface RegistrationFormData {
    bootcampId: number;
    schedule: string;
    selectedStartDate: string;
    paymentPlan: string;
    phone: string;
    emergencyContact: string;
    previousExperience: string;
    requiredDocuments?: {
      type: string;
      fileUrl: string;
    }[];
    additionalNotes?: string;
  }
  
  // Interfaz para el registro completo
  export interface Registration {
    id: string;
    userId: string;
    userEmail: string | null;
    bootcampId: number;
    bootcampName: string;
    timestamp: Date;
    schedule: string;
    selectedStartDate: string;
    paymentPlan: string;
    paymentStatus: 'pending' | 'partial' | 'completed';
    status: 'pending' | 'approved' | 'rejected';
    phone: string;
    emergencyContact: string;
    previousExperience: string;
    documents?: {
      type: string;
      url: string;
      uploadDate: Date;
    }[];
    notes?: string;
    adminNotes?: string;
    lastUpdated?: Date;
    completionStatus?: 'not-started' | 'in-progress' | 'completed' | 'dropped';
    attendance?: {
      date: Date;
      status: 'present' | 'absent' | 'late';
    }[];
    grades?: {
      assignment: string;
      score: number;
      feedback?: string;
    }[];
  }
  
  // Interfaz para las estadísticas del bootcamp
  export interface BootcampStats {
    id: number;
    totalRegistrations: number;
    availableSpots: number;
    completionRate: number;
    averageRating: number;
    employmentRate?: number;
    revenue: {
      total: number;
      pending: number;
      collected: number;
    };
  }
  
  // Interfaz para la configuración de notificaciones
  export interface NotificationSettings {
    userId: string;
    emailNotifications: boolean;
    smsNotifications: boolean;
    notificationTypes: {
      paymentReminders: boolean;
      classReminders: boolean;
      announcements: boolean;
      grades: boolean;
    };
  }
  
  // Interfaz para el historial de pagos
  export interface PaymentHistory {
    id: string;
    registrationId: string;
    userId: string;
    amount: number;
    date: Date;
    status: 'successful' | 'failed' | 'pending';
    paymentMethod: string;
    transactionId?: string;
    receipt?: string;
  }
  
  // Interfaz para el progreso del estudiante
  export interface StudentProgress {
    userId: string;
    bootcampId: number;
    progress: number;
    completedModules: string[];
    currentModule: string;
    assignments: {
      id: string;
      name: string;
      status: 'pending' | 'submitted' | 'graded';
      grade?: number;
      submissionDate?: Date;
    }[];
    certificationStatus?: 'not-started' | 'in-progress' | 'completed';
  }
  
  // Interfaz para el feedback del bootcamp
  export interface BootcampFeedback {
    id: string;
    userId: string;
    bootcampId: number;
    rating: number;
    review: string;
    timestamp: Date;
    category: {
      content: number;
      instructor: number;
      materials: number;
      support: number;
    };
    isPublic: boolean;
    response?: {
      text: string;
      timestamp: Date;
      respondentId: string;
    };
  }