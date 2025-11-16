"use client";

import FullCalendar from "@fullcalendar/react";
import multiMonthPlugin from "@fullcalendar/multimonth";
import dayMonthPlugin from "@fullcalendar/daygrid";
import { DatesSetArg, EventClickArg } from "@fullcalendar/core/index.js";
import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import NewAppointmentButton from "./NewAppointmentButton";

const eventsList = [
    {
        title: "Jin's Grooming",
        start: "2025-11-10T12:00:00",
        end: "2025-11-10T12:30:00",
        display: "block",
    },
    {
        title: "Ara's Vaccination",
        start: "2025-11-21T08:30:00",
        end: "2025-11-21T12:30:00",
        display: "block",
    },
];
export default function CalendarList() {
    const calendarRef = useRef<FullCalendar>(null);
    const [currentTitle, setCurrentTitle] = useState("loading calendar..");
    const totals = useMemo(() => {
        const map: Record<string, number> = {};
        eventsList.forEach((e) => {
            const day = e.start.split("T")[0];
            map[day] = (map[day] || 0) + 1;
        });
        return map;
    }, []);
    const onEventClick = (info: EventClickArg) => {
        alert("Event: " + info.event.title);
        const api = calendarRef.current?.getApi();
        api?.today(); // go to current date
        // alert("Coordinates: " + info.jsEvent.pageX + "," + info.jsEvent.pageY);
        // alert("View: " + info.view.type);
    };

    const handleDatesSet = (dateInfo: DatesSetArg) => {
        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
            const title = calendarApi.view.title;
            setCurrentTitle(title);
        }
    };
    useEffect(() => {
        const calendar = calendarRef.current?.getApi();
        if (!calendar) return;
        setCurrentTitle(calendar.view.title);
    }, []);
    return (
        <>
            <div className="justify-between flex">
                <label className="text-2xl ">{currentTitle}</label>
                <div className="flex gap-2">
                    <NewAppointmentButton />
                    <Button.Group>
                        <Button
                            onClick={() => calendarRef.current?.getApi().prev()}
                            size="sm"
                            variant="default"
                        >
                            <IconChevronLeft size={20} />
                        </Button>
                        <Button
                            onClick={() => calendarRef.current?.getApi().next()}
                            size="sm"
                            variant="default"
                        >
                            <IconChevronRight size={20} />
                        </Button>
                    </Button.Group>
                </div>
            </div>
            <FullCalendar
                ref={calendarRef}
                plugins={[multiMonthPlugin, dayMonthPlugin]}
                initialView="dayGridMonth"
                selectable={false}
                datesSet={handleDatesSet}
                aspectRatio={2}
                multiMonthMaxColumns={1}
                headerToolbar={{ left: "", center: "", right: "" }}
                footerToolbar={false}
                events={eventsList}
                eventClick={onEventClick}
                viewClassNames={"cursor-pointer"}
            />
        </>
    );
}
