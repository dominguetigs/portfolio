import { useTranslations } from 'next-intl';

import { motion } from 'framer-motion';

import { FileDown } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { springAnimation } from './animations';
import { RESUME_OPTIONS } from './constants';
import { ResumeOption } from './resume-option';

export function DownloadResumeButton() {
  const t = useTranslations('Index.Header');

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          aria-label={t('downloadResume')}
          className="group relative overflow-hidden hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
        >
          <motion.div
            initial="initial"
            whileHover="hover"
            animate="initial"
            variants={springAnimation}
          >
            <FileDown className="h-[1.2rem] w-[1.2rem]" />
          </motion.div>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-2" align="end">
        <div className="flex flex-col gap-2">
          {RESUME_OPTIONS(t).map(option => (
            <ResumeOption
              key={option.value}
              label={option.label}
              path={option.path}
              filename={option.filename}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
