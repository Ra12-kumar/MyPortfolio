/**
 * Centralized portfolio content.
 *
 * This file is the single source of truth for business content. It is used by:
 *  - the frontend (as a fallback when the API is unavailable),
 *  - the backend chatbot knowledge base (the AI may only use what is written here),
 *  - the database seed script (server/scripts/seed.js).
 *
 * Contact details are NOT stored here — they come from environment variables.
 * Edit honestly: do not add statistics, clients or claims you cannot verify.
 */

export const profile = {
  name: 'Ram Jatan Kumar Sah',
  shortName: 'RJK',
  title: 'Software Engineer | Full-Stack Developer | AI Solutions Developer | Forward Deployed Engineer (FDE)',
  roles: ['Software Engineer', 'Full-Stack Developer', 'AI Solutions Developer', 'Forward Deployed Engineer'],
  introduction:
    'I help businesses transform their ideas and daily business operations into powerful digital solutions.',
  longIntroduction: [
    'I specialize in developing complete end-to-end web applications, business management systems, AI-powered websites, custom software solutions, and intelligent automation systems.',
    'From understanding client requirements and designing architecture to development, API integration, database management, AI integration, testing, and deployment, I handle the complete development lifecycle.',
    'My goal is to help businesses reduce manual work, improve operational efficiency, automate repetitive tasks, and grow through technology.',
  ],
  marketingMessage:
    "Have a business idea or struggling with manual business operations? Let's turn your idea into a powerful digital solution.",
  secondaryMessage:
    'From business requirements to production-ready applications — I build complete software solutions that help businesses grow.',
};

export const hero = {
  headline: 'Turning Business Challenges Into Powerful Digital Solutions.',
  description:
    'I build end-to-end web applications, AI-powered platforms, and custom business management systems that automate operations, reduce manual effort, and help businesses scale.',
  highlights: [
    'Full-Stack Development',
    'AI Integration & Automation',
    'End-to-End Software Development',
    'Business Process Automation',
  ],
};

export const capabilities = [
  { icon: 'Workflow', title: 'Complete end-to-end development', description: 'One owner for requirements, design, build, testing and deployment.' },
  { icon: 'ClipboardList', title: 'Business requirement analysis', description: 'Understanding your workflows before deciding what to build.' },
  { icon: 'Puzzle', title: 'Custom software solutions', description: 'Software shaped around how your business actually operates.' },
  { icon: 'Bot', title: 'AI chatbot integration', description: 'Assistants that answer common questions and qualify enquiries.' },
  { icon: 'Plug', title: 'API & third-party integrations', description: 'Payments, messaging, CRMs and the tools you already use.' },
  { icon: 'ShieldCheck', title: 'Secure database architecture', description: 'Structured data, role-based access and row-level security.' },
  { icon: 'Rocket', title: 'Production deployment', description: 'Configured environments, hosting and a working release.' },
];

export const about = {
  headline: 'Full-Stack Software Engineer & AI Solutions Developer.',
  paragraphs: [
    "I'm a Full-Stack Software Engineer & AI Solutions Developer with 4 years of experience building modern web applications, intelligent automation systems, and AI-powered solutions that help businesses simplify operations and serve customers better.",
    'I work across the complete software development lifecycle: understanding client requirements, designing scalable solutions, frontend and backend development, database architecture, API integrations, AI automation, testing, and deployment.',
    'My approach is simple: understand the business first, identify opportunities for improvement, and build technology that delivers practical value. Great software is not just about writing code; it is about solving real problems.',
  ],
  workLinks: [
    { label: 'Parlour Service website', url: 'https://parlourservice.vercel.app/' },
    { label: 'Rambilash website', url: 'https://rambilash.vercel.app/' },
  ],
};

/**
 * Technical skills. Set `learning: true` on any skill that is still at a
 * learning stage — it will be labelled honestly on the website.
 */
