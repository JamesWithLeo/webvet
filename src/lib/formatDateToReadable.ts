const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
};
export function formatDateToReadable(date: string | number | Date) {
    return new Intl.DateTimeFormat("en-US", options).format(
        typeof date === "string" ? new Date(date) : date
    );
}
