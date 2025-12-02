import { render, screen } from '@testing-library/react';
import TheFirm from '@/components/TheFirm';

describe('The Firm Section', () => {
  it('renders the main headline', () => {
    render(<TheFirm />);
    const headline = screen.getByRole('heading', { name: /Precision is our Currency/i });
    expect(headline).toBeInTheDocument();
  });

  it('renders the editorial copy', () => {
    render(<TheFirm />);
    const copy = screen.getByText(/Keystone Notary Group was founded on a singular principle/i);
    expect(copy).toBeInTheDocument();
  });

  it('renders the philosophy link', () => {
    render(<TheFirm />);
    const link = screen.getByText(/Read Our Philosophy/i);
    expect(link).toBeInTheDocument();
  });
});
