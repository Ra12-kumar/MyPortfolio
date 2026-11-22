/**
 * Approved knowledge base for the portfolio assistant ("Ram Jatan Kumar Sah —
 * Portfolio RAG Knowledge Base"). It lives in code and is indexed in memory —
 * no database is involved. Each chunk is one retrievable passage:
 *
 *   id        stable identifier (returned as the answer's source)
 *   title     short label
 *   answer    the approved wording the assistant replies with
 *   keywords  extra search terms (synonyms) so differently-worded questions still match
 *
 * Nothing outside this file is ever presented as fact by the RAG assistant.
 */

export const CONTACT = {
  phone: '+91 7323891747',
  whatsapp: 'https://wa.me/917323891747',
  email: 'ramsah01012002@gmail.com',
  mailto: 'mailto:ramsah01012002@gmail.com',
};

export const DIRECT_CONTACT = `You can call or WhatsApp Ram at ${CONTACT.phone}, or email ${CONTACT.email}.`;

export const CONTACT_SHORT = `call or WhatsApp ${CONTACT.phone}, or email ${CONTACT.email}`;

export const WELCOME =
  "Hi! I'm the project assistant for Ram Jatan Kumar Sah. I can help you explore website development, full-stack applications, AI chatbots, RAG solutions, API integrations, and automation. What are you looking to build?";

export const chunks = [
  // ---------- contact ----------
  {
    id: 'contact',
    title: 'Contact details',
    keywords: 'contact call phone mobile number whatsapp message email mail reach talk speak developer ram directly hire get in touch',
    answer: `${DIRECT_CONTACT}\nWhatsApp link: ${CONTACT.whatsapp}\nEmail link: ${CONTACT.mailto}`,
  },
  {
    id: 'not-provided',
    title: 'Information not provided',
    keywords: 'business hours opening timings time open closed working hours availability response time reply address office city country location visit preferred contact hours',
    answer: `Business hours, an address or service location, a response-time commitment and preferred contact hours have not been provided, so I can't say. Please contact Ram directly: ${CONTACT_SHORT}.`,
  },

  // ---------- services ----------
  {
    id: 'service-website',
    title: 'Website development',
    keywords: 'website web site business service portfolio landing page responsive contact enquiry inquiry form redesign redesigning seo analytics deployment site',
    answer:
      'Website development covers business websites, service websites, portfolio websites, landing pages, responsive pages, contact/enquiry forms, and redesigns. To scope a website I would clarify pages, content, brand assets, forms, WhatsApp/email links, gallery, testimonials, SEO basics, analytics, and deployment.',
  },
  {
    id: 'service-fullstack',
    title: 'Full-stack web applications',
    keywords: 'full stack fullstack web application app custom frontend backend api database authentication login dashboard role-based roles admin management system booking enquiry consultancy inventory shop',
    answer:
      'Full-stack web applications are custom applications with a frontend, backend APIs, a database, authentication, dashboards, and role-based access. Example categories include management systems, booking/enquiry systems, consultancy workflows, inventory/shop workflows, and admin dashboards. These are examples, not a guarantee that every feature is already available.',
  },
  {
    id: 'service-chatbot-rag',
    title: 'AI chatbots and RAG',
    keywords: 'ai artificial intelligence chatbot chat bot assistant rag retrieval augmented generation documents faq policies knowledge pdf docx ingestion semantic search metadata filters citations sources fallback lead capture human handoff',
    answer:
      'AI chatbots and RAG: website chatbots that answer from approved company documents, FAQs, policies, product/service information, or internal knowledge. RAG means Retrieval-Augmented Generation: retrieve relevant approved passages and provide them as context to an AI model. We would discuss document upload, PDF/DOCX/website ingestion, semantic search, metadata filters, source labels/citations, fallback, lead capture, and human handoff.',
  },
  {
    id: 'service-api-db',
    title: 'API and database integration',
    keywords: 'api apis integration integrate third-party third party database databases connect connection rest form storage store frontend backend workflows',
    answer:
      'API and database integration covers frontend-to-backend API connections, third-party API integration, form storage, database connections, and REST API workflows.',
  },
  {
    id: 'service-automation',
    title: 'Business automation',
    keywords: 'automation automate automating workflow workflows repetitive manual process routing notifications business-process integrations feasibility',
    answer:
      'For business automation we would discuss repetitive workflows, enquiry routing, notifications, and business-process integrations. Feasibility is assessed before anything is promised.',
  },

  // ---------- project enquiry ----------
  {
    id: 'enquiry-details',
    title: 'What information is needed for a project enquiry',
    keywords: 'enquiry inquiry details information need start required requirements share provide quote brief project goal',
    answer:
      "To start, I need your name or business name, the solution you're after, a short project description, and — if you'd like a follow-up — a phone/WhatsApp number or email. Helpful extras: industry, target users, pages/modules/features, platform, integrations, existing website URL, domain/hosting, logo/content/images, deadline, optional budget, and reference websites.",
  },

  // ---------- approved FAQs ----------
  {
    id: 'faq-services',
    title: 'What services do you offer?',
    keywords: 'services offer provide do what can you help with',
    answer:
      'Website development, full-stack web applications, API and database integration, AI chatbot/RAG solutions, and business automation. Exact scope depends on requirements.',
  },
  {
    id: 'faq-business-website',
    title: 'Can you build a business website?',
    keywords: 'business website build create make site company',
    answer:
      'I can discuss a responsive business website with pages, service information, contact forms, and enquiry options. Please share your business type, required pages, and key features.',
  },
  {
    id: 'faq-chatbot',
    title: 'Can you build an AI chatbot for my website?',
    keywords: 'ai chatbot website bot build add integrate answer visitors questions',
    answer:
      'I can discuss a chatbot that answers visitor questions using approved documents or FAQs through RAG. Please share the documents, expected questions, and when the bot should connect visitors to a person.',
  },
  {
    id: 'faq-rag',
    title: 'What is RAG?',
    keywords: 'rag mean stands for explain definition retrieval augmented generation what is',
    answer:
      'RAG stands for Retrieval-Augmented Generation. It retrieves relevant information from a knowledge base and provides that context to an AI model to help generate an answer grounded in supplied documents.',
  },
  {
    id: 'faq-start',
    title: 'What information do you need to start?',
    keywords: 'information need start begin getting started require requirements provide share documents knowledge sources first steps',
    answer:
      'Project goal, business context, required features, target users, preferred timeline, and a contact method. For RAG, also provide the documents or knowledge sources.',
  },
  {
    id: 'faq-price',
    title: 'How much do you charge?',
    keywords: 'price prices pricing cost costs charge charges fee fees rate rates quote quotation budget expensive cheap affordable how much package discount payment',
    answer:
      'Projects start from ₹2,999 – ₹4,999 and go up based on your requirements: scope, features, integrations, design, and delivery needs. Share your requirements so Ram can review and provide a final quote.',
  },
  {
    id: 'faq-timeline',
    title: 'How long will it take?',
    keywords: 'long take time timeline duration deadline delivery deliver days weeks months quickly fast turnaround when ready finish complete',
    answer:
      'Timeline depends on scope, features, integrations, content readiness, and feedback. A delivery date is not confirmed until requirements are reviewed.',
  },
  {
    id: 'faq-speak',
    title: 'Can I speak directly with the developer?',
    keywords: 'speak talk directly developer ram call meet meeting human person real contact',
    answer: `Yes. Call or WhatsApp ${CONTACT.phone}, or email ${CONTACT.email}.`,
  },
  {
    id: 'faq-location',
    title: 'Where are you located?',
    keywords: 'where located location address based city country office live place area',
    answer: 'A business address or service location has not been provided. Contact Ram directly for location or availability details.',
  },
  {
    id: 'faq-maintenance',
    title: 'Do you provide maintenance?',
    keywords: 'maintenance maintain support after launch updates bug fixes fix ongoing upkeep warranty',
    answer: 'Maintenance arrangements have not been specified. Describe the support needed so Ram can confirm.',
  },
  {
    id: 'faq-guarantee',
    title: 'Can you guarantee rankings or business results?',
    keywords: 'guarantee guaranteed promise rankings ranking rank google seo traffic sales leads revenue results outcome performance growth',
    answer: 'No specific traffic, sales, ranking, or performance outcome is guaranteed in my knowledge base.',
  },
];

