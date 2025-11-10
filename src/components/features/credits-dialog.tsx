import { buildCreditSections } from "@/utils/credit-sections";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Separator } from "../ui/separator";
import { useQuery } from "@tanstack/react-query";
import { ReactNode } from "react";
import { trackQueryOptions } from "@/features/track/track-query-options";

type CreditsDialogProps = {
  trackId: string;
  trigger: ReactNode;
};

export default function CreditsDialog({
  trackId,
  trigger,
}: CreditsDialogProps) {
  const { data, status, error } = useQuery({
    ...trackQueryOptions.trackCredits(trackId),
  });

  if (status === "error") {
    return <div>Error: {error.message}</div>;
  }

  if (status === "pending") {
    return (
      <Dialog>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent aria-describedby={undefined} className="gap-4">
          <DialogHeader>
            <DialogTitle>Credits</DialogTitle>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  const { title, credits } = data;

  const creditSections = buildCreditSections(credits);

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent aria-describedby={undefined} className="gap-4">
        <DialogHeader>
          <DialogTitle>{title} - Credits</DialogTitle>
        </DialogHeader>
        <Separator />
        <ol role="list" className="space-y-4">
          {creditSections.map((creditSection) => (
            <li key={creditSection.id}>
              <p className="font-medium">{creditSection.title}</p>
              <p className="text-muted-foreground">
                {creditSection.people.reduce((acc, person, index) => {
                  if (index < creditSection.people.length - 1) {
                    return acc + person.displayName + ", ";
                  }
                  return acc + person.displayName;
                }, "")}
              </p>
            </li>
          ))}
        </ol>
      </DialogContent>
    </Dialog>
  );
}
