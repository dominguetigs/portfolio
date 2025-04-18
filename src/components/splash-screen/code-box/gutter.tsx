export function CodeBoxGutter({ code }: { code: string }) {
  return (
    <div className="mr-2 text-gray-500 font-mono text-xs text-right pr-2 select-none">
      {code.split('\n').map((_, i) => (
        <div key={i} className="leading-6">
          {i + 1}
        </div>
      ))}
    </div>
  );
}
