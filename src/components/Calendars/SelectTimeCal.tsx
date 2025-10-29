"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";

export default function SelectTimeCal({
    value,
    onChange,
    onBlur,
    error,
    initialDate,
}: {
    value: string | null;
    onChange: (value: string) => void;
    onBlur?: () => void;
    error?: string;
    initialDate: string;
}) {
    const onDateClick = (dateArg: DateClickArg) => {
        console.log(dateArg.dateStr);
        onChange(dateArg.dateStr);
    };

    return (
        <>
            <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridDay"
                initialDate={initialDate}
                headerToolbar={{
                    left: "title",
                    center: "",
                    right: "",
                }}
                footerToolbar={{
                    left: "",
                    center: "",
                    right: "",
                }}
                aspectRatio={2.5}
                // selectable={true}
                dateClick={onDateClick}
                businessHours={{
                    daysOfWeek: [1, 2, 3, 4, 5, 6],
                    startTime: "08:00", // 8am
                    endTime: "17:00", // 5pm
                }}
                slotMinTime="08:00:00"
                slotMaxTime="17:00:00"
            />
            {error && <h1 className="text-red-500">{error}</h1>}
        </>
    );
}
