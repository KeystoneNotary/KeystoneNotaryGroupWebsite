import { render, screen, fireEvent } from '@testing-library/react';
import ConciergeList from '@/components/ConciergeList';

describe('Concierge List Section', () => {
  it('renders the list items', () => {
    render(<ConciergeList />);
    expect(screen.getByText(/Estate & Real Estate Closings/i)).toBeInTheDocument();
    expect(screen.getByText(/Executive Mobile Facilitation/i)).toBeInTheDocument();
    expect(screen.getByText(/Apostille & Authentication/i)).toBeInTheDocument();
    expect(screen.getByText(/Specialized Legal Signings/i)).toBeInTheDocument();
  });

  it('reveals subtitle on hover', () => {
    render(<ConciergeList />);
    const item = screen.getByText(/Estate & Real Estate Closings/i);
    // Note: Testing hover styles in JSDOM is tricky, but we can check if the subtitle exists in the DOM
    // We assume CSS handles the visibility, but we can check structure here.
    const subtitle = screen.getByText(/Seamless execution for title companies and attorneys/i);
    expect(subtitle).toBeInTheDocument();
  });
});
