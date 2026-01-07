/**
 * CHE·NU - useSpace Hook
 * Gestion de l'espace/sphère actif
 */

import { useState, useCallback } from 'react';
import { useSphereStore } from '../state/sphere.store';

export interface Space {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const useSpace = () => {
  const { activeSphereId, setActiveSphere } = useSphereStore();
  const [isLoading, setIsLoading] = useState(false);

  const switchSpace = useCallback(async (spaceId: string) => {
    setIsLoading(true);
    try {
      setActiveSphere(spaceId);
    } finally {
      setIsLoading(false);
    }
  }, [setActiveSphere]);

  return {
    currentSpaceId: activeSphereId,
    isLoading,
    switchSpace
  };
};

export default useSpace;
