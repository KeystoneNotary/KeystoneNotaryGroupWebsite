import { render, screen, fireEvent } from '@testing-library/react';
import FAQ from '@/components/FAQ';

describe('FAQ Component', () => {
  it('renders all 5 questions', () => {
    render(<FAQ />);
    expect(screen.getByText(/What documents do I need to bring/i)).toBeInTheDocument();
    expect(screen.getByText(/How much does notarization cost/i)).toBeInTheDocument();
    expect(screen.getByText(/Do you offer mobile notary services/i)).toBeInTheDocument();
    expect(screen.getByText(/Can you notarize documents in other languages/i)).toBeInTheDocument();
    expect(screen.getByText(/What is the difference between an acknowledgment and a jurat/i)).toBeInTheDocument();
  });

  it('all questions are collapsed by default', () => {
    render(<FAQ />);
    const answers = screen.queryAllByText(/government-issued photo ID/i);
    expect(answers.length).toBe(0);
  });

  it('expands question when clicked', () => {
    render(<FAQ />);
    const firstQuestion = screen.getByText(/What documents do I need to bring/i);
    fireEvent.click(firstQuestion);
    expect(screen.getByText(/government-issued photo ID/i)).toBeInTheDocument();
  });

  it('collapses question when clicked again', () => {
    render(<FAQ />);
    const firstQuestion = screen.getByText(/What documents do I need to bring/i);
    
    // Open
    fireEvent.click(firstQuestion);
    expect(screen.getByText(/government-issued photo ID/i)).toBeInTheDocument();
    
    // Close
    fireEvent.click(firstQuestion);
    expect(screen.queryByText(/government-issued photo ID/i)).not.toBeInTheDocument();
  });

  it('only one question open at a time', () => {
    render(<FAQ />);
    const firstQuestion = screen.getByText(/What documents do I need to bring/i);
    const secondQuestion = screen.getByText(/How much does notarization cost/i);
    
    // Open first
    fireEvent.click(firstQuestion);
    expect(screen.getByText(/government-issued photo ID/i)).toBeInTheDocument();
    
    // Open second (should close first)
    fireEvent.click(secondQuestion);
    expect(screen.queryByText(/government-issued photo ID/i)).not.toBeInTheDocument();
    expect(screen.getByText(/In-office notarizations start at/i)).toBeInTheDocument();
  });

  it('has correct ARIA attributes', () => {
    render(<FAQ />);
    const buttons = screen.getAllByRole('button');
    
    buttons.forEach(button => {
      expect(button).toHaveAttribute('aria-expanded');
    });
  });

  it('supports keyboard navigation', () => {
    render(<FAQ />);
    const firstButton = screen.getAllByRole('button')[0];
    
    firstButton.focus();
    fireEvent.keyDown(firstButton, { key: 'Enter' });
    
    expect(screen.getByText(/government-issued photo ID/i)).toBeInTheDocument();
  });

  it('renders question numbers correctly', () => {
    render(<FAQ />);
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
    expect(screen.getByText('04')).toBeInTheDocument();
    expect(screen.getByText('05')).toBeInTheDocument();
  });
});
