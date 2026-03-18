'use client';

type CornerBracketProps = {
  position: 'tl' | 'tr' | 'bl' | 'br';
};

const positionMap: Record<CornerBracketProps['position'], string> = {
  tl: 'top-0 left-0 border-t-2 border-l-2',
  tr: 'top-0 right-0 border-t-2 border-r-2',
  bl: 'bottom-0 left-0 border-b-2 border-l-2',
  br: 'bottom-0 right-0 border-b-2 border-r-2',
};

export function CornerBracket({ position }: CornerBracketProps): React.ReactElement {
  return (
    <div
      aria-hidden="true"
      className={`absolute h-3 w-3 ${positionMap[position]} border-emerald-500/20`}
    />
  );
}

