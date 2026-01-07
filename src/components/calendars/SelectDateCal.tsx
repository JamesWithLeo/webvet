"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import monthGridPlugin from "@fullcalendar/multimonth";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { DayCellContentArg } from "@fullcalendar/core/index.js";
import { notifications } from "@mantine/notifications";
import { appointmentTypeValues } from "@/db/schema/appointments";

const typePerSchedule: Record<
    (typeof appointmentTypeValues)[number],
    number[]
> = {
    CHECK_UP: [2, 3, 5, 6],
    GROOMING: [1, 3, 4, 5, 6],
    VACCINATION: [2, 3, 5, 6],
    CONSULTATION: [2, 3, 5, 6],
    DEWORMING: [2, 3, 5, 6],
};

export default function SelectDateCal({
    onChange,
    error,
    type,
}: {
    onChange: (value: string) => void;
    error?: string;
    type: (typeof appointmentTypeValues)[number];
}) {
    const isDayMatchToType = (day: number) => {
        return typePerSchedule[type].includes(day);
    };
    const onDateClick = (dateArg: DateClickArg) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const clickedDate = dateArg.date;
        clickedDate.setHours(0, 0, 0, 0);
        const dayOfWeek = clickedDate.getDay();

        if (dayOfWeek === 0) {
            notifications.show({
                title: "Appointment Not Available",
                message:
                    "The clinic is not open on sunday. Please choose a different date.",
                color: "red",
            });
            return;
        } else if (clickedDate < today) {
            notifications.show({
                title: "Appointment Not Available",
                message:
                    "The selected date is no longer available. Please choose another date.",
                color: "red",
            });
            return;
        } else if (!isDayMatchToType(dayOfWeek)) {
            notifications.show({
                title: "Appointment Not Available",
                message:
                    "The clinic is not open for this type of appointment on the selected day of the week. Please choose a different date.",
                color: "red",
            });
            return;
        } else if (clickedDate >= today) {
            onChange(dateArg.dateStr);
            return;
        } else {
            notifications.show({
                title: "Appointment Not Available",
                message:
                    "The selected date is no longer available. Please choose another date.",
                color: "red",
            });
            return;
        }
    };

    const getDayClassNames = (arg: DayCellContentArg) => {
        const date = arg.date;
        const dayOfWeek = date.getDay();

        if (dayOfWeek === 0) {
            return "past-date-cell"; // Use a distinct class, maybe "weekend-cell" or "unavailable-cell"
        }

        const cellDate = new Date(date);
        cellDate.setHours(0, 0, 0, 0);

        // Get today's date adjusted to midnight for an accurate day-to-day comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // Check if the cell date is strictly in the past (before today)
        if (cellDate < today) {
            return "past-date-cell";
        }

        const availSchedule = typePerSchedule[type];

        if (!availSchedule || !availSchedule.includes(dayOfWeek)) {
            return "past-date-cell";
        }

        return "future-date-cell";
    };

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
