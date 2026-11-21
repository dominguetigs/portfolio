import { GhibliBackground } from './ghibli-background';
import { SplashScreen } from './splash-screen';

interface MainContentProps {
  children: React.ReactNode;
}

/**
 * The page renders on the server underneath the splash, which only covers it
 * on the first visit of a session.
 */
export function MainContent({ children }: MainContentProps) {
  return (
    <>
      <GhibliBackground live />
      <div className="texture" />
      {children}

      <SplashScreen />
    </>
  );
}
