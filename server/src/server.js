import { createApp } from './app.js';
import { config } from './config/env.js';
import { logger } from './config/logger.js';

const app = createApp();

const server = app.listen(config.PORT, () => {
  logger.info(
    {
      port: config.PORT,
      env: config.NODE_ENV,
      database: config.supabaseEnabled,
      ai: config.llmEnabled,
      email: config.emailEnabled,
    },
    `API listening on http://localhost:${config.PORT}`,
  );
  if (!config.supabaseEnabled) {
    logger.warn(
      config.fileInquiryStoreEnabled
        ? 'Supabase is not configured: inquiries are saved to a local file and the admin dashboard is disabled.'
        : 'Supabase is not configured: inquiries and the admin dashboard are disabled.',
    );
  }
  if (config.isProduction) {
    if (config.corsOrigins.every((o) => /localhost|127.0.0.1/.test(o))) logger.warn('CORS_ORIGINS only allows localhost: set it to your frontend domain in production.');
    if (!config.emailEnabled) logger.warn('E-mail notifications are not configured (RESEND_API_KEY / NOTIFY_EMAIL_*): new inquiries will not be e-mailed.');
  }
  if (!config.llmEnabled) logger.warn('LLM_API_KEY not set: chatbot will use the rule-based fallback responder.');
});

// Stop slow-loris style connections and keep keep-alive longer than typical proxy idle timeouts.
server.requestTimeout = 30_000;
server.headersTimeout = 35_000;
server.keepAliveTimeout = 65_000;

function shutdown(signal) {
  logger.info({ signal }, 'Shutting down');
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 10000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('unhandledRejection', (reason) => logger.error({ reason }, 'Unhandled promise rejection'));
process.on('uncaughtException', (err) => {
  // State is unknown after an uncaught exception: log, then exit so the process manager restarts us.
  logger.fatal({ err }, 'Uncaught exception');
  process.exit(1);
});
