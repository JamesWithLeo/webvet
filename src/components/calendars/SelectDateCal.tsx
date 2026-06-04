"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { DatesSetArg, DayCellContentArg } from "@fullcalendar/core/index.js";
import { notifications } from "@mantine/notifications";
import { useEffect, useRef, useState } from "react";
import { Button, em, Group } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { useAppointment } from "@/lib/hooks/useAppointmentContext";

interface Props {
    children: React.ReactNode;
    onChange: (value: Date) => void;
    error?: string;
}

const BLOCKED_DATES = "BLOCKED_DATES" as const;

export default function SelectDateCal({ children, onChange, error }: Props) {
    const [successFetching, setSuccessFetching] = useState(false);
    const calendarRef = useRef<FullCalendar>(null);
    const isMobile = useMediaQuery(`(max-width: ${em(750)})`);
    const [currentTitle, setCurrentTitle] = useState("loading...");
    const [now, setNow] = useState(new Date());
    const { allowedDays, monthEvents, setRange } = useAppointment();

    const handleDatesSet = (dateInfo: DatesSetArg) => {
        const calendarApi = calendarRef.current?.getApi();
        const utcStart = new Date(dateInfo.startStr).toISOString();
        const utcEnd = new Date(dateInfo.endStr).toISOString();

        setRange({
            start: utcStart,
            end: utcEnd,
        });
        if (calendarApi) {
            const title = calendarApi.view.title;
            setCurrentTitle(title);
        }
    };
    const handleDateClick = (dateArg: DateClickArg) => {
        if (!successFetching) {
            notifications.show({
                title: "Available dates failed to load",
                message: "Please try again later",
                color: "orange",
            });
            return;
        }
        handleGeneralClick(dateArg.date);
    };

    const handleGeneralClick = (date: Date) => {
        /// check past dates
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const clickedDate = date;
        clickedDate.setHours(0, 0, 0, 0);

        if (clickedDate < today) {
            notifications.show({
                title: "Appointment Not Available",
                message:
                    "The selected date is no longer available. Please choose another date.",
                color: "red",
            });
            return;
        }

        // check blocked date first
        const calApi = calendarRef.current?.getApi();

        if (calApi) {
            const eventsOnDate = calApi.getEvents().filter((event) => {
                const isBlockedSource = event.source?.id === BLOCKED_DATES;

                const isSameDate =
                    event.extendedProps.date ===
                    date.toLocaleDateString("en-CA");

                return isBlockedSource && isSameDate && event.allDay;
            });

            if (!eventsOnDate || eventsOnDate.length > 0) {
                notifications.show({
                    title: "Date blocked",
                    message: eventsOnDate
                        ? eventsOnDate[0].title
                        : "The clinic is not open for specific reason.",
                    color: "red",
                });
                return;
            }
        }

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
            console.log("Clicked", clickedDate.toISOString().split("T")[0]);
            // onChange(date.toISOString().split("T")[0]);
            onChange(date);
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
                            radius={"md"}
                            variant="default"
                            c="gray.7"
                        >
                            <IconChevronLeft size={20} />
                        </Button>
                        <Button
                            onClick={() => calendarRef.current?.getApi().next()}
                            size={isMobile ? "xs" : "sm"}
                            variant="default"
                            radius={"md"}
                            c="gray.7"
                        >
                            <IconChevronRight size={20} />
                        </Button>
                    </Button.Group>

                    <Button
                        variant="default"
                        c="gray.7"
                        radius={"md"}
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
                plugins={[dayGridPlugin, interactionPlugin]}
                eventSources={[
                    {
                        url: "/api/blockdates",
                        id: BLOCKED_DATES,

                        textColor: "#ffffff",
                        color: "#4a5565",

                        success: () => {
                            setSuccessFetching(true);
                        },
                        failure: () => {
                            setSuccessFetching(false);
                        },
                    },
                    {
                        events: monthEvents,
                        success: () => {
                            setSuccessFetching(true);
                        },
                        failure: () => {
                            setSuccessFetching(false);
                        },
                    },
                ]}
                lazyFetching={false}
                eventSourceFailure={() => setSuccessFetching(false)}
                eventSourceSuccess={() => setSuccessFetching(true)}
                initialView="dayGridMonth"
                headerToolbar={false}
                footerToolbar={false}
                aspectRatio={isMobile ? 1 : 2}
                dateClick={handleDateClick}
                businessHours={{
                    daysOfWeek: [1, 2, 3, 4, 5, 6],
                    startTime: "08:00",
                    endTime: "17:00",
                }}
                slotMinTime="08:00:00"
                slotMaxTime="17:00:00"
                displayEventTime={false}
                dayCellClassNames={getDayClassNames}
            />

            <Group justify="space-between">
                {error && <h1 className="text-red-500">{error}</h1>}
            </Group>
        </>
    );
}
