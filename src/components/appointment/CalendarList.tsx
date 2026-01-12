"use client";

import FullCalendar from "@fullcalendar/react";
import multiMonthPlugin from "@fullcalendar/multimonth";
import dayMonthPlugin from "@fullcalendar/daygrid";
import { DatesSetArg, EventClickArg } from "@fullcalendar/core/index.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import NewAppointmentButton from "../common/NewAppointmentButton";
import { toTitleCase } from "@/lib/toTitleCase";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { AppointmentPetMergeType } from "@/db/schema/appointments";
import AppointmentDrawer from "./AppointmentDrawer";

type Props = {
    appointments: {
        id: string;
        title: string | null;
        event_datetime: string;
        type: string;
        pets: {
            id: string;
            name: string;
            photoUrl: string | null;
        }[];
    }[];
};
export default function CalendarList({ appointments }: Props) {
    const calendarRef = useRef<FullCalendar>(null);
    const [currentTitle, setCurrentTitle] = useState("loading calendar..");
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedAppointment, setSelectedAppointment] =
        useState<AppointmentPetMergeType>();
    const isMobile = useMediaQuery("(max-width: 64rem)");

    const onEventClick = useCallback((info: EventClickArg) => {
        console.log(info.event.extendedProps);

        setSelectedAppointment({
            ...(info.event.extendedProps as AppointmentPetMergeType),
        });
        // passed the pet & appointment data on drawer
        open(); // show modal
    }, []);

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
            <div className="justify-between items-center flex">
                <label className="lg:text-2xl text-lg font-bold">
                    {currentTitle}
                </label>
                <div className="flex gap-2">
                    <NewAppointmentButton size={isMobile ? "xs" : "sm"} />
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
                </div>
            </div>
            <FullCalendar
                ref={calendarRef}
                plugins={[multiMonthPlugin, dayMonthPlugin]}
                initialView="dayGridMonth"
                selectable={false}
                datesSet={handleDatesSet}
                aspectRatio={isMobile ? 0.8 : 2}
                multiMonthMaxColumns={1}
                headerToolbar={false}
                footerToolbar={false}
                events={appointments.map((v) => ({
                    title:
                        v.title ??
                        `${toTitleCase(v.type)} for ${toTitleCase(v.pets.map((v) => v.name).join(", "))}`,
                    start: new Date(v.event_datetime).toISOString(),
                    end: new Date(v.event_datetime).toISOString(),
                    display: "block",
                    extendedProps: {
                        ...v,
                    },
                }))}
                eventClick={onEventClick}
                viewClassNames={"cursor-pointer"}
            />
            {/* to do add loader */}
            {selectedAppointment && (
                <AppointmentDrawer
                    opened={opened}
                    close={close}
                    selectedAppointment={selectedAppointment}
                />
            )}
        </>
    );
}
