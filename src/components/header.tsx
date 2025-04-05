import { FileDown, Download } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/language-switcher';

export function Header() {
  return (
    <header className="w-full py-4">
      <div className="flex justify-end z-50">
        <div className="flex items-center gap-3">
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
          <LanguageSwitcher />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
