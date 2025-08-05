export default function Dot({
  size = 4,
  color = "currentColor",
}: {
  size?: number;
  color?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 4 4"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="2" cy="2" r="2" />
    </svg>
  );
}
