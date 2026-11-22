import rateLimit from 'express-rate-limit';
import { config } from '../config/env.js';

const handler = (message, code) => (_req, res) =>
  res.status(429).json({ error: { code, message } });

const base = {
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  skip: () => config.isTest,
};

export const apiLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 300,
  handler: handler('Too many requests. Please slow down.', 'RATE_LIMITED'),
});

export const inquiryLimiter = rateLimit({
  ...base,
  windowMs: 60 * 60 * 1000,
  limit: 5,
  handler: handler('Too many inquiries from this network. Please try again later or contact me directly.', 'INQUIRY_RATE_LIMITED'),
});

export const chatLimiter = rateLimit({
  ...base,
  windowMs: 10 * 60 * 1000,
  limit: 30,
  handler: handler('You have sent a lot of messages. Please wait a few minutes or use the contact form.', 'CHAT_RATE_LIMITED'),
});

export const loginLimiter = rateLimit({
  ...base,
  windowMs: 15 * 60 * 1000,
  limit: 10,
  handler: handler('Too many login attempts. Please try again later.', 'LOGIN_RATE_LIMITED'),
});
