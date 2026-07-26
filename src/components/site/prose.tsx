export function Prose({
  text,
  invert,
  size = "lg",
}: {
  text?: string | null;
  invert?: boolean;
  size?: "md" | "lg";
}) {
  if (!text) return null;
  const paragraphs = text.split(/\n{2,}|\\n\\n/).filter(Boolean);
  return (
    <div className="space-y-5">
      {paragraphs.map((p, i) => (
        <p
          key={i}
          className={[
            size === "lg" ? "type-body-lg" : "type-body",
            invert ? "text-brand-cream/80" : "text-muted-foreground",
            "max-w-[68ch]",
          ].join(" ")}
        >
          {p.replace(/\\n/g, " ").trim()}
        </p>
      ))}
    </div>
  );
}
