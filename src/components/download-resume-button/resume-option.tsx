import { motion } from 'framer-motion';

import { Download } from 'lucide-react';

import { Button } from '@/components/ui/button';

import { springAnimation } from './animations';

interface ResumeOptionProps {
  label: string;
  path: string;
  filename: string;
}

export function ResumeOption({ label, path, filename }: ResumeOptionProps) {
  const downloadFile = (path: string, filename: string) => {
    const link = document.createElement('a');
    link.href = path;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className="flex items-center justify-start gap-2 group relative overflow-hidden hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
      onClick={() => downloadFile(path, filename)}
    >
      <motion.div
        initial="initial"
        whileHover="hover"
        animate="initial"
        variants={springAnimation}
      >
        <Download className="h-4 w-4" />
      </motion.div>

      <span>{label}</span>
    </Button>
  );
}