export const skills = [
  { group: 'Frontend', items: [{ name: 'React.js' }, { name: 'JavaScript' }, { name: 'HTML5' }, { name: 'CSS3' }, { name: 'Tailwind CSS' }] },
  { group: 'Backend', items: [{ name: 'Node.js' }, { name: 'Express.js' }, { name: 'Java' }, { name: 'REST APIs' }] },
  { group: 'Database', items: [{ name: 'Supabase' }, { name: 'PostgreSQL' }, { name: 'MongoDB' }, { name: 'SQL' }] },
  { group: 'AI', items: [{ name: 'LLM integration' }, { name: 'AI chatbots' }, { name: 'AI agents' }, { name: 'Workflow automation' }, { name: 'Prompt engineering' }] },
  { group: 'Tools', items: [{ name: 'Git' }, { name: 'GitHub' }, { name: 'Postman' }, { name: 'Vercel' }, { name: 'Docker' }, { name: 'Cloud deployment' }] },
];

export const services = [
  {
    slug: 'custom-website-development',
    icon: 'Globe',
    title: 'Custom Website Development',
    description: 'Responsive, modern, SEO-friendly business websites that present your business clearly and turn visitors into enquiries.',
    features: ['Responsive design', 'SEO foundations', 'Contact & inquiry forms', 'Fast loading'],
    projectType: 'Business Website',
  },
  {
    slug: 'full-stack-web-applications',
    icon: 'Layers',
    title: 'Full-Stack Web Application Development',
    description: 'Complete frontend, backend, database, authentication, and business logic — delivered as one working application.',
    features: ['Frontend & backend', 'Authentication & roles', 'Database design', 'Business logic'],
    projectType: 'Full-Stack Web Application',
  },
  {
    slug: 'ai-chatbot-integration',
    icon: 'Bot',
    title: 'AI Chatbot Integration',
    description: 'AI assistants that answer customer questions, qualify leads, and reduce repetitive manual interactions.',
    features: ['Trained on your content', 'Lead qualification', 'Secure server-side keys', 'Human handover'],
    projectType: 'AI Chatbot Integration',
  },
  {
    slug: 'business-management-systems',
    icon: 'LayoutDashboard',
    title: 'Business Management Systems',
    description: 'Customized solutions for gyms, consultancies, retail stores, wholesalers, and other businesses.',
    features: ['Records & tracking', 'Dashboards', 'Role-based access', 'Reports'],
    projectType: 'Business Management System',
  },
  {
    slug: 'api-integration-automation',
    icon: 'Plug',
    title: 'API Integration & Automation',
    description: 'Connect payment gateways, messaging services, external APIs, CRM systems, and business tools.',
    features: ['Payment gateways', 'Messaging & email', 'CRM connections', 'Automated workflows'],
    projectType: 'API Integration',
  },
  {
    slug: 'database-backend-development',
    icon: 'Database',
    title: 'Database & Backend Development',
    description: 'Secure, scalable backend systems and database architectures built for maintainability.',
    features: ['REST APIs', 'PostgreSQL / Supabase', 'Access control', 'Validation & logging'],
    projectType: 'Full-Stack Web Application',
  },
  {
    slug: 'website-modernization',
    icon: 'RefreshCw',
    title: 'Existing Website Modernization',
    description: 'Improve performance, usability, responsive design, security, and functionality of your current website.',
    features: ['Performance', 'Mobile experience', 'Security fixes', 'New features'],
    projectType: 'Existing Website Improvement',
  },
];

/**
 * Projects. `previewKey` selects the illustrative in-code mockup used when no
 * real screenshot (`imageUrl`) is supplied. Only set `demoUrl` / `githubUrl`
 * when a real, working link exists — buttons are hidden otherwise.
 */
