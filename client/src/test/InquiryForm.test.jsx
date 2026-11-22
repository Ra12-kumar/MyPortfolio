import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InquiryProvider } from '@/context/InquiryContext';

vi.mock('@/config/site', () => ({
  site: { formEndpoint: null, contact: { email: 'ram@example.com', whatsapp: '917323891747' }, availability: null },
  whatsappLink: (m = '') => `https://wa.me/917323891747?text=${encodeURIComponent(m)}`,
  navItems: [],
}));

vi.mock('@/lib/inquiryDelivery', async () => {
  const actual = await vi.importActual('@/lib/inquiryDelivery');
  return { ...actual, deliverInquiry: vi.fn() };
});

const { deliverInquiry } = await import('@/lib/inquiryDelivery');
const { InquiryForm } = await import('@/components/forms/InquiryForm');

// The form ignores submissions made within 3 s of rendering (bot guard), so jump the clock forward once it is on screen.
const renderForm = () => {
  const view = render(
    <InquiryProvider>
      <InquiryForm />
    </InquiryProvider>,
  );
  vi.spyOn(Date, 'now').mockReturnValue(Date.now() + 10_000);
  return view;
};

async function fillValid(user) {
  await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
  await user.type(screen.getByLabelText(/business email/i), 'jane@example.com');
  await user.selectOptions(screen.getByLabelText(/project type/i), 'Business Management System');
  await user.type(screen.getByLabelText(/project description/i), 'We need a gym management system with member tracking.');
}

describe('InquiryForm (no backend)', () => {
  beforeEach(() => {
    deliverInquiry.mockReset();
    sessionStorage.clear();
    vi.restoreAllMocks();
  });

  it('shows validation errors and does not submit an empty form', async () => {
    const user = userEvent.setup();
    renderForm();
    await user.click(screen.getByRole('button', { name: /send inquiry/i }));
    expect(await screen.findByText(/please enter your full name/i)).toBeInTheDocument();
    expect(screen.getByText(/please choose a project type/i)).toBeInTheDocument();
    expect(deliverInquiry).not.toHaveBeenCalled();
  });

  it('shows the success state when a form service accepts the inquiry', async () => {
    deliverInquiry.mockResolvedValue({ mode: 'sent' });
    const user = userEvent.setup();
    renderForm();
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /send inquiry/i }));
    await waitFor(() => expect(deliverInquiry).toHaveBeenCalledTimes(1));
    expect(deliverInquiry.mock.calls[0][0]).toMatchObject({ fullName: 'Jane Doe', projectType: 'Business Management System' });
    expect(await screen.findByText(/inquiry received/i)).toBeInTheDocument();
  });

  it('hands over a prefilled WhatsApp / e-mail message when no form service is available', async () => {
    deliverInquiry.mockResolvedValue({ mode: 'handoff' });
    const user = userEvent.setup();
    renderForm();
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /send inquiry/i }));
    expect(await screen.findByText(/one last step/i)).toBeInTheDocument();
    const wa = screen.getByRole('link', { name: /send on whatsapp/i });
    expect(wa.getAttribute('href')).toContain('wa.me/917323891747');
    expect(decodeURIComponent(wa.getAttribute('href'))).toContain('Name: Jane Doe');
    expect(screen.getByRole('link', { name: /send by e-mail/i }).getAttribute('href')).toMatch(/^mailto:ram@example\.com/);
  });
});
