import dayjs from "dayjs";

export function parseDate(dateStr: any, formatString = "YYYY-MM-DD"): string {
  if (typeof dateStr === "string") {
    return dayjs(dateStr).format(formatString);
  } else {
    return "N/A";
  }
}
