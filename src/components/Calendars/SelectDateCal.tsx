"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import monthGridPlugin from "@fullcalendar/multimonth";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";

export default function SelectDateCal({
    value,
    onChange,
    onBlur,
    error,
}: {
    value: string | null;
    onChange: (value: string) => void;
    onBlur?: () => void;
    error?: string;
}) {
    const onDateClick = (dateArg: DateClickArg) => {
        console.log(dateArg.dateStr);
        // onSetDate(dateArg.dateStr);
        onChange(dateArg.dateStr);
        const calendarApi = dateArg.view.calendar;
        const selectedDate = dateArg.date;
    };

    return (
        <>
            <FullCalendar
                plugins={[dayGridPlugin, monthGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                // initialView="multiMonthYear"
                multiMonthMaxColumns={1}
                headerToolbar={{
                    left: "title",
                    center: "",
                    right: "prev,next today",
                }}
                footerToolbar={{
                    left: "",
                    center: "",
                    right: "",
                }}
                aspectRatio={2}
                // selectable={false}
                dateClick={onDateClick}
                businessHours={{
                    daysOfWeek: [1, 2, 3, 4, 5, 6],
                    startTime: "08:00", // 8am
                    endTime: "17:00", // 5pm
                }}
                slotMinTime="08:00:00"
                slotMaxTime="17:00:00"
                // selectAllow={(dateSpan) => {
                //     const startStr = dateSpan.start.toISOString().split("T")[0];
                //     const endStr = dateSpan.end.toISOString().split("T")[0];

                //     return startStr === endStr;
                // }}
            />
            {error && <h1 className="text-red-500">{error}</h1>}
        </>
    );
}
