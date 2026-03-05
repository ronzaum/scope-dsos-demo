interface ExampleBoxProps {
  examples: string[];
  title?: string;
}

/**
 * Reusable callout component for example content.
 * Subtle background, left border accent, renders array of example strings.
 */
export function ExampleBox({ examples, title }: ExampleBoxProps) {
  if (!examples || examples.length === 0) return null;

  return (
    <div className="bg-blue-500/5 border-l-2 border-blue-500/30 rounded-r-md px-3 py-2.5 space-y-2">
      {title && (
        <h6 className="text-xs font-medium text-foreground/70 uppercase tracking-wide">
          {title}
        </h6>
      )}
      {examples.map((example, i) => (
        <p key={i} className="text-xs text-muted-foreground leading-relaxed">
          {example}
        </p>
      ))}
    </div>
  );
}
