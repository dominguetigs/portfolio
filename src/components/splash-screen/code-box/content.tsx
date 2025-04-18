export function CodeBoxContent({ code }: { code: string }) {
  return (
    <pre className="font-mono text-sm text-primary/90 leading-6 whitespace-pre">
      <code>{code}</code>
    </pre>
  );
}
