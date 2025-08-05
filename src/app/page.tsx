import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const artists = await prisma.artist.findMany();

  return (
    <div>
      {artists.map((artist) => (
        <p key={artist.id}>
          <Link href={`/artists/${artist.id}`}>{artist.name}</Link>
        </p>
      ))}
    </div>
  );
}
