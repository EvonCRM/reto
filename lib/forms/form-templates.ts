// lib/form-templates.ts
import type { FormConfig } from '@/types/form';

// Opcional: si ya tienes un tipo propio para el meta, úsalo
export type TemplateMeta = {
  id: string;
  name: string;
  description: string;
  theme: string; // e.g. 'ocean' | 'sunset' | ...
  coverUrl: string; // imagen de portada del template (para tarjetas y preview)
  form: FormConfig; // estructura del formulario
};

export const FORM_TEMPLATES: TemplateMeta[] = [
  {
    id: 'contact-basic',
    name: 'Contacto básico',
    description: 'Nombre, correo, teléfono y mensaje.',
    theme: 'ocean',
    coverUrl:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1800&auto=format&fit=crop',
    form: {
      title: 'Formulario de contacto',
      description: 'Cuéntanos cómo podemos ayudarte.',
      type: 'simple',
      infoTop: 'Responderemos a la brevedad.',
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

  {
    id: 'event-rsvp',
    name: 'Registro a evento',
    description: 'Confirma asistencia y preferencias.',
    theme: 'sunset',
    coverUrl:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1800&auto=format&fit=crop',
    form: {
      title: 'Registro al evento',
      description: 'Confirma tu asistencia y preferencias de sesión.',
      type: 'multi-step',
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

  {
    id: 'job-application',
    name: 'Solicitud de empleo',
    description: 'Datos personales, habilidades y CV.',
    theme: 'forest',
    coverUrl:
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1800&auto=format&fit=crop',
    form: {
      title: 'Aplicación a vacante',
      description: 'Completa tu información para evaluar tu perfil.',
      type: 'multi-step',
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

  {
    id: 'support-ticket',
    name: 'Soporte técnico',
    description: 'Crea un ticket con prioridad y adjuntos.',
    theme: 'terminal',
    coverUrl:
      'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1800&auto=format&fit=crop',
    form: {
      title: 'Ticket de soporte',
      description: 'Describe el problema para ayudarte mejor.',
      type: 'simple',
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

  {
    id: 'customer-feedback',
    name: 'Feedback de clientes (NPS)',
    description: 'Pregunta NPS + campos abiertos.',
    theme: 'aurora',
    coverUrl:
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1800&auto=format&fit=crop',
    form: {
      title: 'Encuesta de satisfacción',
      description: 'Tu opinión nos ayuda a mejorar.',
      type: 'multi-step',
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

  {
    id: 'booking-intake',
    name: 'Reserva / Cita',
    description: 'Datos del cliente y fecha preferida.',
    theme: 'paper',
    coverUrl:
      'https://images.unsplash.com/photo-1523741543316-beb7fc7023d8?q=80&w=1800&auto=format&fit=crop',
    form: {
      title: 'Solicitar cita',
      description: 'Elige fecha y comparte tus datos.',
      type: 'simple',
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
  }
];
