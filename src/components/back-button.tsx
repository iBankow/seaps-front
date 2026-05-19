import { Button, buttonVariants } from "@/components/ui/button";
import { useRouter } from "@tanstack/react-router";
import type { VariantProps } from "class-variance-authority";
import { ArrowLeft } from "lucide-react";

export const BackButton = ({
  ...props
}: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) => {
  const router = useRouter();

  return (
    <Button {...props} onClick={() => router.history.back()}>
      {/* <Link to={""}> */}
      <ArrowLeft className="h-4 w-4" />
      {/* </Link> */}
    </Button>
  );
};
