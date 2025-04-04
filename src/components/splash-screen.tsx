'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const loadingCode = `const loadPortfolio = () => {
  return 'Ready!';
};

loadPortfolio();`;

interface SplashScreenProps {
  onComplete?: () => void;
}

export function SplashScreen({ onComplete }: SplashScreenProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [displayedCode, setDisplayedCode] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const codeRef = useRef<HTMLPreElement>(null);
  const [cursorPosition, setCursorPosition] = useState({
    top: 0,
    left: 0,
  });
  const [progressWidth, setProgressWidth] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Chamar callback quando o splash screen terminar
      if (onComplete) {
        onComplete();
      }
    }, 7000); // Tempo total do splash screen

    return () => clearTimeout(timer);
  }, [onComplete]);

  const calculateCursorPosition = (text: string) => {
    const lines = text.split('\n');
    const currentLineIndex = lines.length - 1;
    const currentLineContent = lines[currentLineIndex];

    // Posição vertical: multiplica pelo tamanho da linha com ajuste para o espaçamento
    const top = currentLineIndex * 1.5;

    // Calcula a posição horizontal baseada no comprimento da linha atual
    // Ajustado para a fonte monoespaçada
    const left = currentLineContent.length * 0.6;

    return { top, left };
  };

  // Efeito para digitação do código
  useEffect(() => {
    if (currentIndex < loadingCode.length) {
      const timer = setTimeout(() => {
        const newCode = displayedCode + loadingCode[currentIndex];
        setDisplayedCode(newCode);
        setCurrentIndex(prev => prev + 1);

        // Atualiza a barra de progresso baseado no progresso da digitação
        // Reservamos 80% da barra para a digitação, o restante para após digitar
        const typingProgress = (currentIndex / loadingCode.length) * 80;
        setProgressWidth(typingProgress);

        // Atualizando posição do cursor depois de adicionar o caractere
        setCursorPosition(calculateCursorPosition(newCode));
      }, 70); // Velocidade da digitação

      return () => clearTimeout(timer);
    } else if (currentIndex === loadingCode.length) {
      // Completa o restante da barra (de 80% para 100%) em 1 segundo
      setTimeout(() => {
        // Incrementa gradualmente até 100%
        const interval = setInterval(() => {
          setProgressWidth(prev => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 2; // Incrementos pequenos para uma animação suave
          });
        }, 50); // 20 steps * 50ms = ~1 segundo

        // Garantia de que chegará a 100% após 1 segundo
        setTimeout(() => {
          setProgressWidth(100);
        }, 1000);
      }, 100); // Pequena pausa após a digitação
    }
  }, [currentIndex, displayedCode]);

  useEffect(() => {
    // Atualiza a largura da barra de progresso para corresponder ao container do código
    const updateProgressBarWidth = () => {
      const codeContainer = document.getElementById('code-container');
      if (codeContainer) {
        const width = codeContainer.offsetWidth;
        document.documentElement.style.setProperty(
          '--container-width',
          `${width}px`,
        );
      }
    };

    // Atualiza inicialmente e sempre que a janela for redimensionada
    updateProgressBarWidth();
    window.addEventListener('resize', updateProgressBarWidth);

    return () => {
      window.removeEventListener('resize', updateProgressBarWidth);
    };
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: 0.8,
              ease: 'easeInOut',
            },
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-background"
        >
          {/* Add texture background */}
          <div className="texture" />
          <div className="relative w-[500px] h-[300px]">
            {/* Container do código */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-full max-w-[400px] bg-background/50 backdrop-blur-sm rounded-lg p-4">
                <div className="relative flex items-center justify-center">
                  {/* Bloco do código com posicionamento relativo para o cursor */}
                  <div
                    id="code-container"
                    className="relative bg-gray-900/80 p-4 rounded-md border border-gray-700/50 shadow-xl w-[340px] sm:w-[380px] md:w-[420px]"
                  >
                    <div className="flex items-center space-x-1.5 mb-3">
                      <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                    </div>
                    <div className="flex">
                      {/* Numeração de linhas */}
                      <div
                        className="mr-4 text-gray-500 font-mono text-xs text-right pr-2 select-none"
                        style={{ minWidth: '1.5rem' }}
                      >
                        {displayedCode.split('\n').map((_, i) => (
                          <div key={i} className="leading-6">
                            {i + 1}
                          </div>
                        ))}
                      </div>

                      {/* Código digitado */}
                      <div className="relative flex-1 pl-3 overflow-hidden">
                        <pre
                          ref={codeRef}
                          className="font-mono text-sm text-primary/90 leading-6 whitespace-pre"
                        >
                          <code>{displayedCode}</code>
                        </pre>

                        {/* Cursor de digitação */}
                        <motion.div
                          className="absolute inline-block w-[2px] h-[1.1rem] bg-primary"
                          animate={{
                            opacity: [1, 0, 1],
                          }}
                          transition={{
                            duration: 0.8,
                            repeat: Infinity,
                          }}
                          style={{
                            top: `${cursorPosition.top}rem`,
                            left: `${cursorPosition.left}rem`,
                            marginTop: '0.2rem',
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Barra de Carregamento */}
            <div
              className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-[340px] sm:w-[380px] md:w-[420px]"
              style={{ width: 'var(--container-width, 340px)' }}
            >
              <div className="w-full h-2 bg-primary/20 rounded-full">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${progressWidth}%` }}
                  initial={{ width: '0%' }}
                  animate={{ width: `${progressWidth}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
              <div className="mt-2 text-xs text-center text-primary/90 font-mono">
                {progressWidth < 100 ? 'Carregando...' : 'Carregado!'}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
