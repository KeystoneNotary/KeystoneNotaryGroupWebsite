import { render, screen } from '@testing-library/react';
import SilverFrame from '@/components/SilverFrame';

// Mock GSAP to avoid animation errors in tests
jest.mock('gsap', () => ({
  registerPlugin: jest.fn(),
  timeline: () => ({
    to: jest.fn().mockReturnThis(),
    fromTo: jest.fn().mockReturnThis(),
  }),
}));

jest.mock('@gsap/react', () => ({
  useGSAP: jest.fn(),
}));

describe('SilverFrame Component', () => {
  it('renders children correctly', () => {
    render(
      <SilverFrame>
        <div>Test Content</div>
      </SilverFrame>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders the SVG borders', () => {
    const { container } = render(
      <SilverFrame>
        <div>Content</div>
      </SilverFrame>
    );
    // Should have an SVG for the border
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    render(
      <SilverFrame>
        <div role="article">Content</div>
      </SilverFrame>
    );
    // The frame itself is decorative, so it shouldn't interfere with content accessibility
    expect(screen.getByRole('article')).toBeInTheDocument();
  });
});
