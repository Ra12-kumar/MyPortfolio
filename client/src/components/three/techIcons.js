import { siReact, siHtml5, siCss, siJavascript, siNodedotjs, siExpress, siPostgresql } from 'simple-icons';

/**
 * Official brand marks come from the `simple-icons` package (CC0). Technologies
 * with no official mark available there (Java, REST, SQL, RAG, AI APIs,
 * Chatbots) are shown as plain monograms — never as a look-alike logo.
 */
export const techIcons = {
  react: { path: siReact.path, color: `#${siReact.hex}` },
  html5: { path: siHtml5.path, color: `#${siHtml5.hex}` },
  css3: { path: siCss.path, color: '#8a63d2' },
  javascript: { path: siJavascript.path, color: `#${siJavascript.hex}` },
  node: { path: siNodedotjs.path, color: `#${siNodedotjs.hex}` },
  express: { path: siExpress.path, color: '#ffffff' },
  postgres: { path: siPostgresql.path, color: `#${siPostgresql.hex}` },
  java: { mono: 'Java', color: '#f89820' },
  rest: { mono: '{ }', color: '#7c9cff' },
  sql: { mono: 'SQL', color: '#38bdf8' },
  rag: { mono: 'RAG', color: '#a78bfa' },
  'ai-apis': { mono: 'AI', color: '#c4b5fd' },
  chatbot: { mono: 'Bot', color: '#7c9cff' },
};
