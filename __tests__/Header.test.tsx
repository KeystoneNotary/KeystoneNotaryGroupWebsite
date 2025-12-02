import { render, screen, fireEvent } from '@testing-library/react';
import Header from '@/components/Header';

describe('Header Component', () => {
  describe('Rendering', () => {
    it('renders the logo', () => {
      render(<Header />);
      const logo = screen.getByAltText(/keystone notary group/i);
      expect(logo).toBeInTheDocument();
    });

    it('renders all navigation links', () => {
      render(<Header />);
      expect(screen.getByText('About')).toBeInTheDocument();
      expect(screen.getByText('Services')).toBeInTheDocument();
      expect(screen.getByText('Coverage')).toBeInTheDocument();
      expect(screen.getByText('Pricing')).toBeInTheDocument();
      expect(screen.getByText('FAQ')).toBeInTheDocument();
      expect(screen.getByText('Contact')).toBeInTheDocument();
    });

    it('renders phone number as clickable link', () => {
      render(<Header />);
      const phoneLink = screen.getAllByText('(267) 309-9000')[0];
      expect(phoneLink).toBeInTheDocument();
      expect(phoneLink.closest('a')).toHaveAttribute('href', 'tel:+12673099000');
    });

    it('renders Book Now CTA button', () => {
      render(<Header />);
      const ctaButtons = screen.getAllByText(/book now/i);
      expect(ctaButtons.length).toBeGreaterThan(0);
      expect(ctaButtons[0].closest('a')).toHaveAttribute('href', '#booking');
    });
  });

  describe('Mobile Menu', () => {
    it('mobile menu starts invisible', () => {
      render(<Header />);
      const mobileNav = screen.getByRole('navigation', { name: /mobile/i });
      expect(mobileNav).toHaveClass('invisible');
    });

    it('toggles mobile menu when hamburger button is clicked', () => {
      render(<Header />);
      const hamburgerButton = screen.getByLabelText(/open menu/i);
      
      fireEvent.click(hamburgerButton);
      const mobileNav = screen.getByRole('navigation', { name: /mobile/i });
      expect(mobileNav).toHaveClass('visible');
    });
  });

  describe('Accessibility', () => {
    it('has proper ARIA roles', () => {
      render(<Header />);
      expect(screen.getByRole('banner')).toBeInTheDocument();
      const navs = screen.getAllByRole('navigation');
      expect(navs.length).toBeGreaterThan(0);
    });

    it('hamburger button has accessible label', () => {
      render(<Header />);
      const hamburgerButton = screen.getByLabelText(/menu/i);
      expect(hamburgerButton).toHaveAttribute('aria-label');
      expect(hamburgerButton).toHaveAttribute('aria-expanded');
    });
  });

  describe('Navigation Links', () => {
    it('navigation links have correct href attributes', () => {
      render(<Header />);
      const aboutLinks = screen.getAllByText('About');
      expect(aboutLinks[0].closest('a')).toHaveAttribute('href', '#about');
    });
  });
});
