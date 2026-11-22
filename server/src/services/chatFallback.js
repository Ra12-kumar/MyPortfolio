/**
 * Rule-based answers used when the LLM provider is not configured or fails.
 * Only uses approved portfolio content — never invents details.
 */
const INQUIRY_HINT = 'If you share a few details through the Project Inquiry form, Ram can review your requirement and respond personally.';

const intents = [
  {
    match: /\b(price|pricing|cost|costs|budget|quote|charge|rate|expensive|cheap|how much)\b/i,
    reply: () =>
      `Pricing depends on the scope, features, integrations and timeline, so no fixed prices are quoted before understanding the requirement. After a short discovery discussion you receive a clear written estimate. ${INQUIRY_HINT}`,
    suggestInquiry: true,
  },
  {
    match: /\b(how long|timeline|deadline|duration|when can|delivery|weeks?|months?)\b/i,
    reply: () =>
      `Timelines depend on the scope and feedback cycles — a simple website is usually much quicker than a full business system. A realistic schedule with milestones is agreed after discovery. ${INQUIRY_HINT}`,
    suggestInquiry: true,
  },
  {
    match: /\b(gym|fitness|member(ship)?s?|trainer|attendance)\b/i,
    reply: ({ projects }) => describeProject(projects, 'gym'),
    suggestInquiry: true,
  },
  {
    match: /\b(consultan(cy|t)|crm|leads?|follow[- ]?ups?|clients? management)\b/i,
    reply: ({ projects }) => describeProject(projects, 'consultancy'),
    suggestInquiry: true,
  },
  {
    match: /\b(shop|store|wholesale|retail|e-?commerce|products?|catalog(ue)?)\b/i,
    reply: ({ projects }) => describeProject(projects, 'shop'),
    suggestInquiry: true,
  },
  {
    match: /\b(ai|chatbot|bot|automation|automate|llm|gpt|assistant)\b/i,
    reply: () =>
      'Ram integrates AI assistants that answer customer questions from approved business content, help qualify leads, assist with appointment requests, answer questions about business documents and automate repetitive workflows. AI reduces repetitive work — it does not replace human judgement, and sensitive conversations still go to a person. What would you like to automate?',
    suggestInquiry: true,
  },
  {
    match: /\b(projects?|portfolio|previous work|your work|built|examples?|case stud(y|ies))\b/i,
    reply: ({ projects }) =>
      `Featured projects:\n${projects.map((p) => `- ${p.title} (${p.category})`).join('\n')}\nAsk me about any of them for details.`,
  },
  {
    match: /\b(process|steps?|approach|methodology|how do you work)\b/i,
    reply: () =>
      'The process has seven steps: 1) Discovery & consultation, 2) Requirement gathering, 3) Planning & architecture, 4) UI/UX design, 5) Development & integration, 6) Testing & deployment, 7) Support & improvements.',
  },
  {
    match: /\b(tech|stack|technolog(y|ies)|react|node|supabase|postgres|database|framework|language)\b/i,
    reply: () =>
      'Typical stack: React and Tailwind CSS on the frontend, Node.js and Express for APIs, Supabase/PostgreSQL (or MongoDB) for data, LLM integrations for AI features, and deployment on platforms like Vercel and Render. The stack is chosen to fit the business need.',
  },
  {
    match: /\b(services?|offer|help with|what can you|what do you do)\b/i,
    reply: ({ services }) =>
      `Services offered:\n${services.map((s) => `- ${s.title}`).join('\n')}\nTell me about your business and I can suggest the right fit.`,
  },
  {
    match: /\b(contact|email|phone|call|whatsapp|reach|hire|talk|meeting|consultation)\b/i,
    reply: () =>
      'The best way to get in touch is the Project Inquiry form in the contact section of this page — it goes straight to Ram, and you can choose your preferred contact method there.',
    suggestInquiry: true,
  },
  {
    match: /\b(maintenance|support|after launch|bug fix(es)?)\b/i,
    reply: () =>
      'Yes — maintenance, fixes and feature enhancements are available on terms agreed together, such as a support period after launch or ongoing work as needed.',
  },
  {
    match: /^\s*(hi|hello|hey|namaste|good (morning|afternoon|evening))\b/i,
    reply: () =>
      'Hello! Are you looking to build a website, automate part of your business, or develop custom software? Tell me a little about your business and what you need.',
  },
];

function describeProject(projects, key) {
  const p = projects.find((x) => x.previewKey === key) || projects.find((x) => x.slug?.includes(key));
  if (!p) return `Ram builds custom solutions for this kind of business. ${INQUIRY_HINT}`;
  const features = (p.features || []).slice(0, 6).map((f) => `- ${f}`).join('\n');
  return `${p.title}: ${p.summary}\nKey features:\n${features}\nA similar solution can be customised to your workflow. ${INQUIRY_HINT}`;
}

export function fallbackReply(message, knowledge) {
  for (const intent of intents) {
    if (intent.match.test(message)) {
      return { reply: intent.reply(knowledge), suggestInquiry: Boolean(intent.suggestInquiry) };
    }
  }
  return {
    reply:
      "I can help with questions about Ram's services, completed projects, technology and development process. Could you tell me a bit about your business and what you'd like to build or automate?",
    suggestInquiry: false,
  };
}
