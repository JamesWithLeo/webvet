export type BlockType = "all-day" | "morning" | "afternoon";

export default function generateBlockPayload(dateStr: string, type: BlockType) {
    switch (type) {
        case "all-day":
            return {
                date: dateStr,
                // 00:00:00 to 23:59:59 covers the full calendar square
                startTime: `${dateStr}T8:00:00Z`,
                endTime: `${dateStr}T17:00:00Z`,
            };

        case "morning":
            return {
                date: dateStr,
                // Assuming morning is 8 AM to 12 PM
                startTime: `${dateStr}T08:00:00Z`,
                endTime: `${dateStr}T12:00:00Z`,
            };

        case "afternoon":
            return {
                date: dateStr,
                // Assuming afternoon is 12 PM to 5 PM
                startTime: `${dateStr}T12:00:00Z`,
                endTime: `${dateStr}T17:00:00Z`,
            };
    }
}
