"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import monthGridPlugin from "@fullcalendar/multimonth";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { DatesSetArg, DayCellContentArg } from "@fullcalendar/core/index.js";
import { notifications } from "@mantine/notifications";
import { BlockDatesTypeModel } from "@/db/schema/appointments";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button, em, Group, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useAppointment } from "@/lib/hooks/useAppointmentContext";

interface Props {
    children: React.ReactNode;
    onChange: (value: string) => void;
    error?: string;
}

export default function SelectDateCal({ children, onChange, error }: Props) {
    const calendarRef = useRef<FullCalendar>(null);
    const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
    const [currentTitle, setCurrentTitle] = useState("loading...");
    const [now, setNow] = useState(new Date());
    const { allowedDays, hasConflict, incompatibleServices } = useAppointment();

    const handleDatesSet = (dateInfo: DatesSetArg) => {
        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
            const title = calendarApi.view.title;
            setCurrentTitle(title);
        }
    };

    const onDateClick = (dateArg: DateClickArg) => {
        // check blocked date first
        const eventsOnDate = calendarRef.current
            ?.getApi()
            .getEvents()
            .filter((event) => {
                return event.startStr === dateArg.dateStr && event.allDay;
            });
        if (!eventsOnDate || eventsOnDate.length > 0) {
            notifications.show({
                title: "Date blocked",
                message: "The clinic is not open for specific reason.",
                color: "red",
            });
            return;
        }

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
        } else if (!allowedDays.includes(dayOfWeek)) {
            notifications.show({
                title: "Service Not Available",
                message:
                    "One or more of your selected services are not scheduled for this day of the week.",
                color: "orange",
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

    const { data } = useQuery({
        queryKey: ["blockedDates"],
        queryFn: async (): Promise<BlockDatesTypeModel[]> => {
            const res = await fetch("/api/blockdates");
            return res.json();
        },
    });

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
        if (!allowedDays || !allowedDays.includes(dayOfWeek))
            return "past-date-cell";
        return "future-date-cell";
    };

    useEffect(() => {
        // ensure the calendar rendered then assigned the title (e.g January 2026)
        const calendar = calendarRef.current?.getApi();
        const timer = setInterval(() => setNow(new Date()), 60000);

        if (!calendar) return () => clearInterval(timer);
        setCurrentTitle(calendar.view.title);

        return () => clearInterval(timer);
    }, []);

    return (
        <>
            <div className="justify-between items-center flex ">
                <div className="flex gap-2">
                    <label className="lg:text-2xl text-lg font-bold">
                        {currentTitle}
                    </label>
                </div>
                <div className="flex gap-2">
                    {children}
                    <Button.Group>
                        <Button
                            onClick={() => calendarRef.current?.getApi().prev()}
                            size={isMobile ? "xs" : "sm"}
                            variant="default"
                            c="gray.7"
                        >
                            <IconChevronLeft size={20} />
                        </Button>
                        <Button
                            onClick={() => calendarRef.current?.getApi().next()}
                            size={isMobile ? "xs" : "sm"}
                            variant="default"
                            c="gray.7"
                        >
                            <IconChevronRight size={20} />
                        </Button>
                    </Button.Group>

                    <Button
                        variant="default"
                        c="gray.7"
                        size={isMobile ? "xs" : "sm"}
                        onClick={() => calendarRef.current?.getApi().today()}
                    >
                        Today
                    </Button>
                </div>
            </div>
            <FullCalendar
                ref={calendarRef}
                datesSet={handleDatesSet}
                plugins={[dayGridPlugin, monthGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                multiMonthMaxColumns={1}
                headerToolbar={false}
                footerToolbar={false}
                aspectRatio={isMobile ? 1 : 2}
                dateClick={onDateClick}
                businessHours={{
                    daysOfWeek: [1, 2, 3, 4, 5, 6],
                    startTime: "08:00",
                    endTime: "17:00",
                }}
                events={data?.map((v) => ({
                    title: v.reason || "Blocked",
                    id: v.id,
                    date: v.date,
                    start: v.startTime,
                    end: v.endTime,
                    display: "block",
                    color: "#4a5565",
                }))}
                slotMinTime="08:00:00"
                slotMaxTime="17:00:00"
                dayCellClassNames={getDayClassNames}
            />

            <Group justify="space-between">
                {error && <h1 className="text-red-500">{error}</h1>}
            </Group>
        </>
    );
}
