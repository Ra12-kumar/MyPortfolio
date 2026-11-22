import pino from 'pino';
import { config } from './env.js';

export const logger = pino({
  level: config.isTest ? 'silent' : config.LOG_LEVEL,
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', '*.password', '*.email', '*.phone'],
    censor: '[redacted]',
  },
  ...(config.isProduction || config.isTest
    ? {}
    : { transport: { target: 'pino-pretty', options: { colorize: true, translateTime: 'SYS:HH:MM:ss' } } }),
});
