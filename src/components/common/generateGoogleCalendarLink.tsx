export default function GenerateGoogleCalendarLink({
    title,
    description,
    location,
    start,
    end,
}: {
    title: string;
    description: string;
    location: string;
    start: Date;
    end: Date;
}) {
    const fmt = (date: Date) => date.toISOString().replace(/-|:|\.\d+/g, "");

    const baseUrl =
        "https://calendar.google.com/calendar/render?action=TEMPLATE";
    const params = new URLSearchParams({
        text: title,
        dates: `${fmt(start)}/${fmt(end)}`,
        details: description,
        location: location,
    });

    return `${baseUrl}&${params.toString()}`;
}
