export function Prose({ text, invert }: { text?: string | null; invert?: boolean }) {
  if (!text) return null;
  const paragraphs = text.split(/\n{2,}|\\n\\n/).filter(Boolean);
  return (
    <div className="space-y-5">
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className={
            invert
              ? "text-base leading-relaxed text-brand-cream/80 md:text-lg"
              : "text-base leading-relaxed text-muted-foreground md:text-lg"
          }
        >
          {p.replace(/\\n/g, " ").trim()}
        </p>
      ))}
    </div>
  );
}
