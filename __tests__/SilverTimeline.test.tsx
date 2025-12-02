import { render, screen } from '@testing-library/react';
import SilverTimeline from '@/components/SilverTimeline';

// Mock Framer Motion since it uses requestAnimationFrame which might be tricky in JSDOM
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, className, style }: any) => <div className={className} style={style}>{children}</div>,
    path: ({ d, className, style }: any) => <path d={d} className={className} style={style} />,
    svg: ({ children, className, style }: any) => <svg className={className} style={style}>{children}</svg>,
  },
  useScroll: () => ({ scrollYProgress: { get: () => 0 } }),
  useTransform: () => ({ get: () => 0 }),
}));

describe('Silver Timeline Section', () => {
  it('renders all steps', () => {
    render(<SilverTimeline />);
    expect(screen.getByText(/Step 01/i)).toBeInTheDocument();
    expect(screen.getByText(/Initiation/i)).toBeInTheDocument();
    expect(screen.getByText(/Step 02/i)).toBeInTheDocument();
    expect(screen.getByText(/Coordination/i)).toBeInTheDocument();
  });

  it('renders the silver line container', () => {
    render(<SilverTimeline />);
    // We can check for the SVG or the container class
    const container = screen.getByTestId('timeline-container');
    expect(container).toBeInTheDocument();
  });
});
