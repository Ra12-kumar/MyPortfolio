/**
 * Technology data shown in the Technical Skills orbit. Kept free of icon
 * paths so the page's main bundle stays small — logos live in techIcons.js,
 * which is only loaded together with the 3D scene.
 */
export const techCategories = [
  { id: 'frontend', label: 'Frontend' },
  { id: 'backend', label: 'Backend' },
  { id: 'database', label: 'Database' },
  { id: 'ai', label: 'AI' },
];

export const technologies = [
  { id: 'react', name: 'React.js', category: 'frontend', description: 'Component-based UI library for fast, interactive and maintainable front-ends.' },
  { id: 'html5', name: 'HTML5', category: 'frontend', description: 'Semantic, accessible markup that search engines and assistive tech understand.' },
  { id: 'css3', name: 'CSS3', category: 'frontend', description: 'Responsive layouts, animation and design systems that work on every screen size.' },
  { id: 'javascript', name: 'JavaScript', category: 'frontend', description: 'The language of the web — used across the browser and the server.' },
  { id: 'node', name: 'Node.js', category: 'backend', description: 'Fast, scalable server-side runtime for APIs and real-time services.' },
  { id: 'express', name: 'Express.js', category: 'backend', description: 'Minimal, battle-tested web framework for building REST APIs on Node.js.' },
  { id: 'java', name: 'Java', category: 'backend', description: 'Strongly-typed, object-oriented language for reliable back-end logic.' },
  { id: 'rest', name: 'REST APIs', category: 'backend', description: 'Clean, documented, secure APIs that connect your apps and third-party services.' },
  { id: 'postgres', name: 'PostgreSQL', category: 'database', description: 'Robust relational database with row-level security — the core of my data layer.' },
  { id: 'sql', name: 'SQL', category: 'database', description: 'Schema design, queries and reporting that keep your business data organised.' },
  { id: 'rag', name: 'RAG', category: 'ai', description: 'Retrieval-Augmented Generation: AI answers grounded in your own documents.' },
  { id: 'ai-apis', name: 'AI APIs', category: 'ai', description: 'LLM integration with secure server-side keys, prompts and guardrails.' },
  { id: 'chatbot', name: 'Chatbots', category: 'ai', description: 'Customer-facing assistants that answer questions and qualify leads.' },
];
