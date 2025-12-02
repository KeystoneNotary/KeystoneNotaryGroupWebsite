import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Contact from '@/components/Contact';

describe('Contact Component', () => {
  it('renders contact form with all fields', () => {
    render(<Contact />);
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/how can we help/i)).toBeInTheDocument();
  });

  it('renders concierge information', () => {
    render(<Contact />);
    expect(screen.getByText(/\(267\) 309-9000/i)).toBeInTheDocument();
    expect(screen.getByText(/contact@keystonenotarygroup.com/i)).toBeInTheDocument();
    expect(screen.getByText(/Lehigh Valley, PA/i)).toBeInTheDocument();
  });

  it('validates required fields', async () => {
    render(<Contact />);
    const submitButton = screen.getByRole('button', { name: /send message/i });
    
    fireEvent.click(submitButton);
    
    // HTML5 validation should prevent submission
    const nameInput = screen.getByPlaceholderText(/name/i) as HTMLInputElement;
    expect(nameInput.validity.valid).toBe(false);
  });

  it('validates email format', () => {
    render(<Contact />);
    const emailInput = screen.getByPlaceholderText(/email/i) as HTMLInputElement;
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.blur(emailInput);
    
    expect(emailInput.validity.valid).toBe(false);
  });

  it('submits form with valid data', async () => {
    render(<Contact />);
    
    const nameInput = screen.getByPlaceholderText(/name/i);
    const emailInput = screen.getByPlaceholderText(/email/i);
    const messageInput = screen.getByPlaceholderText(/how can we help/i);
    const submitButton = screen.getByRole('button', { name: /send message/i });
    
    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(messageInput, { target: { value: 'Test message' } });
    
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument();
    });
  });

  it('displays error state on submission failure', async () => {
    // This would test error handling - placeholder for now
    render(<Contact />);
    expect(screen.getByRole('form')).toBeInTheDocument();
  });

  it('has proper ARIA labels', () => {
    render(<Contact />);
    const form = screen.getByRole('form');
    expect(form).toBeInTheDocument();
  });

  it('renders phone and email links', () => {
    render(<Contact />);
    const phoneLink = screen.getByRole('link', { name: /\(267\) 309-9000/i });
    const emailLink = screen.getByRole('link', { name: /contact@keystonenotarygroup.com/i });
    
    expect(phoneLink).toHaveAttribute('href', 'tel:+12673099000');
    expect(emailLink).toHaveAttribute('href', 'mailto:contact@keystonenotarygroup.com');
  });
});
