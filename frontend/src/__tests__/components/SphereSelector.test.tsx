/**
 * CHE·NU™ - Sphere Selector Tests
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { SphereSelector } from '../components/SphereSelector';

describe('SphereSelector', () => {
  it('displays all 9 spheres', () => {
    render(<SphereSelector />);
    
    const spheres = [
      'Personal', 'Business', 'Government',
      'Studio', 'Community', 'Social',
      'Entertainment', 'My Team', 'Scholar'
    ];
    
    spheres.forEach(sphere => {
      expect(screen.getByText(new RegExp(sphere, 'i'))).toBeInTheDocument();
    });
  });
  
  it('highlights active sphere', () => {
    render(<SphereSelector activeSphere="business" />);
    
    const businessSphere = screen.getByTestId('sphere-business');
    expect(businessSphere).toHaveClass('sphere-active');
  });
  
  it('calls onSelect when sphere clicked', () => {
    const onSelect = jest.fn();
    render(<SphereSelector onSelect={onSelect} />);
    
    fireEvent.click(screen.getByTestId('sphere-scholar'));
    
    expect(onSelect).toHaveBeenCalledWith('scholar');
  });
});