/** Follow-up questions per service, asked ONE at a time (from the enquiry-details guidance). */
export const intake = {
  website: {
    label: 'Website development',
    chunk: 'service-website',
    questions: [
      'What does your business do, and which services should the website present?',
      'Which pages do you need (for example Home, Services, About, Contact)?',
      'Do you already have a logo, content and images, or do those still need to be prepared?',
      'Do you need any extras such as bookings, online payments, a blog, multiple languages or an admin area?',
      'Do you already have a domain and hosting?',
    ],
  },
  webapp: {
    label: 'Full-stack web application',
    chunk: 'service-fullstack',
    questions: [
      'Who will use the application, and what user roles are needed (for example admin and staff)?',
      'What are the main workflows or modules it must support?',
      'What data and reports do you need to track?',
      'Will users need to log in, and roughly how many people will use it?',
      'Does it need to connect to other tools or services (payments, messaging, a CRM)?',
      'Are there any security or backup requirements I should note?',
    ],
  },
  chatbot: {
    label: 'AI chatbot / RAG',
    chunk: 'service-chatbot-rag',
    questions: [
      'What should the chatbot help visitors do?',
      'Who will use it — website visitors, customers, or your own team?',
      'Which documents or knowledge sources should it answer from, and in which file types (PDF, DOCX, website pages)?',
      'Roughly how many documents are there, and how often do they change?',
      'Do the documents contain any confidential or personal information?',
      'Should it capture leads, hand over to a person when needed, and show the sources of its answers?',
    ],
  },
  api: {
    label: 'API and database integration',
    chunk: 'service-api-db',
    questions: [
      'Which systems, services or databases do you want to connect?',
      'Do you have API documentation or access details for them?',
      'What should happen when data moves between them (for example store a form submission, sync records)?',
    ],
  },
  automation: {
    label: 'Business automation',
    chunk: 'service-automation',
    questions: [
      'Which repetitive workflow would you like to automate?',
      'What starts that workflow, and what should happen at the end (for example a notification or a routed enquiry)?',
      'Which tools or systems are involved today?',
    ],
  },
};
