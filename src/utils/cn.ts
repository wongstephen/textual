import clsx, { ClassValue } from "clsx";

export default function cn(input: ClassValue[]) {
  return clsx(...input);
}
