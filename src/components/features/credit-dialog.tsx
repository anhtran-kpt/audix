import { buildCreditSections } from "@/lib/helpers/build-credit-sections";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { TA, TCredit } from "@/types";
import { Separator } from "../ui/separator";

interface CreditDialogProps {
  trackTitle: string;
  artists: TA[];
  credits: TCredit[];
}

export default function CreditDialog({
  trackTitle,
  artists,
  credits,
}: CreditDialogProps) {
  const creditSections = buildCreditSections({ artists, credits });

  return (
    <Dialog>
      <DialogTrigger className="font-medium text-[calc(13rem/16)] text-muted-foreground hover:text-primary hover:underline underline-offset-2 cursor-pointer">
        Show all
      </DialogTrigger>
      <DialogContent className="gap-4">
        <DialogHeader>
          <DialogTitle>{trackTitle} - Credits</DialogTitle>
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
