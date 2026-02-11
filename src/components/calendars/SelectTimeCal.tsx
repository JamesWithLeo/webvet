"use client";

import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { useEffect, useMemo, useState } from "react";
import "@mantine/notifications/styles.css";
import { notifications } from "@mantine/notifications";
import { useQuery } from "@tanstack/react-query";
import { BlockDatesTypeModel } from "@/db/schema/appointments";

// Define the slot duration in minutes (FullCalendar default is 30)
const SLOT_DURATION_MINUTES = 30;
type Props = {
    value: string | null;
    onChange: (value: string) => void;
    onBlur?: () => void;
    error?: string;
    initialDate: string;
};

export default function SelectTimeCal({
    value,
    onChange,
    onBlur,
    error,
    initialDate,
}: Props) {
    const [currentTime, setCurrentTime] = useState(new Date());

    const { data } = useQuery({
        queryKey: ["blockedDates"],
        queryFn: async (): Promise<BlockDatesTypeModel[]> => {
            const res = await fetch("/api/blockdates");
            return res.json();
        },
    });
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

    const onDateClick = (dateArg: DateClickArg) => {
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
                slotLaneDidMount={handleSlotRender}
                events={data?.map((v) => ({
                    title: v.reason || "Blocked",
                    id: v.id,
                    date: v.date,
                    start: v.startTime,
                    end: v.endTime,
                    display: "block",
                    color: "#4a5565",
                }))}
            />
            {error && <h1 className="text-red-500">{error}</h1>}
        </>
    );
}
