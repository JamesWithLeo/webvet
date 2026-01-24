"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { DateSelectArg } from "@fullcalendar/core/index.js";
import { useState } from "react";
import AppointmentConfirmationModal from "@/components/common/AppointmentConfirmationModal";

export default function AppointmentCalendar({
    type,
    name,
}: {
    type: string;
    name: string;
}) {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [isSelectingTime, setIsSelectingTime] = useState<boolean>(false);

    const onDateClick = (dateArg: DateClickArg) => {
        if (dateArg.view.type === "dayGridMonth") {
            console.log(dateArg);
            const calendarApi = dateArg.view.calendar;
            const selectedDate = dateArg.date;

            calendarApi.changeView("timeGridDay", selectedDate);
            setIsSelectingTime(true);
        }
    };
    const onSelect = async (selectArg: DateSelectArg) => {
        if (selectArg.view.type === "timeGridDay") {
            const date = selectArg.start.toISOString().split("T")[0];
            const time = selectArg.start.toTimeString().slice(0, 5); // "HH:MM"

            // Update the URL with query parameters
            // router.push(`/v1/appointment?date=${date}&time=${time}`);
            setSelectedDate(date);
            setSelectedTime(time);
        } else {
            selectArg.view.calendar.changeView("dayGridMonth");
            setIsSelectingTime(false);
        }
    };

    const onCancel = () => {
        setSelectedDate(null);
        setSelectedTime(null);
    };

    return (
        <>
            <AppointmentConfirmationModal
                onCancel={onCancel}
                name={name}
                type={type}
                date={selectedDate}
                time={selectedTime}
            />
            <div className="w-full h-full">
                <h1 className="text-2xl font-bold ">
                    {isSelectingTime
                        ? "Step 2: Select Specific Time"
                        : "Step 1: Pick an Appointment Date"}
                </h1>
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    headerToolbar={{
                        left: "title",
                        center: "",
                        right: "today dayGridMonth,timeGridDay",
                    }}
                    footerToolbar={{
                        left: "",
                        center: "",
                        right: "prev,next",
                    }}
                    aspectRatio={2.5}
                    selectable={true}
                    select={onSelect}
                    dateClick={onDateClick}
                    businessHours={{
                        daysOfWeek: [1, 2, 3, 4, 5, 6],
                        startTime: "08:00", // 8am
                        endTime: "17:00", // 5pm
                    }}
                    slotMinTime="08:00:00"
                    slotMaxTime="17:00:00"
                />
            </div>
        </>
    );
}
