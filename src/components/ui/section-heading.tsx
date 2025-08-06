export default function SectionHeading({ heading }: { heading: string }) {
  return (
    <h2 className="font-bold text-2xl select-none mb-6 capitalize">
      {heading}
    </h2>
  );
}
