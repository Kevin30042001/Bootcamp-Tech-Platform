// src/data/bootcamps.ts
import { Bootcamp } from '../types/bootcamp';

export const bootcamps: Bootcamp[] = [
  {
    id: 1,
    name: "Full Stack Development",
    description: "Aprende desarrollo web completo con React, Node.js y más. Conviértete en un desarrollador Full Stack capaz de crear aplicaciones web completas y modernas.",
    duration: "12 semanas",
    price: "$2999",
    schedule: {
      morning: "8:00 AM - 12:00 PM",
      afternoon: "2:00 PM - 6:00 PM",
      evening: "6:00 PM - 10:00 PM"
    },
    requirements: [
      "Conocimientos básicos de programación",
      "Computadora con mínimo 8GB RAM",
      "Conexión estable a internet"
    ],
    skills: [
      "HTML/CSS",
      "JavaScript",
      "React",
      "Node.js",
      "MongoDB",
      "Express",
      "Git",
      "TypeScript"
    ],
    maxStudents: 25,
    availableSpots: 15,
    startDates: [
      "2025-05-01",
      "2025-06-15",
      "2025-08-01"
    ],
    instructor: "Kevin Chavez",
    level: "Intermedio",
    language: "Español",
    certificationType: "Certificado Profesional Full Stack",
    paymentPlans: [
      {
        type: "Pago Completo",
        price: "$2999",
        discount: "15%",
        description: "Ahorra pagando el curso completo"
      },
      {
        type: "Mensual",
        price: "$1100",
        installments: 3,
        description: "3 pagos mensuales"
      },
      {
        type: "Quincenal",
        price: "$570",
        installments: 6,
        description: "6 pagos quincenales"
      }
    ],
    location: {
      type: "Híbrido",
      address: "Calle Principal 123",
      city: "Ciudad de San Salvador",
      country: "El Salvador"
    }
  },
  {
    id: 2,
    name: "Data Science",
    description: "Domina el análisis de datos y machine learning. Aprende a trabajar con grandes conjuntos de datos y a crear modelos predictivos.",
    duration: "10 semanas",
    price: "$2499",
    schedule: {
      morning: "9:00 AM - 1:00 PM",
      evening: "5:00 PM - 9:00 PM"
    },
    requirements: [
      "Conocimientos básicos de matemáticas y estadística",
      "Computadora con mínimo 16GB RAM",
      "Python básico"
    ],
    skills: [
      "Python",
      "Pandas",
      "NumPy",
      "Scikit-learn",
      "TensorFlow",
      "Visualización de datos",
      "SQL"
    ],
    maxStudents: 20,
    availableSpots: 8,
    startDates: [
      "2025-05-15",
      "2025-07-01",
      "2025-08-15"
    ],
    instructor: "María González",
    level: "Avanzado",
    language: "Español",
    certificationType: "Certificado Profesional en Data Science",
    paymentPlans: [
      {
        type: "Pago Completo",
        price: "$2499",
        discount: "10%",
        description: "Mejor precio pagando completo"
      },
      {
        type: "Mensual",
        price: "$899",
        installments: 3,
        description: "3 pagos mensuales"
      }
    ],
    location: {
      type: "Online",
      country: "El Salvador"
    }
  },
  {
    id: 3,
    name: "UX/UI Design",
    description: "Diseño de interfaces y experiencia de usuario. Aprende a crear diseños atractivos y funcionales centrados en el usuario.",
    duration: "8 semanas",
    price: "$1999",
    schedule: {
      morning: "9:00 AM - 1:00 PM",
      evening: "6:00 PM - 10:00 PM"
    },
    requirements: [
      "No se requiere experiencia previa",
      "Computadora con capacidad para software de diseño",
      "Interés en diseño y creatividad"
    ],
    skills: [
      "Figma",
      "Adobe XD",
      "Principios de UX",
      "Diseño de interfaces",
      "Prototipado",
      "Design Thinking",
      "Investigación de usuarios"
    ],
    maxStudents: 15,
    availableSpots: 7,
    startDates: [
      "2025-05-01",
      "2025-06-15",
      "2025-08-01"
    ],
    instructor: "Laura Sánchez",
    level: "Principiante",
    language: "Español",
    certificationType: "Certificado Profesional en UX/UI",
    paymentPlans: [
      {
        type: "Pago Completo",
        price: "$1999",
        discount: "20%",
        description: "Máximo descuento"
      },
      {
        type: "Mensual",
        price: "$725",
        installments: 3,
        description: "3 pagos mensuales cómodos"
      }
    ],
    location: {
      type: "Híbrido",
      address: "Av. Diseño 456",
      city: "Santa Tecla",
      country: "El Salvador"
    }
  },
  {
    id: 4,
    name: "Mobile Development",
    description: "Desarrollo de aplicaciones móviles con React Native. Aprende a crear apps nativas para iOS y Android.",
    duration: "10 semanas",
    price: "$2699",
    schedule: {
      afternoon: "2:00 PM - 6:00 PM",
      evening: "6:00 PM - 10:00 PM"
    },
    requirements: [
      "JavaScript básico",
      "Computadora con mínimo 8GB RAM",
      "Smartphone Android o iOS"
    ],
    skills: [
      "React Native",
      "JavaScript",
      "TypeScript",
      "Redux",
      "APIs REST",
      "Firebase",
      "App Store/Play Store"
    ],
    maxStudents: 20,
    availableSpots: 12,
    startDates: [
      "2025-05-15",
      "2025-07-01"
    ],
    instructor: "Carlos Ruiz",
    level: "Intermedio",
    language: "Español",
    certificationType: "Certificado en Desarrollo Móvil",
    paymentPlans: [
      {
        type: "Pago Completo",
        price: "$2699",
        discount: "15%",
        description: "Mejor precio"
      },
      {
        type: "Mensual",
        price: "$999",
        installments: 3,
        description: "Pago mensual"
      }
    ],
    location: {
      type: "Online",
      country: "El Salvador"
    }
  },
  {
    id: 5,
    name: "DevOps & Cloud Computing",
    description: "Domina las prácticas de DevOps y servicios cloud. Aprende a implementar CI/CD y gestionar infraestructura.",
    duration: "12 semanas",
    price: "$2899",
    schedule: {
      morning: "8:00 AM - 12:00 PM",
      evening: "6:00 PM - 10:00 PM"
    },
    requirements: [
      "Conocimientos básicos de Linux",
      "Experiencia básica en programación",
      "Computadora con mínimo 8GB RAM"
    ],
    skills: [
      "Docker",
      "Kubernetes",
      "AWS",
      "Azure",
      "CI/CD",
      "Jenkins",
      "Terraform",
      "Linux"
    ],
    maxStudents: 20,
    availableSpots: 10,
    startDates: [
      "2025-06-01",
      "2025-08-15"
    ],
    instructor: "Fernando Torres",
    level: "Avanzado",
    language: "Español",
    certificationType: "Certificado Profesional DevOps",
    paymentPlans: [
      {
        type: "Pago Completo",
        price: "$2899",
        discount: "10%",
        description: "Pago único con descuento"
      },
      {
        type: "Mensual",
        price: "$1050",
        installments: 3,
        description: "3 pagos mensuales"
      }
    ],
    location: {
      type: "Online",
      country: "El Salvador"
    }
  }
];