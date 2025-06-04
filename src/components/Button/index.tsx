import { Slot } from "@radix-ui/react-slot";
import * as React from "react";

import cn from "@/utils/cn";

import styles from "./button.module.css";

function Button({
  className,

  asChild = false,
  ...props
}: React.ComponentProps<"button"> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      data-slot="button"
      className={cn([styles.button, className])}
      {...props}
    />
  );
}

export { Button };
