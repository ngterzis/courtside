import { cn } from '@/lib/utils';

interface Props {
  number: number;
  size?: number;
  className?: string;
}

export function JerseyAvatar({ number, size = 48, className }: Props) {
  return (
    <div
      className={cn(
        'flex items-center justify-center rounded-full bg-primary-soft text-primary font-bold tabular shrink-0',
        className,
      )}
      style={{
        width: size,
        height: size,
        fontSize: Math.max(12, size * 0.38),
      }}
    >
      {number}
    </div>
  );
}
