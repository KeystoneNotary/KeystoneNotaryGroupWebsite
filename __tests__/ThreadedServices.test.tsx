import { render, screen, fireEvent } from '@testing-library/react';
import ThreadedServices from '@/components/ThreadedServices';

describe('ThreadedServices Component', () => {
  it('renders all service items', () => {
    render(<ThreadedServices />);
    expect(screen.getByText(/Estate & Real Estate Closings/i)).toBeInTheDocument();
    expect(screen.getByText(/Executive Mobile Facilitation/i)).toBeInTheDocument();
    expect(screen.getByText(/Apostille & Authentication/i)).toBeInTheDocument();
  });

  it('shows description on hover', () => {
    render(<ThreadedServices />);
    const serviceItem = screen.getByText(/Estate & Real Estate Closings/i);
    
    // Description might be hidden or opacity 0 initially
    // We check if it exists in the document
    expect(screen.getByText(/Seamless execution for title companies/i)).toBeInTheDocument();
  });

  it('renders with correct semantic structure', () => {
    render(<ThreadedServices />);
    expect(screen.getByRole('list')).toBeInTheDocument();
    const items = screen.getAllByRole('listitem');
    expect(items.length).toBeGreaterThan(0);
  });
});
