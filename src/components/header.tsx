import { FileDown, Download } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';
import { motion } from 'framer-motion';

export function Header() {
  const headerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: 'easeOut',
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  return (
    <motion.header
      className="w-full py-4"
      variants={headerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex justify-end z-50">
        <motion.div
          className="flex items-center gap-3"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  aria-label="Download currículo"
                >
                  <FileDown className="h-[1.2rem] w-[1.2rem]" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-2" align="end">
                <div className="flex flex-col gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center justify-start gap-2"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = '/cv/resume.pdf';
                      link.download = 'Gustavo_Domingueti_Resume_EN.pdf';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <Download className="h-4 w-4" />
                    <span>Currículo (Inglês)</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center justify-start gap-2"
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = '/cv/curriculum.pdf';
                      link.download = 'Gustavo_Domingueti_Curriculo_PT.pdf';
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                  >
                    <Download className="h-4 w-4" />
                    <span>Currículo (Português)</span>
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          </motion.div>
          <motion.div variants={itemVariants}>
            <LanguageSwitcher />
          </motion.div>
          <motion.div variants={itemVariants}>
            <ThemeToggle />
          </motion.div>
        </motion.div>
      </div>
    </motion.header>
  );
}
