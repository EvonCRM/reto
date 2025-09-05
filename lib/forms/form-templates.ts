// lib/form-templates.ts
import type { FontTheme } from '@/lib/fonts/fonts';
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
  {
    id: 'contact-basic',
    name: 'Basic contact',
    description: 'Name, email, phone and message.',
    theme: 'elegant',
    coverUrl:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1800&auto=format&fit=crop',
    form: {
      title: 'Contact form',
      description: 'Tell us how we can help.',
      type: 'simple',
      fontTheme: 'elegant',
      backgroundTint: 'dark',
      steps: [
        {
          id: 'step-contact',
          title: 'Your info',
          fields: [
            {
              id: 'full-name',
              type: 'text',
              label: 'Full name',
              name: 'full-name',
              placeholder: 'Your first and last name',
              required: true,
              validations: { minLength: 3, maxLength: 80 }
            },
            {
              id: 'email',
              type: 'text',
              label: 'Email',
              name: 'email',
              placeholder: 'you@example.com',
              required: true,
              validations: { regex: 'email' }
            },
            {
              id: 'phone',
              type: 'text',
              label: 'Phone',
              name: 'phone',
              placeholder: '5512345678',
              required: false,
              validations: { regex: 'phone' }
            },
            {
              id: 'topic',
              type: 'select',
              label: 'Contact reason',
              name: 'topic',
              required: true,
              options: [
                { label: 'Support', value: 'support' },
                { label: 'Sales', value: 'sales' },
                { label: 'Billing', value: 'billing' },
                { label: 'Other', value: 'other' }
              ]
            },
            {
              id: 'message',
              type: 'textarea',
              label: 'Message',
              name: 'message',
              placeholder: 'Share the details…',
              required: true,
              validations: { minLength: 10, maxLength: 600 }
            }
          ]
        }
      ]
    }
  },

  // EVENT / RSVP
  {
    id: 'event-rsvp',
    name: 'Event RSVP',
    description: 'Confirm attendance and preferences.',
    theme: 'event',
    coverUrl:
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1800&auto=format&fit=crop',
    form: {
      title: 'Event registration',
      description: 'Confirm your attendance and session preferences.',
      type: 'multi-step',
      fontTheme: 'event',
      backgroundTint: 'dark',
      steps: [
        {
          id: 'intro',
          title: 'Your info',
          fields: [
            {
              id: 'name',
              type: 'text',
              label: 'Full name',
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
              label: 'Company',
              name: 'company',
              required: false
            }
          ]
        },
        {
          id: 'preferences',
          title: 'Preferences',
          fields: [
            {
              id: 'track',
              type: 'select',
              label: 'Track of interest',
              name: 'track',
              required: true,
              options: [
                { label: 'Frontend', value: 'fe' },
                { label: 'Backend', value: 'be' },
                { label: 'AI/ML', value: 'ai' }
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
                { label: 'Advanced React', value: 'react' },
                { label: 'Node & APIs', value: 'node' },
                { label: 'Prompt Engineering', value: 'prompt' },
                { label: 'Testing', value: 'testing' }
              ]
            },
            {
              id: 'date',
              type: 'date',
              label: 'Attendance date',
              name: 'date',
              required: true
            }
          ]
        }
      ]
    }
  },

  // JOB APPLICATION
  {
    id: 'job-application',
    name: 'Job application',
    description: 'Personal info, skills and resume summary.',
    theme: 'editorial',
    coverUrl:
      'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1800&auto=format&fit=crop',
    form: {
      title: 'Apply to the role',
      description: 'Complete your info so we can evaluate your profile.',
      type: 'multi-step',
      fontTheme: 'editorial',
      backgroundTint: 'dark',
      steps: [
        {
          id: 'profile',
          title: 'Profile',
          fields: [
            {
              id: 'full-name',
              type: 'text',
              label: 'Full name',
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
              label: 'CURP (Mexico)',
              name: 'curp',
              required: false,
              validations: { regex: 'curp' }
            }
          ]
        },
        {
          id: 'skills',
          title: 'Skills',
          fields: [
            {
              id: 'stack',
              type: 'select',
              label: 'Primary stack',
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
              label: 'Skills',
              name: 'skills',
              required: true,
              multiple: true,
              minSelected: 1,
              maxSelected: 5,
              options: [
                { label: 'React', value: 'react' },
                { label: 'Node.js', value: 'node' },
                { label: 'TypeScript', value: 'ts' },
                { label: 'Testing (Jest)', value: 'jest' },
                { label: 'SQL', value: 'sql' },
                { label: 'Docker', value: 'docker' }
              ]
            },
            {
              id: 'about',
              type: 'textarea',
              label: 'Summary',
              name: 'about',
              placeholder: 'Tell us briefly about you',
              required: true,
              validations: { minLength: 30, maxLength: 800 }
            }
          ]
        }
      ]
    }
  },

  // SUPPORT TICKET
  {
    id: 'support-ticket',
    name: 'Support ticket',
    description: 'Create a ticket with priority and details.',
    theme: 'tech',
    coverUrl:
      'https://images.unsplash.com/photo-1516387938699-a93567ec168e?q=80&w=1800&auto=format&fit=crop',
    form: {
      title: 'Support ticket',
      description: 'Describe the issue so we can help.',
      type: 'simple',
      fontTheme: 'tech',
      backgroundTint: 'darker',
      steps: [
        {
          id: 'ticket',
          fields: [
            {
              id: 'full-name',
              type: 'text',
              label: 'Full name',
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
              id: 'priority',
              type: 'select',
              label: 'Priority',
              name: 'priority',
              required: true,
              options: [
                { label: 'Low', value: 'low' },
                { label: 'Medium', value: 'medium' },
                { label: 'High', value: 'high' }
              ]
            },
            {
              id: 'category',
              type: 'select',
              label: 'Category',
              name: 'category',
              required: true,
              options: [
                { label: 'Access', value: 'access' },
                { label: 'Billing', value: 'billing' },
                { label: 'Bug', value: 'bug' },
                { label: 'Improvement', value: 'improvement' }
              ]
            },
            {
              id: 'description',
              type: 'textarea',
              label: 'Description',
              name: 'description',
              required: true,
              validations: { minLength: 10 }
            }
          ]
        }
      ]
    }
  },

  // CUSTOMER FEEDBACK / NPS
  {
    id: 'customer-feedback',
    name: 'Customer feedback (NPS)',
    description: 'NPS question + open comments.',
    theme: 'aurora',
    coverUrl:
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1800&auto=format&fit=crop',
    form: {
      title: 'Satisfaction survey',
      description: 'Your opinion helps us improve.',
      type: 'multi-step',
      fontTheme: 'editorial',
      backgroundTint: 'dark',
      steps: [
        {
          id: 'intro',
          title: 'Your info',
          fields: [
            {
              id: 'full-name',
              type: 'text',
              label: 'Full name',
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
            }
          ]
        },
        {
          id: 'nps',
          title: 'Satisfaction',
          fields: [
            {
              id: 'nps',
              type: 'select',
              label: 'How likely are you to recommend us?',
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
          id: 'comments',
          title: 'Comments',
          fields: [
            {
              id: 'what-like',
              type: 'textarea',
              label: 'What did you like?',
              name: 'what-like',
              required: false
            },
            {
              id: 'improve',
              type: 'textarea',
              label: 'What can we improve?',
              name: 'improve',
              required: false
            }
          ]
        }
      ]
    }
  },

  // BOOKING / APPOINTMENT
  {
    id: 'booking-intake',
    name: 'Booking / Appointment',
    description: 'Customer info and preferred date.',
    theme: 'elegant',
    coverUrl:
      'https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=1800&auto=format&fit=crop',
    form: {
      title: 'Request an appointment',
      description: 'Choose a date and share your details.',
      type: 'simple',
      fontTheme: 'elegant',
      backgroundTint: 'dark',
      steps: [
        {
          id: 'booking',
          fields: [
            {
              id: 'full-name',
              type: 'text',
              label: 'Full name',
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
              id: 'service',
              type: 'select',
              label: 'Service',
              name: 'service',
              required: true,
              options: [
                { label: 'Consultation', value: 'consult' },
                { label: 'Demo', value: 'demo' },
                { label: 'Advisory', value: 'advisory' }
              ]
            },
            {
              id: 'date',
              type: 'date',
              label: 'Preferred date',
              name: 'date',
              required: true
            },
            {
              id: 'notes',
              type: 'textarea',
              label: 'Notes',
              name: 'notes',
              required: false
            }
          ]
        }
      ]
    }
  },

  // WEDDING INVITE
  {
    id: 'wedding-invite',
    name: 'Wedding invite',
    description: 'Elegant RSVP with key details.',
    theme: 'wedding',
    coverUrl:
      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1800&auto=format&fit=crop',
    form: {
      title: "We're getting married! ✨",
      type: 'multi-step',
      fontTheme: 'wedding',
      backgroundTint: 'darker',
      steps: [
        {
          id: 's1',
          fields: [
            {
              id: 'full-name',
              type: 'text',
              label: 'Your full name',
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
            }
          ]
        },
        {
          id: 's2',
          fields: [
            {
              id: 'attend',
              type: 'select',
              label: 'Will you attend?',
              name: 'attend',
              required: true,
              options: [
                { label: 'Yes', value: 'yes' },
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
              label: 'Menu preference',
              name: 'menu',
              options: [
                { label: 'Regular', value: 'regular' },
                { label: 'Vegetarian', value: 'veg' },
                { label: 'Kids', value: 'kids' }
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
              label: 'Notes (allergies, etc.)',
              name: 'notes'
            }
          ]
        }
      ]
    }
  },

  // PERFUME MARKET STUDY
  {
    id: 'perfume-market-study',
    name: 'Market study: Perfumes',
    description: 'Olfactive preferences and buying habits.',
    theme: 'perfume',
    coverUrl:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=1800&auto=format&fit=crop',
    form: {
      title: 'Perfume survey',
      type: 'multi-step',
      fontTheme: 'perfume',
      backgroundTint: 'darker',
      steps: [
        {
          id: 'p0',
          title: 'Your info',
          fields: [
            {
              id: 'full-name',
              type: 'text',
              label: 'Full name',
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
            }
          ]
        },
        {
          id: 'p1',
          title: 'Age',
          fields: [
            {
              id: 'age',
              type: 'select',
              label: 'Age range',
              name: 'age',
              required: true,
              options: [
                { label: '18–24', value: '18-24' },
                { label: '25–34', value: '25-34' },
                { label: '35–44', value: '35-44' },
                { label: '45+', value: '45+' }
              ]
            }
          ]
        },
        {
          id: 'p2',
          title: 'Families',
          fields: [
            {
              id: 'families',
              type: 'select',
              label: 'Favorite families',
              name: 'families',
              multiple: true,
              options: [
                { label: 'Floral', value: 'floral' },
                { label: 'Woody', value: 'woody' },
                { label: 'Oriental', value: 'oriental' },
                { label: 'Citrus', value: 'citrus' }
              ]
            }
          ]
        },
        {
          id: 'p3',
          title: 'Budget',
          fields: [
            {
              id: 'budget',
              type: 'select',
              label: 'Typical budget',
              name: 'budget',
              options: [
                { label: '< $50', value: 'a' },
                { label: '$50–$100', value: 'b' },
                { label: '$100–$200', value: 'c' },
                { label: '$200+', value: 'd' }
              ]
            }
          ]
        },
        {
          id: 'p4',
          title: 'Brand',
          fields: [
            {
              id: 'brand',
              type: 'text',
              label: 'Favorite brand',
              name: 'brand'
            }
          ]
        }
      ]
    }
  },

  // RESTAURANT RESERVATION
  {
    id: 'restaurant-reservation',
    name: 'Restaurant reservation',
    description: 'Date, time and preferences.',
    theme: 'event',
    coverUrl:
      'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1800&auto=format&fit=crop',
    form: {
      title: 'Book your table',
      type: 'multi-step',
      fontTheme: 'event',
      backgroundTint: 'dark',
      steps: [
        {
          id: 'r0',
          title: 'Your info',
          fields: [
            {
              id: 'full-name',
              type: 'text',
              label: 'Full name',
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
            }
          ]
        },
        {
          id: 'r1',
          title: 'Date',
          fields: [
            {
              id: 'date',
              type: 'date',
              label: 'Date',
              name: 'date',
              required: true
            }
          ]
        },
        {
          id: 'r2',
          title: 'Time',
          fields: [
            {
              id: 'time',
              type: 'text',
              label: 'Time',
              name: 'time',
              placeholder: '20:30',
              required: true
            }
          ]
        },
        {
          id: 'r3',
          title: 'Guests',
          fields: [
            {
              id: 'people',
              type: 'select',
              label: 'Guests',
              name: 'people',
              required: true,
              options: [
                { label: '2', value: '2' },
                { label: '3–4', value: '4' },
                { label: '5–6', value: '6' },
                { label: '7+', value: '7' }
              ]
            }
          ]
        },
        {
          id: 'r4',
          title: 'Notes',
          fields: [
            { id: 'notes', type: 'textarea', label: 'Notes', name: 'notes' }
          ]
        }
      ]
    }
  },

  // FITNESS SIGNUP
  {
    id: 'fitness-signup',
    name: 'Fitness class signup',
    description: 'Level, schedule and goals.',
    theme: 'tech',
    coverUrl:
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=1800&auto=format&fit=crop',
    form: {
      title: 'Join the class',
      type: 'multi-step',
      fontTheme: 'tech',
      backgroundTint: 'medium',
      steps: [
        {
          id: 'f1',
          title: 'Your info',
          fields: [
            {
              id: 'full-name',
              type: 'text',
              label: 'Full name',
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
            }
          ]
        },
        {
          id: 'f2',
          title: 'Level',
          fields: [
            {
              id: 'level',
              type: 'select',
              label: 'Level',
              name: 'level',
              required: true,
              options: [
                { label: 'Beginner', value: 'beginner' },
                { label: 'Intermediate', value: 'intermediate' },
                { label: 'Advanced', value: 'advanced' }
              ]
            }
          ]
        },
        {
          id: 'f3',
          title: 'Goal',
          fields: [
            { id: 'goal', type: 'textarea', label: 'Goal', name: 'goal' }
          ]
        }
      ]
    }
  }
];
