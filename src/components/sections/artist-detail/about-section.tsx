"use client";

import { CldImage } from "next-cloudinary";
import SectionHeading from "@/components/ui/section-heading";
import { TFullArtist } from "@/types";

type AboutSectionProps = Pick<
  TFullArtist,
  "bio" | "monthlyListeners" | "name" | "bannerId"
>;

export const AboutSection = ({
  bio,
  monthlyListeners,
  name,
  bannerId,
}: AboutSectionProps) => {
  return (
    <section>
      <SectionHeading title="About" />
      <div className="rounded-lg flex items-center justify-between gap-12 px-12 py-8 relative overflow-hidden aspect-video group">
        <CldImage
          src={bannerId}
          alt={name}
          fill
          sizes="100vw"
          className="object-cover hover:scale-105 transition-transform duration-500 brightness-65"
        />
        <div className="absolute bottom-12 left-12 space-y-3 w-2/3">
          <p className="font-semibold text-base text-white">
            {monthlyListeners} monthly listeners
          </p>
          <p className="text-[calc(15rem/16)] text-white line-clamp-3">{bio}</p>
        </div>
      </div>
    </section>
  );
};

// export const ArtistAboutSkeleton = () => {
//   return (
//     <section>
//       <SectionHeading heading="About" />
//       <div className="rounded-lg bg-card flex items-center justify-between gap-12 px-12 py-8">
//         <div className="flex flex-col items-center shrink-0 gap-4">
//           <div className="relative size-56 rounded-full overflow-hidden">
//             <Skeleton className="size-56" />
//           </div>
//           <Skeleton className="w-32 h-4" />
//         </div>
//         <TextSkeleton lines={5} />
//       </div>
//     </section>
//   );
// };
