"use client";

import FullCalendar from "@fullcalendar/react";
import multiMonthPlugin from "@fullcalendar/multimonth";
import { EventClickArg, EventSourceInput } from "@fullcalendar/core/index.js";
import { useMemo, useRef } from "react";

const eventsList = [
    {
        title: "Gin's Grooming",
        start: "2025-11-10T12:00:00",
        end: "2025-11-10T12:30:00",
        // display: "block",
        // color: "#3b82f6",
    },
    { user: "Alice", title: "Team Meeting", start: "2025-10-27T10:00:00" },
    { user: "Bob", title: "Code Review", start: "2025-10-27T14:00:00" },
    { user: "Charlie", title: "Demo", start: "2025-10-28T09:00:00" },
];
export default function CalendarList() {
    const calendarRef = useRef<FullCalendar>(null);
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
    return (
        <>
            <FullCalendar
                ref={calendarRef}
                plugins={[multiMonthPlugin]}
                initialView="multiMonthYear"
                aspectRatio={1.5}
                multiMonthMaxColumns={1}
                headerToolbar={{ left: "", center: "", right: "" }}
                footerToolbar={{
                    left: "",
                    center: "",
                    right: "prev,next today",
                }}
                events={eventsList}
                eventClick={onEventClick}
                viewClassNames={"cursor-pointer"}
            />
        </>
    );
}
