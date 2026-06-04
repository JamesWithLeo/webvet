"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { useEffect, useMemo, useRef, useState } from "react";
import "@mantine/notifications/styles.css";
import { notifications } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import { BlockDatesTypeModel } from "@/db/schema/appointments";
import { useAppointment } from "@/lib/hooks/useAppointmentContext";
import { EventClickArg } from "@fullcalendar/core/index.js";

const SLOT_DURATION_MINUTES = 60;

type Props = {
    value: string | null;
    onChange: (value: string) => void;
    onBlur?: () => void;
    error?: string;
    initialDate: Date;
};

export default function SelectTimeCal({
    value,
    onChange,
    onBlur,
    error,
    initialDate,
}: Props) {
    const calendarRef = useRef<FullCalendar>(null);
    const [currentTime, setCurrentTime] = useState(new Date());

    const { timeEvents } = useAppointment();

    // update the time per minute
    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 60000); // 60000 ms = 1 minute

        return () => clearInterval(intervalId);
    }, []);

    // Create a date object for the calendar's initial date without time
    const initialViewDate = useMemo(() => {
        const date = new Date(initialDate);
        date.setHours(0, 0, 0, 0);
        return date;
    }, [initialDate]);

    // Check if the initial date is today
    const isToday = useMemo(
        () =>
            initialViewDate.getFullYear() === currentTime.getFullYear() &&
            initialViewDate.getMonth() === currentTime.getMonth() &&
            initialViewDate.getDate() === currentTime.getDate(),
        [initialViewDate, currentTime]
    );

    const minSelectableTime = useMemo(() => {
        if (isToday) {
            const requiredStart = new Date(
                currentTime.getTime() + 60 * 60 * 1000
            );
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
    }, [isToday, initialViewDate, currentTime]);

    const handleSlotRender = (info: { date?: Date; el: HTMLElement }) => {
        if (!info.date) {
            return;
        }

        const slotTime = info.date;

        const comparableSlotTime = new Date(initialViewDate);
        comparableSlotTime.setHours(
            slotTime.getHours(),
            slotTime.getMinutes(),
            0,
            0
        );

        // Check if we are viewing the current day
        if (!isToday) {
            info.el.classList.remove("fc-forbidden-slot-direct");
            info.el.style.pointerEvents = "";
            return;
        }

        if (comparableSlotTime < minSelectableTime) {
            info.el.classList.add("fc-forbidden-slot-direct");
        } else {
            info.el.classList.remove("fc-forbidden-slot-direct");
        }
    };

    const handleDateClick = (dateArg: DateClickArg) => {
        const clickedTime = new Date(dateArg.dateStr);
        if (isToday) {
            if (clickedTime < minSelectableTime) {
                notifications.show({
                    color: "red",
                    title: "Unavailable",
                    message:
                        "The selected time slot is no longer available. Please choose another time.",
                });
                return;
            }
        }

        onChange(dateArg.dateStr);
    };

    const onEventClick = (eventArg: EventClickArg) => {
        const isFull = eventArg.event.extendedProps.isFull;

        if (isFull) {
            notifications.show({
                color: "red",
                title: "Fully Booked",
                message:
                    "The selected time slot is fully booked. Please choose another time.",
            });
            return;
        }
        // 1. Get the ISO string (e.g., "2026-02-12T13:00:00+08:00" or "2026-02-12T05:00:00Z")
        const isoString = eventArg.event.startStr;

        onChange(isoString);
    };

    return (
        <>
            <FullCalendar
                ref={calendarRef}
                height={"100%"}
                eventSources={[
                    {
                        url: "/api/blockdates",
                        textColor: "#ffffff",
                        color: "#4a5565",
                    },
                    {
                        url: "/api/calendar/timeslot",
                        id: "time-slot",
                        textColor: "#ffffff",
                        color: "#4a5565",
                    },
                ]}
                eventClick={onEventClick}
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridDay"
                initialDate={initialDate}
                key={timeEvents.length}
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
                dateClick={handleDateClick}
                businessHours={{
                    daysOfWeek: [1, 2, 3, 4, 5, 6],
                    startTime: "08:00", // 8am
                    endTime: "17:00", // 5pm
                }}
                slotMinTime="08:00:00"
                slotMaxTime="17:00:00"
                allDaySlot={false}
                slotLaneDidMount={handleSlotRender}
                slotDuration={"00:60:00"}
                expandRows={true}
            />
            {error && <h1 className="text-red-500">{error}</h1>}
        </>
    );
}
