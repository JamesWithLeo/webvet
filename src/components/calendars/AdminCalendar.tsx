"use client";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import timeGridPlugin from "@fullcalendar/timegrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import {
    DateSelectArg,
    DatesSetArg,
    DayCellContentArg,
} from "@fullcalendar/core/index.js";
import { Box, Button, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useState, useRef, useEffect } from "react";
import { differenceInDays } from "date-fns";
import {
    IconAlertTriangle,
    IconChevronLeft,
    IconChevronRight,
} from "@tabler/icons-react";

type DateCounts = Record<string, number>;

const eventCounts: DateCounts = {
    "2025-11-30": 2,
    "2025-12-01": 5,
    "2025-12-02": 10,
    "2025-12-03": 28,
};

export default function AdminCalendar() {
    const [opened, { open, close }] = useDisclosure(false);

    const [dateStart, setDateStart] = useState<string | null>(null);
    const [dateEnd, setDateEnd] = useState<string | null>(null);
    const [currentTitle, setCurrentTitle] = useState<string>(
        "Loading Calendar..."
    );

    const [isSelectionPending, setIsSelectionPending] =
        useState<boolean>(false);

    const calendarRef = useRef<FullCalendar>(null);

    const handleDatesSet = (dateInfo: DatesSetArg) => {
        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
            const title = calendarApi.view.title;
            setCurrentTitle(title);
        }
    };

    const onDayCellMount = (arg: DayCellContentArg) => {
        const dateStr = arg.date.toISOString().slice(0, 10);
        const count = eventCounts[dateStr] ?? 0;

        let busynessClass = "fc-day-free";

        if (count >= 16) {
            busynessClass = "fc-day-severe";
        } else if (count >= 11) {
            busynessClass = "fc-day-high";
        } else if (count >= 6) {
            busynessClass = "fc-day-medium";
        } else if (count >= 1) {
            busynessClass = "fc-day-low";
        }

        arg.el.classList.add(busynessClass);
    };

    const onDateSelect = (dateArg: DateSelectArg) => {
        setDateStart(dateArg.startStr);
        setDateEnd(dateArg.endStr);

        setIsSelectionPending(true);
    };

    const onDateUnselect = () => {
        setIsSelectionPending(false);
        setDateStart(null);
        setDateEnd(null);
    };

    const handleBlockButtonClick = () => {
        if (isSelectionPending) {
            open();
        }
    };

    const handleCancelBlock = () => {
        close();

        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
            calendarApi.unselect();
        }

        setIsSelectionPending(false);
        setDateStart(null);
        setDateEnd(null);
    };

    const handleConfirmBlock = () => {
        console.log(`CONFIRMED BLOCK: ${dateStart} to ${dateEnd}`);

        handleCancelBlock();
    };

    useEffect(() => {
        const calendar = calendarRef.current?.getApi();
        if (!calendar) return;
        setCurrentTitle(calendar.view.title);
    }, []);

    return (
        <>
            <div className="justify-between mb-3  flex ">
                <label className="text-2xl ">{currentTitle}</label>
                <div className="flex gap-2">
                    <Button
                        hidden={!isSelectionPending}
                        className="fc-ignore-unselect w-min"
                        disabled={!isSelectionPending}
                        onClick={handleBlockButtonClick}
                        size="sm"
                        variant="light"
                    >
                        Enabled Selected Date
                    </Button>
                    <Button
                        hidden={!isSelectionPending}
                        className="fc-ignore-unselect w-min"
                        disabled={!isSelectionPending}
                        onClick={handleBlockButtonClick}
                        size="sm"
                        variant="light"
                        color="red"
                        leftSection={
                            <IconAlertTriangle size={20} stroke={1.5} />
                        }
                    >
                        Block Selected Date
                    </Button>
                    <Button
                        onClick={() =>
                            calendarRef.current?.getApi().view.type ===
                            "multiMonthYear"
                                ? calendarRef.current
                                      ?.getApi()
                                      .changeView("timeGridDay")
                                : calendarRef.current
                                      ?.getApi()
                                      .changeView("multiMonthYear")
                        }
                        size="sm"
                        variant="default"
                    >
                        {calendarRef.current?.getApi().view.type ===
                        "multiMonthYear"
                            ? "Time view"
                            : "Month view"}
                    </Button>
                    <Button.Group>
                        <Button
                            onClick={() => calendarRef.current?.getApi().prev()}
                            size="sm"
                            variant="default"
                        >
                            <IconChevronLeft />
                        </Button>
                        <Button
                            onClick={() => calendarRef.current?.getApi().next()}
                            size="sm"
                            variant="default"
                        >
                            <IconChevronRight />
                        </Button>
                    </Button.Group>
                </div>
            </div>
            <div className="flex-1 bg-white ">
                <FullCalendar
                    ref={calendarRef}
                    defaultAllDay={false}
                    plugins={[
                        dayGridPlugin,
                        multiMonthPlugin,
                        interactionPlugin,
                        timeGridPlugin,
                    ]}
                    initialView="multiMonthYear"
                    aspectRatio={1.8}
                    multiMonthMaxColumns={2}
                    datesSet={handleDatesSet}
                    businessHours={{
                        daysOfWeek: [1, 2, 3, 4, 5, 6],
                        startTime: "08:00",
                        endTime: "17:00",
                    }}
                    headerToolbar={false}
                    selectable={true}
                    select={onDateSelect}
                    unselect={onDateUnselect}
                    unselectCancel=".fc-ignore-unselect"
                    // timeZone="UTC"
                    slotMinTime="08:00:00"
                    slotMaxTime="17:00:00"
                    dayCellDidMount={onDayCellMount}
                />
            </div>

            <Modal
                opened={opened}
                onClose={handleCancelBlock}
                centered
                withCloseButton={false}
                size={"lg"}
            >
                <Box className="flex flex-col gap-6 p-4">
                    <span>
                        <h1 className="text-3xl font-semibold">
                            Blocklist a Date
                        </h1>
                        <h1 className="text-gray-800 mt-2">
                            Blocklisting a date removes all availability for
                            that entire day. No user will be able to schedule,
                            book, or reserve an appointment on the selected
                            date.
                        </h1>
                    </span>
                    <span className="grid grid-cols-[1fr_9fr] ">
                        <h1 className="text-xl col-span-2">
                            Date start: {dateStart ?? "N/A"}
                        </h1>
                        <h1 className="text-xl col-span-2">
                            Date End: {dateEnd ?? "N/A"}
                        </h1>
                        <h1 className="text-xl col-span-2">
                            Days selected:{" "}
                            {dateStart && dateEnd
                                ? differenceInDays(
                                      new Date(dateEnd),
                                      new Date(dateStart)
                                  )
                                : 0}
                        </h1>
                    </span>

                    <span className="w-full flex justify-end gap-4">
                        <Button onClick={handleConfirmBlock} color="#c92a2a">
                            Confirm
                        </Button>
                        <Button
                            variant="subtle"
                            color="gray"
                            onClick={handleCancelBlock}
                        >
                            Cancel
                        </Button>
                    </span>
                </Box>
            </Modal>
        </>
    );
}
