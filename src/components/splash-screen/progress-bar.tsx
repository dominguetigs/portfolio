import { useTranslations } from 'next-intl';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  progressWidth: number;
}

export function ProgressBar({ progressWidth }: ProgressBarProps) {
  const t = useTranslations('Index.SplashScreen');

  return (
    <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-full px-4">
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
        {progressWidth < 100 ? t('loading') : t('loaded')}
      </div>
    </div>
  );
}
