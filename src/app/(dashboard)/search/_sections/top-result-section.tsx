import { SearchResult } from "@/features/search/contracts/search-dto";
import SectionHeading from "../../../../components/ui/section-heading";
import Link from "next/link";
import Dot from "../../../../components/ui/dot";
import { CldImage } from "next-cloudinary";
import { BadgeCheckIcon } from "lucide-react";
import { FollowersBadge } from "../../../../components/features/follow-badge";
import { ContextPlayButton } from "@/components/shared/context-play-button";
import { AppImage } from "@/components/shared/app-image";

type TopResultSectionProps = {
  topResult: SearchResult["topResult"];
  q: string;
};

export default function TopResultSection({
  topResult,
  q,
}: TopResultSectionProps) {
  if (topResult?.type === "artists") {
    return (
      <section>
        <SectionHeading title="Top Result" />
        <div className="relative overflow-hidden bg-muted/60 rounded-lg group p-5 space-y-5">
          <CldImage
            alt={topResult?.item.name}
            src={topResult?.item.bannerId}
            fill
            className="object-cover brightness-80 group-hover:brightness-60 transition-all duration-300"
          />
          <ContextPlayButton
            context={{
              contextType: "ARTIST",
              contextId: topResult.item.id,
            }}
            className="absolute bottom-0 right-5 opacity-0 translate-y-2 scale-95 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
          />
          <div className="space-y-3 absolute bottom-5 left-5">
            {topResult?.item.isVerified && (
              <div className="flex gap-2 items-center">
                <BadgeCheckIcon className="stroke-white fill-sky-500 size-8" />
                Verified Artist
              </div>
            )}
            <div>
              <Link
                href={`/artists/${topResult.item.id}`}
                className="font-semibold text-2xl hover:underline underline-offset-4 hover:text-primary transition-colors duration-200"
              >
                {topResult?.item.name}
              </Link>
            </div>
            <div>
              <FollowersBadge artistId={topResult.item.id} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section>
      <SectionHeading title="Top Result" />
      <div className="relative bg-muted/60 rounded-lg group hover:bg-muted transition-colors duration-400 p-5 flex flex-col gap-6">
        <AppImage
          alt={topResult?.item.title}
          src={topResult?.item.album.imageId}
          containerClassName="size-40"
          sizes="160px"
        />
        <div className="space-y-3 flex-1 flex flex-col justify-between">
          <h3 className="font-semibold text-2xl">{topResult?.item.title}</h3>
          <div className="flex items-center gap-1.5">
            <span className="capitalize text-muted-foreground">
              {topResult?.type}
            </span>
            <Dot />
            {topResult?.item.artists.map(({ artist }, index, originalArr) => (
              <span key={artist.id} className="truncate">
                <Link
                  href={`/artists/${artist.id}`}
                  className="text-[calc(13rem/16)] hover:text-primary hover:underline underline-offset-3 truncate font-medium"
                >
                  {artist.name}
                </Link>
                {index < originalArr.length - 1 && ", "}
              </span>
            ))}
          </div>
        </div>
        <ContextPlayButton
          context={{ contextType: "SEARCH", contextId: q }}
          className="absolute opacity-0 bottom-5 right-5 translate-y-5 scale-95 transition-all duration-400 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100"
        />
      </div>
    </section>
  );
}
