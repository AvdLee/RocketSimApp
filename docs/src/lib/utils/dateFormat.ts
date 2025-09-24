import { format } from "date-fns";

export const dateFormat = (
  date: Date | string,
  pattern: string = "dd MMM, yyyy"
): string => {
  const dateObj = new Date(date);
  const output = format(dateObj, pattern);
  return output;
};
