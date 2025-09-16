import { useRouter } from "next/navigation";

export default function SeeAllButton({
  q,
  targetType,
}: {
  q: string;
  targetType: string;
}) {
  const router = useRouter();
  return (
    <button
      onClick={() =>
        router.push(`/search?q=${encodeURIComponent(q)}&type=${targetType}`)
      }
      className="text-sm font-medium text-primary hover:underline"
    >
      See all
    </button>
  );
}
