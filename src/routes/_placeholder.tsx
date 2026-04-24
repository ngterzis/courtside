interface Props {
  title: string;
  note?: string;
}

export function Placeholder({ title, note }: Props) {
  return (
    <div className="px-4 py-6 lg:px-8 lg:py-10">
      <h1 className="text-2xl font-bold">{title}</h1>
      <p className="mt-2 text-sm text-ink-70">
        {note ?? 'Coming soon. This route is scaffolded but not yet implemented.'}
      </p>
    </div>
  );
}
