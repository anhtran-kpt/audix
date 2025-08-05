import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function Home() {
  const artist = await prisma.artist.findUnique({
    where: {
      slug: "bui-anh-tuan",
    },
  });
  return <Link href={`/artists/${artist?.id}`}>{artist?.name}</Link>;
}
