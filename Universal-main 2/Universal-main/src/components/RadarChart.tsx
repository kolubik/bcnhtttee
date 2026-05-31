import React from 'react';

interface RadarChartProps {
  stats: {
    technical: number;
    intelligence: number;
    security: number;
    tactical: number;
    leadership: number;
  };
  size?: number;
}

export const RadarChart: React.FC<RadarChartProps> = ({ stats, size = 300 }) => {
  const categories = [
    { key: 'technical', label: 'TECH' },
    { key: 'intelligence', label: 'INTEL' },
    { key: 'security', label: 'SEC' },
    { key: 'tactical', label: 'TACT' },
    { key: 'leadership', label: 'LEAD' },
  ];

  const center = size / 2;
  const radius = (size / 2) * 0.7;
  const angleStep = (Math.PI * 2) / categories.length;

  const getCoordinates = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle),
    };
  };

  const points = categories.map((cat, i) => {
    const val = (stats as any)[cat.key] || 0;
    const { x, y } = getCoordinates(i, val);
    return `${x},${y}`;
  }).join(' ');

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1];

  return (
    <div className="relative flex items-center justify-center select-none">
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid lines */}
        {gridLevels.map((lvl) => (
          <polygon
            key={lvl}
            points={categories.map((_, i) => {
              const { x, y } = getCoordinates(i, lvl * 100);
              return `${x},${y}`;
            }).join(' ')}
            className="fill-none stroke-white/[0.05] stroke-1"
          />
        ))}

        {/* Axes */}
        {categories.map((_, i) => {
          const { x, y } = getCoordinates(i, 100);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              className="stroke-white/[0.05] stroke-1"
            />
          );
        })}

        {/* Labels */}
        {categories.map((cat, i) => {
          const { x, y } = getCoordinates(i, 115);
          return (
            <text
              key={cat.key}
              x={x}
              y={y}
              textAnchor="middle"
              className="fill-cyan-500/40 font-mono text-[8px] uppercase tracking-widest font-black"
            >
              {cat.label}
            </text>
          );
        })}

        {/* Data polygon */}
        <polygon
          points={points}
          className="fill-cyan-500/20 stroke-cyan-500 stroke-2 drop-shadow-[0_0_8px_rgba(6,182,212,0.5)]"
        />

        {/* Data points */}
        {categories.map((cat, i) => {
          const val = (stats as any)[cat.key] || 0;
          const { x, y } = getCoordinates(i, val);
          return (
            <circle
              key={i}
              cx={x}
              cy={y}
              r={3}
              className="fill-cyan-400 stroke-black stroke-2 shadow-xl"
            />
          );
        })}
      </svg>
    </div>
  );
};
