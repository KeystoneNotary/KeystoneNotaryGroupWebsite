import { render, screen, fireEvent } from '@testing-library/react';
import CompactCalculator from '@/components/CompactCalculator';

describe('CompactCalculator Component', () => {
  it('renders correctly with default state', () => {
    render(<CompactCalculator />);
    expect(screen.getByText(/Estimate Cost/i)).toBeInTheDocument();
    expect(screen.getByText(/\$15/i)).toBeInTheDocument(); // Base rate
  });

  it('updates price when distance changes', () => {
    render(<CompactCalculator />);
    const distanceInput = screen.getByLabelText(/Distance/i);
    
    // 20 miles: 10 base + (10 * 2.5) = 25 + 15 base = $40
    fireEvent.change(distanceInput, { target: { value: '20' } });
    
    expect(screen.getByText(/\$40/i)).toBeInTheDocument();
  });

  it('updates price when service type changes', () => {
    render(<CompactCalculator />);
    const serviceSelect = screen.getByLabelText(/Service/i);
    
    // Loan Signing: +$100. Base $15. Total $115.
    fireEvent.change(serviceSelect, { target: { value: 'loan-signing' } });
    
    expect(screen.getByText(/\$115/i)).toBeInTheDocument();
  });

  it('updates price when urgency changes', () => {
    render(<CompactCalculator />);
    const urgencySelect = screen.getByLabelText(/Urgency/i);
    
    // Same Day: +$50. Base $15. Total $65.
    fireEvent.change(urgencySelect, { target: { value: 'same-day' } });
    
    expect(screen.getByText(/\$65/i)).toBeInTheDocument();
  });

  it('toggles detailed breakdown', () => {
    render(<CompactCalculator />);
    const toggleButton = screen.getByRole('button', { name: /details/i });
    
    // Initially hidden (or just summary)
    expect(screen.queryByText(/Mileage Fee/i)).not.toBeInTheDocument();
    
    fireEvent.click(toggleButton);
    
    expect(screen.getByText(/Mileage Fee/i)).toBeInTheDocument();
  });
});
