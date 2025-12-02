import { render, screen } from '@testing-library/react';
import HorizontalServices from '@/components/HorizontalServices';

// Mock GSAP
jest.mock('gsap', () => ({
  registerPlugin: jest.fn(),
  to: jest.fn(),
  fromTo: jest.fn(),
  timeline: () => ({
    to: jest.fn().mockReturnThis(),
    fromTo: jest.fn().mockReturnThis(),
  }),
}));

jest.mock('@gsap/react', () => ({
  useGSAP: jest.fn(),
}));

describe('HorizontalServices Component', () => {
  it('renders the section title', () => {
    render(<HorizontalServices />);
    expect(screen.getByText(/Our Expertise/i)).toBeInTheDocument();
  });

  it('renders service cards', () => {
    render(<HorizontalServices />);
    expect(screen.getByText(/Estate & Real Estate Closings/i)).toBeInTheDocument();
    expect(screen.getByText(/Executive Mobile Facilitation/i)).toBeInTheDocument();
  });

  it('has correct structure for horizontal scroll', () => {
    const { container } = render(<HorizontalServices />);
    // Should have a container for the horizontal track
    expect(container.querySelector('.horizontal-track')).toBeInTheDocument();
  });
});
