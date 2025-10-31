"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { useState, useMemo } from "react";

// Define the slot duration in minutes (FullCalendar default is 30)
const SLOT_DURATION_MINUTES = 30;

// Define a type alias for the argument to ensure structural compatibility
type SlotLaneMountArg = {
    date?: Date; // Use '?' to indicate optionality
    el: HTMLElement;
    // FullCalendar passes other properties, but these are the ones we care about
    [key: string]: any;
};
// Note: The correct type for slotLaneDidMount is typically SlotLaneMountArg.
// We are using a direct structural type { date: Date | undefined; el: HTMLElement; }
// to satisfy TypeScript based on the error message.

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
    // Current date (fixed at component mount time for stable calculation)
    const today = useMemo(() => new Date(), []);

    // Create a date object for the calendar's initial date without time
    const initialViewDate = useMemo(() => {
        const date = new Date(initialDate);
        date.setHours(0, 0, 0, 0);
        return date;
    }, [initialDate]);

    // Check if the initial date is today
    const isToday = useMemo(
        () =>
            initialViewDate.getFullYear() === today.getFullYear() &&
            initialViewDate.getMonth() === today.getMonth() &&
            initialViewDate.getDate() === today.getDate(),
        [initialViewDate, today]
    );

    // --- Minimum Selectable Time Calculation ---
    const minSelectableTime = useMemo(() => {
        if (isToday) {
            const requiredStart = new Date(today.getTime() + 60 * 60 * 1000);
            const currentMinutes = requiredStart.getMinutes();
            const remainder = currentMinutes % SLOT_DURATION_MINUTES;

            let minutesToAdd = 0;

            if (remainder !== 0) {
                minutesToAdd = SLOT_DURATION_MINUTES - remainder;
            } else {
                minutesToAdd = 0; // Allows selection at the 1-hour mark exactly
            }

            const minAllowed = new Date(requiredStart.getTime());
            minAllowed.setMinutes(currentMinutes + minutesToAdd, 0, 0);

            return minAllowed;
        }

        return new Date(0);
    }, [isToday, initialViewDate, today]);

    // --- Slot Lane Did Mount Handler (For Visual Styling) ---
    // 🔑 Corrected Type: The date property is marked as optional by FullCalendar types.
    const handleSlotRender = (info: { date?: Date; el: HTMLElement }) => {
        // Type Guard: We must check if date is defined before proceeding
        if (!info.date) {
            return;
        }

        const slotTime = info.date;

        if (!isToday) {
            // Ensure classes are cleared when viewing non-today dates
            info.el.classList.remove("fc-forbidden-slot-direct");
            info.el.style.pointerEvents = "";
            return;
        }

        // Check if the current slot time is BEFORE the minimum allowed time
        if (slotTime < minSelectableTime) {
            info.el.classList.add("fc-forbidden-slot-direct");
        } else {
            // Ensure the class and pointer events are removed for all valid slots
            info.el.classList.remove("fc-forbidden-slot-direct");
            //
        }
    };

    // --- Date Click Handler (For Functional Blocking) ---
    const onDateClick = (dateArg: DateClickArg) => {
        const clickedTime = new Date(dateArg.dateStr);

        if (isToday) {
            if (clickedTime < minSelectableTime) {
                console.log(
                    "Selection blocked: Slot is too close to the current time."
                );
                return;
            }
        }

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
                aspectRatio={2}
                dateClick={onDateClick}
                businessHours={{
                    daysOfWeek: [1, 2, 3, 4, 5, 6],
                    startTime: "08:00", // 8am
                    endTime: "17:00", // 5pm
                }}
                slotMinTime="08:00:00"
                slotMaxTime="17:00:00"
                allDaySlot={false}
                // 🔑 Now correctly typed to resolve the error
                slotLaneDidMount={handleSlotRender}
            />
            {error && <h1 className="text-red-500">{error}</h1>}
        </>
    );
}
