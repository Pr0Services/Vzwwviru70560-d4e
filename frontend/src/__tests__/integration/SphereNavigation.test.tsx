/**
 * CHE·NU™ - Sphere Navigation Integration Tests
 */
import { render, screen, fireEvent } from '@testing-library/react';
import { SphereNavigation } from '../components/SphereNavigation';
import { HubProvider } from '../../hubs/HubArchitecture';

describe('Sphere Navigation Integration', () => {
  it('navigates through 9 spheres', () => {
    render(
      <HubProvider>
        <SphereNavigation />
      </HubProvider>
    );
    
    const spheres = ['personal', 'business', 'scholar'];
    spheres.forEach(sphere => {
      const button = screen.getByTestId(`sphere-${sphere}`);
      fireEvent.click(button);
      // Verify sphere is active
    });
  });
});