export const projects = [
  {
    slug: 'gym-management-system',
    number: '01',
    title: 'Gym Management System',
    category: 'Business Management Software',
    previewKey: 'gym',
    summary: 'An end-to-end gym management solution designed to simplify daily gym operations and improve member management.',
    features: [
      'Member registration and management',
      'Membership plans',
      'Subscription tracking',
      'Payment management',
      'Attendance management',
      'Trainer management',
      'Dashboard and analytics',
      'Membership expiry tracking',
      'Automated notifications where configured',
      'Role-based access',
    ],
    businessValue: [
      'Reduces manual administrative work',
      'Centralizes member information',
      'Improves subscription tracking',
      'Makes daily gym operations easier',
    ],
    architecture: ['React frontend', 'Node.js / Express API', 'PostgreSQL database', 'Role-based authentication'],
    imageUrl: null,
    demoUrl: null,
    githubUrl: null,
  },
  {
    slug: 'consultancy-management-system',
    number: '02',
    title: 'Consultancy Management System',
    category: 'CRM & Business Automation',
    previewKey: 'consultancy',
    summary: 'A centralized consultancy management platform designed to manage leads, clients, follow-ups, documents, and daily business operations.',
    features: [
      'Lead management',
      'Client registration',
      'Follow-up tracking',
      'Document management',
      'Status tracking',
      'Employee management',
      'Dashboard and reporting',
      'Automated reminders where configured',
      'Role-based access',
    ],
    businessValue: [
      'Centralized customer information',
      'Better lead tracking',
      'Improved follow-up management',
      'Reduced manual administrative tasks',
    ],
    architecture: ['React frontend', 'Node.js / Express API', 'PostgreSQL database', 'File storage for documents'],
    imageUrl: null,
    demoUrl: null,
    githubUrl: null,
  },
  {
    slug: 'general-wholesale-shop',
    number: '03',
    title: 'General & Wholesale Shop Website',
    category: 'Retail & Wholesale E-Commerce',
    previewKey: 'shop',
    summary: 'A digital platform designed to help general and wholesale businesses showcase products and manage their online customer experience.',
    features: [
      'Product catalog',
      'Product categories',
      'Search and filtering',
      'Product details',
      'Shopping cart if implemented',
      'Order management if implemented',
      'Admin product management',
      'Responsive interface',
    ],
    businessValue: [
      'Improved online product visibility',
      'Better customer experience',
      'Easier product discovery',
      'Digital business presence',
    ],
    architecture: ['React frontend', 'REST API', 'Product database', 'Admin panel'],
    imageUrl: null,
    demoUrl: null,
    githubUrl: null,
  },
];

export const whyMe = {
  headline: 'One Partner. Complete Software Development.',
  items: [
    { icon: 'Infinity', title: 'End-to-End Ownership', description: 'From requirement gathering to deployment — one accountable point of contact.' },
    { icon: 'Briefcase', title: 'Business-First Thinking', description: 'I understand the business problem before selecting the technology.' },
    { icon: 'Sparkles', title: 'AI-Ready Solutions', description: 'I integrate AI to automate repetitive tasks and improve customer experiences.' },
    { icon: 'Settings2', title: 'Customized Development', description: 'Solutions designed around your actual business workflows, not templates.' },
    { icon: 'MessagesSquare', title: 'Transparent Communication', description: 'Clear discussions, progress updates, and requirement validation.' },
    { icon: 'Network', title: 'Scalable Architecture', description: 'Applications designed with maintainability and future expansion in mind.' },
  ],
};

export const processSteps = [
  { step: '01', title: 'Discovery & Consultation', description: "Understand the client's business, goals, and challenges." },
  { step: '02', title: 'Requirement Gathering', description: 'Collect functional and non-functional requirements.' },
  { step: '03', title: 'Planning & Architecture', description: 'Design database schemas, APIs, application architecture, and development milestones.' },
  { step: '04', title: 'UI/UX Design', description: 'Create modern interfaces and user journeys.' },
  { step: '05', title: 'Development & Integration', description: 'Build frontend, backend, databases, and third-party integrations.' },
  { step: '06', title: 'Testing & Deployment', description: 'Perform testing, security checks, and production deployment.' },
  { step: '07', title: 'Support & Improvements', description: 'Provide agreed maintenance, improvements, and feature enhancements.' },
];

