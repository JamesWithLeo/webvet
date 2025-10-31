"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import monthGridPlugin from "@fullcalendar/multimonth";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { DayCellContentArg } from "@fullcalendar/core/index.js";

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
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const clickedDate = dateArg.date;
        clickedDate.setHours(0, 0, 0, 0);

        if (clickedDate.getDay() === 0) {
            console.log("Past date clicked - action blocked:", clickedDate);
        } else if (clickedDate >= today) {
            console.log("Date clicked:", dateArg.dateStr);
            onChange(dateArg.dateStr);
        } else {
            // The date is in the past, so do nothing or show a message
            console.log("Past date clicked - action blocked:", clickedDate);
        }
        // const calendarApi = dateArg.view.calendar;
        // const selectedDate = dateArg.date;
    };

    const getDayClassNames = (arg: DayCellContentArg) => {
        // Standard logic to check for past/future dates
        // ... (Your existing logic here for past-date-cell or future-date-cell)

        // Check if the day is Sunday (getDay() returns 0 for Sunday)
        if (arg.date.getDay() === 0) {
            return "past-date-cell";
        }

        // Return other classes based on your existing logic (e.g., future-date-cell)
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const cellDate = arg.date;
        cellDate.setHours(0, 0, 0, 0);

        if (cellDate >= today) {
            return "future-date-cell";
        } else {
            return "past-date-cell";
        }
    };

    // ... in your return statement:
    <FullCalendar
        // ...
        dayCellClassNames={getDayClassNames}
        // ...
    />;

    return (
        <>
            <FullCalendar
                plugins={[dayGridPlugin, monthGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
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
                dateClick={onDateClick}
                businessHours={{
                    daysOfWeek: [1, 2, 3, 4, 5, 6],
                    startTime: "08:00",
                    endTime: "17:00",
                }}
                slotMinTime="08:00:00"
                slotMaxTime="17:00:00"
                dayCellClassNames={getDayClassNames}
            />
            {error && <h1 className="text-red-500">{error}</h1>}
        </>
    );
}
