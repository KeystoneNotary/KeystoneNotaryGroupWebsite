import { render, screen } from '@testing-library/react';
import TitaniumFooter from '@/components/TitaniumFooter';

describe('Titanium Footer Section', () => {
  it('renders the logo', () => {
    render(<TitaniumFooter />);
    const headings = screen.getAllByText(/Keystone Notary Group, LLC/i);
    expect(headings.length).toBeGreaterThan(0);
  });

  it('renders the appointment button', () => {
    render(<TitaniumFooter />);
    const button = screen.getByText(/Secure Your Appointment/i);
    expect(button).toBeInTheDocument();
  });

  it('renders the coverage area', () => {
    render(<TitaniumFooter />);
    expect(screen.getByText(/Pennsylvania/i)).toBeInTheDocument();
    expect(screen.getByText(/New Jersey/i)).toBeInTheDocument();
    expect(screen.getByText(/Delaware/i)).toBeInTheDocument();
  });
});