export const aiAutomation = {
  headline: 'Make Your Business Smarter With AI Automation.',
  description:
    'Stop spending valuable time on repetitive tasks. Integrate intelligent AI assistants into your business workflows.',
  note: 'AI is designed to reduce repetitive manual work and support your team — not to replace human judgement entirely. Important decisions and sensitive conversations still go to a person.',
  useCases: [
    { icon: 'Headset', title: 'AI customer support chatbot' },
    { icon: 'MessageSquareReply', title: 'Automated customer query handling' },
    { icon: 'Filter', title: 'Lead qualification' },
    { icon: 'CalendarCheck', title: 'Appointment booking assistance' },
    { icon: 'FileSearch', title: 'Business document Q&A' },
    { icon: 'BookOpen', title: 'Internal knowledge assistants' },
    { icon: 'Workflow', title: 'Workflow automation' },
    { icon: 'LifeBuoy', title: 'Customer support assistance' },
  ],
};

export const faqs = [
  {
    slug: 'types-of-projects',
    question: 'What types of websites and applications do you develop?',
    answer:
      'Business websites, e-commerce and catalog websites, full-stack web applications, business management systems (for example gyms, consultancies and shops), AI chatbot integrations, and API integrations and automation.',
  },
  {
    slug: 'business-management-software',
    question: 'Can you build complete business management software?',
    answer:
      'Yes. I handle requirements, database design, backend APIs, the admin interface, authentication with roles, and deployment. Previous work includes gym and consultancy management systems.',
  },
  {
    slug: 'ai-chatbots',
    question: 'Can you integrate AI chatbots into my website?',
    answer:
      'Yes. I build assistants that answer questions from your approved business content, help qualify enquiries, and hand over to a person when needed. API keys stay on the server and usage limits are applied.',
  },
  {
    slug: 'custom-software',
    question: 'Can you develop customized software based on my business requirements?',
    answer:
      'Yes — that is the core of what I do. We start by understanding your current workflow, then design software around it rather than forcing a generic template.',
  },
  {
    slug: 'payments-and-apis',
    question: 'Can you integrate payment gateways and third-party APIs?',
    answer:
      'Yes. Payment gateways, messaging and email services, CRMs and other external APIs can be integrated, subject to the provider\'s availability in your country and their account requirements.',
  },
  {
    slug: 'deployment',
    question: 'Do you provide deployment services?',
    answer:
      'Yes. I can deploy to platforms such as Vercel, Render or Railway with a managed database like Supabase, configure environment variables and domains, and hand over access to you.',
  },
  {
    slug: 'improve-existing-website',
    question: 'Can you improve my existing website?',
    answer:
      'Yes. After reviewing the current site I can improve performance, mobile responsiveness, usability, security and add new features. The scope depends on how the existing site is built.',
  },
  {
    slug: 'cost',
    question: 'How much does custom software development cost?',
    answer:
      'It depends on scope, features, integrations and timeline. I don\'t quote fixed prices before understanding the requirement. After a short discovery discussion I provide a clear written estimate.',
  },
  {
    slug: 'timeline',
    question: 'How long does development take?',
    answer:
      'A simple website is usually much quicker than a full business system, but the actual timeline depends on scope and feedback cycles. A realistic schedule with milestones is agreed after discovery.',
  },
  {
    slug: 'maintenance',
    question: 'Do you provide maintenance and support?',
    answer:
      'Yes. Maintenance, fixes and feature enhancements can be provided on terms agreed together — for example a support period after launch or ongoing work as needed.',
  },
];

/**
 * Testimonials. ONLY add real, verified feedback from actual clients, with
 * their permission. While this list is empty the website shows a
 * "Built With Real Business Requirements" section instead.
 */
export const testimonials = [];

export const inquiryOptions = {
  projectTypes: [
    'Business Website',
    'E-commerce Website',
    'Full-Stack Web Application',
    'AI Chatbot Integration',
    'Business Management System',
    'API Integration',
    'Existing Website Improvement',
    'Other',
  ],
  budgets: ['Not sure yet', '₹2,999 – ₹4,999', '₹5,000 – ₹9,999', '₹10,000 – ₹24,999', '₹25,000 – ₹49,999', '₹50,000+'],
  timelines: ['Flexible', 'As soon as possible', 'Within 1 month', '1 – 3 months', '3+ months'],
  contactMethods: ['Email', 'Phone', 'WhatsApp'],
};

export const inquiryStatuses = ['new', 'contacted', 'in_discussion', 'proposal_sent', 'converted', 'rejected'];
