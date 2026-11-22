/**
 * DEMO knowledge base for the AI automation showcase.
 * It describes a FICTIONAL sample business — it is not a client and is
 * clearly labelled as a demo in the UI. Runs entirely in the browser.
 */
export const demoBusiness = {
  name: 'Sample Fitness Studio',
  note: 'Fictional business used for demonstration only',
};

const entries = [
  {
    keywords: ['hour', 'open', 'timing', 'time', 'close', 'schedule'],
    answer: 'We are open Monday to Saturday, 6:00 AM – 9:00 PM, and Sunday 7:00 AM – 12:00 PM. (demo data)',
  },
  {
    keywords: ['plan', 'membership', 'price', 'fee', 'cost', 'join'],
    answer:
      'We offer Monthly, Quarterly and Annual memberships. I can share the details of each plan, or connect you with the front desk to sign up. Which plan interests you? (demo data)',
  },
  {
    keywords: ['trainer', 'personal', 'coach'],
    answer: 'Personal training sessions are available with certified trainers. Would you like me to request a free consultation slot for you? (demo data)',
  },
  {
    keywords: ['book', 'appointment', 'trial', 'visit', 'slot'],
    answer:
      'Sure! I can request a trial session. Please share your preferred day and time — the team will confirm by phone or WhatsApp. (In a real setup this creates a booking request in the dashboard.)',
    action: 'Booking request captured',
  },
  {
    keywords: ['renew', 'expire', 'expiry', 'due', 'payment', 'pay'],
    answer:
      'I can check your membership status once you verify your registered phone number. Renewals can be paid at the front desk or via the online payment link. (demo data)',
    action: 'Routed to billing workflow',
  },
  {
    keywords: ['cancel', 'refund', 'complaint', 'problem', 'manager', 'human', 'person'],
    answer: "I'll pass this to a staff member so a person can help you directly. They usually respond during opening hours. (demo)",
    action: 'Handed over to a human',
  },
];

export const demoSuggestions = ['What are your opening hours?', 'Which membership plans do you have?', 'Can I book a trial session?', 'I want to talk to a person'];

export function answerDemo(question) {
  const q = question.toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const e of entries) {
    const score = e.keywords.filter((k) => q.includes(k)).length;
    if (score > bestScore) {
      best = e;
      bestScore = score;
    }
  }
  if (!best) {
    return {
      answer:
        "I'm not sure about that one — I only answer from this business's approved information. I can connect you with a staff member if you like. (demo)",
      action: 'Unknown question flagged for review',
    };
  }
  return { answer: best.answer, action: best.action };
}
