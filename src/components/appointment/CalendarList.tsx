"use client";

import FullCalendar from "@fullcalendar/react";
import multiMonthPlugin from "@fullcalendar/multimonth";
import dayMonthPlugin from "@fullcalendar/daygrid";
import {
    DatesSetArg,
    EventClickArg,
    EventContentArg,
    EventSourceInput,
} from "@fullcalendar/core/index.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@mantine/core";
import {
    IconAlertTriangleFilled,
    IconChevronLeft,
    IconChevronRight,
    IconFaceIdError,
} from "@tabler/icons-react";
import NewAppointmentButton from "../common/NewAppointmentButton";
import { toTitleCase } from "@/lib/toTitleCase";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import AppointmentDrawer from "./AppointmentDrawer";
import { JoinedAppointmentType } from "@/db/schema/appointments";
import { notifications } from "@mantine/notifications";

export default function CalendarList({
    appointments,
    error,
}: {
    appointments: JoinedAppointmentType[] | null;
    error: string | null;
}) {
    const calendarRef = useRef<FullCalendar>(null);
    const [currentTitle, setCurrentTitle] = useState("loading calendar..");
    const [opened, { open, close }] = useDisclosure(false);
    const [selectedAppointment, setSelectedAppointment] = useState<{
        id: string;
        title: string | null;
        event_datetime: string;
        type: string;
        pets: {
            id: string;
            name: string;
            photoUrl: string | null;
        }[];
    }>();
    const isMobile = useMediaQuery("(max-width: 64rem)");
    const [now, setNow] = useState(new Date());

    const onEventClick = useCallback((info: EventClickArg) => {
        // passed the pet & appointment data on drawer
        // then show modal
        setSelectedAppointment({
            ...(info.event.extendedProps as {
                id: string;
                title: string | null;
                event_datetime: string;
                type: string;
                pets: {
                    id: string;
                    name: string;
                    photoUrl: string | null;
                }[];
            }),
        });
        open();
    }, []);

    const handleDatesSet = (dateInfo: DatesSetArg) => {
        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
            const title = calendarApi.view.title;
            setCurrentTitle(title);
        }
    };

    const getEventClassnames = useCallback((arg: string) => {
        const event_datetime = new Date(arg);
        if (event_datetime && event_datetime < now) return "fc-past-event";
        return "";
    }, []);

    const getEvent = () => {
        const events =
            appointments && appointments.length > 0
                ? appointments.map((v) => ({
                      title:
                          v.title ??
                          `${toTitleCase(v.type)} for ${toTitleCase(v.pets.map((v) => v.name).join(", "))}`,
                      start: new Date(v.event_datetime).toISOString(),
                      end: new Date(v.event_datetime).toISOString(),
                      display: "block",
                      extendedProps: {
                          ...v,
                      },

                      className: getEventClassnames(v.event_datetime),
                  }))
                : undefined;
        return events;
    };

    useEffect(() => {
        // ensure the calendar rendered then assigned the title (e.g January 2026)
        const calendar = calendarRef.current?.getApi();
        const timer = setInterval(() => setNow(new Date()), 60000);

        if (!calendar) return () => clearInterval(timer);
        setCurrentTitle(calendar.view.title);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (error) {
            notifications.show({
                message: error,
                icon: <IconAlertTriangleFilled size={20} />,
                color: "red",
                autoClose: 6000,
            });
        }
    }, [error]);

    return (
        <>
            <div className="justify-between items-center flex ">
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
                events={getEvent()}
                eventClick={onEventClick}
                viewClassNames={"cursor-pointer"}
            />
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
