import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '@/App';
import { neighbours, routeForSection } from '@/site/routes';

const renderAt = (path) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <App />
    </MemoryRouter>,
  );

describe('multi-page routing', () => {
  it.each([
    ['/about', /your technology partner, from idea to deployment/i],
    ['/services', /solutions shaped around how your business works/i],
    ['/projects', /real business problems\. working solutions/i],
    ['/process', /seven clear steps/i],
    ['/testimonials', /built around real business requirements/i],
  ])('renders %s with its page heading', async (path, heading) => {
    renderAt(path);
    expect(await screen.findByRole('heading', { level: 1, name: heading })).toBeInTheDocument();
  });

  it('renders the inquiry form on /contact', async () => {
    renderAt('/contact');
    expect(await screen.findByRole('form', { name: /project inquiry form/i })).toBeInTheDocument();
  });

  it('navigates between pages from the navbar', async () => {
    const user = userEvent.setup();
    renderAt('/');
    const nav = screen.getByRole('navigation', { name: 'Primary' });
    await user.click(nav.querySelector('a[href="/contact"]'));
    expect(await screen.findByRole('form', { name: /project inquiry form/i })).toBeInTheDocument();
  });

  it('sends "Start Your Project" CTAs to the contact page', async () => {
    const user = userEvent.setup();
    renderAt('/');
    await user.click(screen.getByRole('button', { name: /start your project/i }));
    expect(await screen.findByRole('form', { name: /project inquiry form/i })).toBeInTheDocument();
  });

  it('keeps the original one-page site available', () => {
    renderAt('/one-page');
    expect(document.getElementById('services')).toBeInTheDocument();
    expect(document.getElementById('contact')).toBeInTheDocument();
  });

  it('provides previous/next pages and maps legacy anchors to routes', () => {
    expect(neighbours('/about')).toMatchObject({ prev: { path: '/' }, next: { path: '/services' } });
    expect(neighbours('/contact').next).toBeNull();
    expect(routeForSection.projects).toBe('/projects');
    expect(routeForSection.faq).toBe('/contact');
  });
});
