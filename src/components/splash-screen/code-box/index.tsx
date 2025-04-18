import { CodeBoxContent } from './content';
import { CodeBoxCursor } from './cursor';
import { CodeBoxGutter } from './gutter';
import { CodeBoxHeader } from './header';

interface CodeBoxProps {
  code: string;
  cursorPosition: { top: number; left: number };
}

export function CodeBox({ code, cursorPosition }: CodeBoxProps) {
  return (
    <div className="relative bg-gray-900/80 p-4 rounded-md border border-gray-700/50 shadow-xl w-full">
      <CodeBoxHeader />

      <div className="flex h-32 overflow-hidden">
        <CodeBoxGutter code={code} />

        <div className="relative flex-1 pl-3 overflow-hidden">
          <CodeBoxContent code={code} />
          <CodeBoxCursor cursorPosition={cursorPosition} />
        </div>
      </div>
    </div>
  );
}
