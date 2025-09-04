// lib/form-templates.ts
import type { FontTheme } from '@/lib/fonts';
import type { FormConfig } from '@/types/form';

export type TemplateMeta = {
  id: string;
  name: string;
  description: string;
  theme: string;
  coverUrl: string;
  form: FormConfig & { fontTheme?: FontTheme };
};

export const FORM_TEMPLATES: TemplateMeta[] = [
  // CONTACTO (profesional, serif elegante)
  {
    id: 'contact-basic',
    name: 'Contacto básico',
    description: 'Nombre, correo, teléfono y mensaje.',
    theme: 'elegant',
    coverUrl:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1800&auto=format&fit=crop', // escritorio/papel
    form: {
      title: 'Formulario de contacto',
      description: 'Cuéntanos cómo podemos ayudarte.',
      type: 'simple',
      infoTop: 'Responderemos a la brevedad.',
      fontTheme: 'elegant', // Lora
      backgroundTint: 'dark', // buen contraste con texto blanco
      steps: [
        {
          id: 'step-contact',
          title: 'Tus datos',
          fields: [
            {
              id: 'full-name',
              type: 'text',
              label: 'Nombre completo',
              name: 'full-name',
              placeholder: 'Tu nombre y apellidos',
              required: true,
              validations: { minLength: 3, maxLength: 80 }
            },
            {
              id: 'email',
              type: 'text',
              label: 'Correo electrónico',
              name: 'email',
              placeholder: 'tucorreo@ejemplo.com',
              required: true,
              validations: { regex: 'email' }
            },
            {
              id: 'phone',
              type: 'text',
              label: 'Teléfono',
              name: 'phone',
              placeholder: '5512345678',
              required: false,
              validations: { regex: 'phone' }
            },
            {
              id: 'topic',
              type: 'select',
              label: 'Motivo de contacto',
              name: 'topic',
              required: true,
              options: [
                { label: 'Soporte', value: 'support' },
                { label: 'Ventas', value: 'sales' },
                { label: 'Facturación', value: 'billing' },
                { label: 'Otro', value: 'other' }
              ]
            },
            {
              id: 'message',
              type: 'textarea',
              label: 'Mensaje',
              name: 'message',
              placeholder: 'Escribe los detalles…',
              required: true,
              validations: { minLength: 10, maxLength: 600 }
            }
          ]
        }
      ]
    }
  },

  // EVENTO / RSVP (moderna, sans)
  {
    id: 'event-rsvp',
    name: 'Registro a evento',
    description: 'Confirma asistencia y preferencias.',
    theme: 'event',
    coverUrl:
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1800&auto=format&fit=crop', // público/evento
    form: {
      title: 'Registro al evento',
      description: 'Confirma tu asistencia y preferencias de sesión.',
      type: 'multi-step',
      fontTheme: 'event', // Poppins
      backgroundTint: 'dark',
      steps: [
        {
          id: 'datos',
          title: 'Datos personales',
          fields: [
            {
              id: 'name',
              type: 'text',
              label: 'Nombre',
              name: 'name',
              required: true,
              validations: { minLength: 2, maxLength: 60 }
            },
            {
              id: 'email',
              type: 'text',
              label: 'Email',
              name: 'email',
              required: true,
              validations: { regex: 'email' }
            },
            {
              id: 'company',
              type: 'text',
              label: 'Empresa',
              name: 'company',
              required: false
            }
          ]
        },
        {
          id: 'preferencias',
          title: 'Preferencias',
          fields: [
            {
              id: 'track',
              type: 'select',
              label: 'Track de interés',
              name: 'track',
              required: true,
              options: [
                { label: 'Frontend', value: 'fe' },
                { label: 'Backend', value: 'be' },
                { label: 'IA/ML', value: 'ai' }
              ]
            },
            {
              id: 'workshops',
              type: 'select',
              label: 'Workshops',
              name: 'workshops',
              required: false,
              multiple: true,
              minSelected: 0,
              maxSelected: 3,
              options: [
                { label: 'React Avanzado', value: 'react' },
                { label: 'Node & APIs', value: 'node' },
                { label: 'Prompt Engineering', value: 'prompt' },
                { label: 'Testing', value: 'testing' }
              ]
            },
            {
              id: 'date',
              type: 'date',
              label: 'Fecha de asistencia',
              name: 'date',
              required: true
            }
          ]
        }
      ]
    }
  },

  // SOLICITUD DE EMPLEO (editorial/serif sobria)
  {
    id: 'job-application',
    name: 'Solicitud de empleo',
    description: 'Datos personales, habilidades y CV.',
    theme: 'editorial',
    coverUrl:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1800&auto=format&fit=crop',
    form: {
      title: 'Aplicación a vacante',
      description: 'Completa tu información para evaluar tu perfil.',
      type: 'multi-step',
      fontTheme: 'editorial', // Playfair
      backgroundTint: 'dark',
      steps: [
        {
          id: 'perfil',
          title: 'Perfil',
          fields: [
            {
              id: 'full-name',
              type: 'text',
              label: 'Nombre completo',
              name: 'full-name',
              required: true
            },
            {
              id: 'email',
              type: 'text',
              label: 'Email',
              name: 'email',
              required: true,
              validations: { regex: 'email' }
            },
            {
              id: 'curp',
              type: 'text',
              label: 'CURP',
              name: 'curp',
              required: false,
              validations: { regex: 'curp' }
            }
          ]
        },
        {
          id: 'skills',
          title: 'Habilidades',
          fields: [
            {
              id: 'stack',
              type: 'select',
              label: 'Stack principal',
              name: 'stack',
              required: true,
              options: [
                { label: 'MERN', value: 'mern' },
                { label: 'MEAN', value: 'mean' },
                { label: 'LAMP', value: 'lamp' },
                { label: 'Django', value: 'django' }
              ]
            },
            {
              id: 'skills-multi',
              type: 'select',
              label: 'Habilidades',
              name: 'skills',
              required: true,
              multiple: true,
              minSelected: 1,
              maxSelected: 5,
              options: [
                { label: 'React', value: 'react' },
                { label: 'Node.js', value: 'node' },
                { label: 'TypeScript', value: 'ts' },
                { label: 'Pruebas (Jest)', value: 'jest' },
                { label: 'SQL', value: 'sql' },
                { label: 'Docker', value: 'docker' }
              ]
            },
            {
              id: 'about',
              type: 'textarea',
              label: 'Resumen',
              name: 'about',
              placeholder: 'Cuéntanos brevemente sobre ti',
              required: true,
              validations: { minLength: 30, maxLength: 800 }
            }
          ]
        }
      ]
    }
  },

  // SOPORTE (tech/sans neutra)
  {
    id: 'support-ticket',
    name: 'Soporte técnico',
    description: 'Crea un ticket con prioridad y adjuntos.',
    theme: 'tech',
    coverUrl:
      'https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=1800&auto=format&fit=crop', // código/terminal
    form: {
      title: 'Ticket de soporte',
      description: 'Describe el problema para ayudarte mejor.',
      type: 'simple',
      fontTheme: 'tech', // Inter
      backgroundTint: 'darker',
      steps: [
        {
          id: 'ticket',
          fields: [
            {
              id: 'email',
              type: 'text',
              label: 'Email',
              name: 'email',
              required: true,
              validations: { regex: 'email' }
            },
            {
              id: 'priority',
              type: 'select',
              label: 'Prioridad',
              name: 'priority',
              required: true,
              options: [
                { label: 'Baja', value: 'low' },
                { label: 'Media', value: 'medium' },
                { label: 'Alta', value: 'high' }
              ]
            },
            {
              id: 'category',
              type: 'select',
              label: 'Categoría',
              name: 'category',
              required: true,
              options: [
                { label: 'Acceso', value: 'access' },
                { label: 'Facturación', value: 'billing' },
                { label: 'Bug', value: 'bug' },
                { label: 'Mejora', value: 'improvement' }
              ]
            },
            {
              id: 'description',
              type: 'textarea',
              label: 'Descripción',
              name: 'description',
              required: true,
              validations: { minLength: 10 }
            }
          ]
        }
      ]
    }
  },

  // NPS / FEEDBACK (editorial/arte abstracto)
  {
    id: 'customer-feedback',
    name: 'Feedback de clientes (NPS)',
    description: 'Pregunta NPS + campos abiertos.',
    theme: 'aurora',
    coverUrl:
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1800&auto=format&fit=crop', // abstracto/aurora
    form: {
      title: 'Encuesta de satisfacción',
      description: 'Tu opinión nos ayuda a mejorar.',
      type: 'multi-step',
      fontTheme: 'editorial', // Playfair para darle “report look”
      backgroundTint: 'dark',
      steps: [
        {
          id: 'nps',
          title: 'Satisfacción',
          fields: [
            {
              id: 'nps',
              type: 'select',
              label: '¿Qué tan probable es que nos recomiendes?',
              name: 'nps',
              required: true,
              options: Array.from({ length: 11 }).map((_, i) => ({
                label: String(i),
                value: String(i)
              }))
            }
          ]
        },
        {
          id: 'comentarios',
          title: 'Comentarios',
          fields: [
            {
              id: 'what-like',
              type: 'textarea',
              label: '¿Qué te gustó?',
              name: 'what-like',
              required: false
            },
            {
              id: 'improve',
              type: 'textarea',
              label: '¿Qué podemos mejorar?',
              name: 'improve',
              required: false
            }
          ]
        }
      ]
    }
  },

  // RESERVA / CITA (papel/calendario; serif suave)
  {
    id: 'booking-intake',
    name: 'Reserva / Cita',
    description: 'Datos del cliente y fecha preferida.',
    theme: 'elegant',
    coverUrl:
      'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1800&auto=format&fit=crop', // calendario/cuaderno
    form: {
      title: 'Solicitar cita',
      description: 'Elige fecha y comparte tus datos.',
      type: 'simple',
      fontTheme: 'elegant', // Lora
      backgroundTint: 'dark',
      steps: [
        {
          id: 'booking',
          fields: [
            {
              id: 'name',
              type: 'text',
              label: 'Nombre',
              name: 'name',
              required: true
            },
            {
              id: 'email',
              type: 'text',
              label: 'Email',
              name: 'email',
              required: true,
              validations: { regex: 'email' }
            },
            {
              id: 'service',
              type: 'select',
              label: 'Servicio',
              name: 'service',
              required: true,
              options: [
                { label: 'Consulta', value: 'consult' },
                { label: 'Demo', value: 'demo' },
                { label: 'Asesoría', value: 'advisory' }
              ]
            },
            {
              id: 'date',
              type: 'date',
              label: 'Fecha preferida',
              name: 'date',
              required: true
            },
            {
              id: 'notes',
              type: 'textarea',
              label: 'Notas',
              name: 'notes',
              required: false
            }
          ]
        }
      ]
    }
  },

  // BODA (cursiva + serif)
  {
    id: 'wedding-invite',
    name: 'Invitación de boda',
    description: 'RSVP elegante con datos clave.',
    theme: 'wedding',
    coverUrl:
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1800&auto=format&fit=crop',
    form: {
      title: '¡Nos casamos! ✨',
      type: 'multi-step',
      fontTheme: 'wedding', // Great Vibes + Lora
      backgroundTint: 'darker',
      steps: [
        {
          id: 's1',
          fields: [
            {
              id: 'name',
              type: 'text',
              label: 'Tu nombre completo',
              name: 'name',
              required: true
            }
          ]
        },
        {
          id: 's2',
          fields: [
            {
              id: 'attend',
              type: 'select',
              label: '¿Asistirás?',
              name: 'attend',
              required: true,
              options: [
                { label: 'Sí', value: 'yes' },
                { label: 'No', value: 'no' }
              ]
            }
          ]
        },
        {
          id: 's3',
          fields: [
            {
              id: 'menu',
              type: 'select',
              label: 'Preferencia de menú',
              name: 'menu',
              options: [
                { label: 'Regular', value: 'regular' },
                { label: 'Vegetariano', value: 'veg' },
                { label: 'Infantil', value: 'kids' }
              ]
            }
          ]
        },
        {
          id: 's4',
          fields: [
            {
              id: 'notes',
              type: 'textarea',
              label: 'Notas (alergias, etc.)',
              name: 'notes'
            }
          ]
        }
      ]
    }
  },

  // PERFUMES (serif fashion)
  {
    id: 'perfume-market-study',
    name: 'Estudio de mercado: Perfumes',
    description: 'Preferencias olfativas y hábitos de compra.',
    theme: 'perfume',
    coverUrl:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1800&auto=format&fit=crop', // botella perfume
    form: {
      title: 'Encuesta de Perfumes',
      type: 'multi-step',
      fontTheme: 'perfume', // Cormorant
      backgroundTint: 'darker',
      steps: [
        {
          id: 'p1',
          fields: [
            {
              id: 'age',
              type: 'select',
              label: 'Rango de edad',
              name: 'age',
              required: true,
              options: [
                { label: '18-24', value: '18-24' },
                { label: '25-34', value: '25-34' },
                { label: '35-44', value: '35-44' },
                { label: '45+', value: '45+' }
              ]
            }
          ]
        },
        {
          id: 'p2',
          fields: [
            {
              id: 'families',
              type: 'select',
              label: 'Familias favoritas',
              name: 'families',
              multiple: true,
              options: [
                { label: 'Floral', value: 'floral' },
                { label: 'Amaderada', value: 'woody' },
                { label: 'Oriental', value: 'oriental' },
                { label: 'Cítrica', value: 'citrus' }
              ]
            }
          ]
        },
        {
          id: 'p3',
          fields: [
            {
              id: 'budget',
              type: 'select',
              label: 'Presupuesto habitual',
              name: 'budget',
              options: [
                { label: '<$50', value: 'a' },
                { label: '$50-$100', value: 'b' },
                { label: '$100-$200', value: 'c' },
                { label: '$200+', value: 'd' }
              ]
            }
          ]
        },
        {
          id: 'p4',
          fields: [
            {
              id: 'brand',
              type: 'text',
              label: 'Marca favorita',
              name: 'brand'
            }
          ]
        }
      ]
    }
  },

  // RESTAURANTE (asegurar imagen) (moderna/sans)
  {
    id: 'restaurant-reservation',
    name: 'Reserva de restaurante',
    description: 'Fecha, horario y preferencias.',
    theme: 'event',
    coverUrl:
      'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1800&auto=format&fit=crop', // mesa restaurante cálida
    form: {
      title: 'Reserva tu mesa',
      type: 'multi-step',
      fontTheme: 'event', // Poppins
      backgroundTint: 'dark',
      steps: [
        {
          id: 'r1',
          fields: [
            {
              id: 'date',
              type: 'date',
              label: 'Fecha',
              name: 'date',
              required: true
            }
          ]
        },
        {
          id: 'r2',
          fields: [
            {
              id: 'time',
              type: 'text',
              label: 'Horario',
              name: 'time',
              placeholder: '20:30',
              required: true
            }
          ]
        },
        {
          id: 'r3',
          fields: [
            {
              id: 'people',
              type: 'select',
              label: 'Personas',
              name: 'people',
              required: true,
              options: [
                { label: '2', value: '2' },
                { label: '3-4', value: '4' },
                { label: '5-6', value: '6' },
                { label: '7+', value: '7' }
              ]
            }
          ]
        },
        {
          id: 'r4',
          fields: [
            { id: 'notes', type: 'textarea', label: 'Notas', name: 'notes' }
          ]
        }
      ]
    }
  },

  // FITNESS (tech/sans)
  {
    id: 'fitness-signup',
    name: 'Inscripción a clase fitness',
    description: 'Nivel, horario y objetivos.',
    theme: 'tech',
    coverUrl:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1800&auto=format&fit=crop', // gym dinámico
    form: {
      title: 'Únete a la clase',
      type: 'multi-step',
      fontTheme: 'tech', // Inter
      backgroundTint: 'medium',
      steps: [
        {
          id: 'f1',
          fields: [
            {
              id: 'name',
              type: 'text',
              label: 'Nombre',
              name: 'name',
              required: true
            }
          ]
        },
        {
          id: 'f2',
          fields: [
            {
              id: 'level',
              type: 'select',
              label: 'Nivel',
              name: 'level',
              required: true,
              options: [
                { label: 'Inicial', value: 'beginner' },
                { label: 'Intermedio', value: 'intermediate' },
                { label: 'Avanzado', value: 'advanced' }
              ]
            }
          ]
        },
        {
          id: 'f3',
          fields: [
            { id: 'goal', type: 'textarea', label: 'Objetivo', name: 'goal' }
          ]
        }
      ]
    }
  }
];
