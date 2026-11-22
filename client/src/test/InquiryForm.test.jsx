import { describe, expect, it, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { InquiryProvider } from '@/context/InquiryContext';

vi.mock('@/config/site', () => ({
  site: { apiUrl: 'http://api.test/api/v1', contact: { email: null, whatsapp: null }, availability: null },
  whatsappLink: () => null,
  navItems: [],
}));

vi.mock('@/lib/api', async () => {
  const actual = await vi.importActual('@/lib/api');
  return { ...actual, apiConfigured: true, api: vi.fn() };
});

const { api, ApiError } = await import('@/lib/api');
const { InquiryForm } = await import('@/components/forms/InquiryForm');

const renderForm = () =>
  render(
    <InquiryProvider>
      <InquiryForm />
    </InquiryProvider>,
  );

async function fillValid(user) {
  await user.type(screen.getByLabelText(/full name/i), 'Jane Doe');
  await user.type(screen.getByLabelText(/business email/i), 'jane@example.com');
  await user.selectOptions(screen.getByLabelText(/project type/i), 'Business Management System');
  await user.type(screen.getByLabelText(/project description/i), 'We need a gym management system with member tracking.');
}

describe('InquiryForm', () => {
  beforeEach(() => {
    api.mockReset();
    sessionStorage.clear();
  });

  it('shows validation errors and does not submit an empty form', async () => {
    const user = userEvent.setup();
    renderForm();
    await user.click(screen.getByRole('button', { name: /send inquiry/i }));
    expect(await screen.findByText(/please enter your full name/i)).toBeInTheDocument();
    expect(screen.getByText(/please choose a project type/i)).toBeInTheDocument();
    expect(api).not.toHaveBeenCalled();
  });

  it('submits a valid inquiry and shows the success state', async () => {
    api.mockResolvedValue({ message: 'Thank you! Your inquiry has been received.' });
    const user = userEvent.setup();
    renderForm();
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /send inquiry/i }));

    await waitFor(() => expect(api).toHaveBeenCalledTimes(1));
    const [path, opts] = api.mock.calls[0];
    expect(path).toBe('/inquiries');
    expect(opts.body).toMatchObject({ fullName: 'Jane Doe', projectType: 'Business Management System', source: 'website' });
    expect(typeof opts.body.formStartedAt).toBe('number');
    expect(await screen.findByText(/inquiry received/i)).toBeInTheDocument();
  });

  it('shows a helpful error when the server fails', async () => {
    api.mockRejectedValue(new ApiError('Service temporarily unavailable', { status: 503 }));
    const user = userEvent.setup();
    renderForm();
    await fillValid(user);
    await user.click(screen.getByRole('button', { name: /send inquiry/i }));
    expect(await screen.findByText(/service temporarily unavailable/i)).toBeInTheDocument();
  });
});
