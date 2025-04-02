'use client';

import { useState, useEffect } from 'react';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Verificar inicialmente
    checkIfMobile();

    // Adicionar evento de resize
    window.addEventListener('resize', checkIfMobile);

    // Limpar evento quando o componente for desmontado
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return isMobile;
}
