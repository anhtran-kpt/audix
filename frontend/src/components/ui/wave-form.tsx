export default function WaveForm() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 20 20"
      preserveAspectRatio="xMidYMid meet"
      fill="currentColor"
      className="pointer-events-none fill-primary"
    >
      {[0, 1, 2, 3].map((i) => {
        const delay = (Math.random() * 0.5).toFixed(2);
        const dur = (0.7 + Math.random() * 0.6).toFixed(2);
        const minHeight = 4 + Math.random() * 3;
        const maxHeight = 16 + Math.random() * 4;

        return (
          <rect
            key={i}
            x={i * 5}
            y={20 - maxHeight}
            width="3"
            height={maxHeight}
            rx="1.5"
          >
            <animate
              attributeName="height"
              values={`${minHeight};${maxHeight};${minHeight}`}
              dur={`${dur}s`}
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
            <animate
              attributeName="y"
              values={`${20 - minHeight};${20 - maxHeight};${20 - minHeight}`}
              dur={`${dur}s`}
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
          </rect>
        );
      })}
    </svg>
  );
}
