type Segment = {
  id: string;
  color: string;
  percent: number;
};

type Arc = Segment & {
  startAngle: number;
  endAngle: number;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const normalizeSegments = (segments: Segment[]) => {
  const total = segments.reduce((sum, seg) => sum + seg.percent, 0);
  if (!total) {
    return segments.map(segment => ({ ...segment, percent: 0 }));
  }

  return segments.map(segment => ({
    ...segment,
    percent: clamp(segment.percent / total, 0, 1),
  }));
};

export const useMacroRing = (segments: Segment[]) => {
  const normalized = normalizeSegments(segments);
  let cursor = -90;

  const arcs: Arc[] = normalized.map(segment => {
    const startAngle = cursor;
    const sweep = segment.percent * 360;
    const endAngle = startAngle + sweep;
    cursor = endAngle;

    return { ...segment, startAngle, endAngle };
  });

  return { arcs };
};
