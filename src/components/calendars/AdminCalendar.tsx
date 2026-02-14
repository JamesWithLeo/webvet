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
import {
    Button,
    Group,
    Modal,
    Radio,
    Stack,
    Text,
    Textarea,
    useModalsStack,
} from "@mantine/core";
import { useState, useRef, useEffect } from "react";
import {
    IconAlertTriangle,
    IconCheck,
    IconChevronLeft,
    IconChevronRight,
    IconX,
} from "@tabler/icons-react";
import { eachDayOfInterval, subDays, format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { BlockType } from "@/lib/generateBlockPayload";
import { BlockDatesTypeModel } from "@/db/schema/appointments";
import {
    useAddBlockDates,
    useUpdateBlockDates,
} from "@/lib/hooks/useBlockDates";
import { notifications } from "@mantine/notifications";
import { modals } from "@mantine/modals";

type DateCounts = Record<string, number>;

const eventCounts: DateCounts = {
    "2026-11-30": 2,
    "2026-12-01": 5,
    "2026-12-02": 10,
    "2026-12-03": 28,
};

export default function AdminCalendar() {
    const stack = useModalsStack(["block-dates", "enabled-dates"]);

    const [selectedDates, setSelectedDates] = useState<string[]>([]);
    const [blockType, setBlockType] = useState<BlockType>("all-day");
    const [currentTitle, setCurrentTitle] = useState<string>(
        "Loading Calendar..."
    );
    const [isSelectionPending, setIsSelectionPending] =
        useState<boolean>(false);
    const calendarRef = useRef<FullCalendar>(null);

    const { data } = useQuery({
        queryKey: ["blockedDates"],
        queryFn: async (): Promise<BlockDatesTypeModel[]> => {
            const res = await fetch("/api/blockdates");
            return res.json();
        },
    });

    const { mutateAsync: addBlockDates, isPending: isPendingAddBlockDates } =
        useAddBlockDates();
    const {
        mutateAsync: updateBlockDates,
        isPending: isPendingUpdateBlockDates,
    } = useUpdateBlockDates();

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
        const actualDays = eachDayOfInterval({
            start: new Date(dateArg.startStr),
            end: subDays(new Date(dateArg.endStr), 1),
        });

        const datesToInsert = actualDays.map((d) => format(d, "yyyy-MM-dd"));
        setSelectedDates(datesToInsert);

        setIsSelectionPending(true);
    };

    const onDateUnselect = () => {
        if (stack.state["block-dates"] || stack.state["enabled-dates"]) {
            return;
        }
        setIsSelectionPending(false);
        setSelectedDates([]);
    };

    const handleBlockButtonClick = () => {
        if (isSelectionPending) {
            stack.open("block-dates");
        }
    };
    const handleEnableButtonClick = () => {
        if (isSelectionPending) {
            modals.openConfirmModal({
                id: "confirm-modal",
                title: "Enabled blocklisted date",
                size: "lg",
                withCloseButton: true,
                centered: true,

                labels: {
                    cancel: "cancel",
                    confirm: "confirm",
                },
                children: (
                    <h1 className="text-gray-800">
                        Enabling blocklisted dates will make the dates available
                        to the user.
                    </h1>
                ),

                onConfirm: () => {
                    updateBlockDates(
                        {
                            dates: selectedDates,
                        },
                        {
                            onSuccess: () => {
                                notifications.show({
                                    title: `Dates enabled!`,
                                    message:
                                        "The dates are full available from the client.",
                                    color: "teal",
                                    icon: <IconCheck size={20} />,
                                });
                                // handleCancelBlock();
                                modals.close("confirm-modal");
                            },
                            onError: (error) => {
                                notifications.show({
                                    title: `Enabled dates failed`,
                                    message: error.message,
                                    color: "red",
                                    icon: <IconX size={20} />,
                                });
                                modals.close("confirm-modal");
                            },
                        }
                    );
                },
            });
            // stack.open("enabled-dates");
        }
    };

    // const handleConfirmEnable = () => {
    //     updateBlockDates(
    //         {
    //             dates: selectedDates,
    //         },
    //         {
    //             onSuccess: () => {
    //                 notifications.show({
    //                     title: `Dates enabled!`,
    //                     message:
    //                         "The dates are full available from the client.",
    //                     color: "teal",
    //                     icon: <IconCheck size={20} />,
    //                 });
    //                 handleCancelBlock();
    //             },
    //             onError: (error) => {
    //                 notifications.show({
    //                     title: `Enabled dates failed`,
    //                     message: error.message,
    //                     color: "red",
    //                     icon: <IconX size={20} />,
    //                 });
    //                 handleCancelBlock();
    //             },
    //         }
    //     );
    // };

    const handleCancelBlock = () => {
        stack.closeAll();

        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
            calendarApi.unselect();
        }

        setIsSelectionPending(false);
        setSelectedDates([]);
    };

    const handleConfirmBlock = () => {
        const reason = (document.getElementById("reason") as HTMLInputElement)
            .value;

        addBlockDates(
            {
                dates: selectedDates,
                type: blockType,
                reason: reason,
            },
            {
                onSuccess: () => {
                    notifications.show({
                        title: `Blocked dates!`,
                        message: "The dates are full blocked from the client.",
                        color: "teal",
                        icon: <IconCheck size={20} />,
                    });
                    handleCancelBlock();
                },
                onError: (error) => {
                    notifications.show({
                        title: `Blocked dates failed`,
                        message: error.message,
                        color: "red",
                        icon: <IconX size={20} />,
                    });
                    handleCancelBlock();
                },
            }
        );
    };

    useEffect(() => {
        const calendar = calendarRef.current?.getApi();
        if (!calendar) return;
        setCurrentTitle(calendar.view.title);
    }, []);
    useEffect(() => {
        console.log(data);
    }, [data]);

    return (
        <>
            <div className="justify-between mb-3  flex ">
                <label className="text-2xl ">{currentTitle}</label>
                <div className="flex gap-2">
                    <Button
                        hidden={!isSelectionPending}
                        className="fc-ignore-unselect w-min"
                        disabled={!isSelectionPending}
                        onClick={handleEnableButtonClick}
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
                    events={data?.map((v) => {
                        return {
                            title: v.reason || "Blocked",
                            start: v.startTime.replace(" ", "T"),
                            end: v.endTime.replace(" ", "T"),
                            display: "block",
                            color: "#4a5565",
                        };
                    })}
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
            <Stack align="flex-start">
                <Text>Legends:</Text>
                <Group ml={"md"}>
                    <Text size="sm">Block or disabled dates:</Text>
                    <div className="h-4 w-4 bg-gray-600"></div>
                </Group>
                <Group ml={"md"}>
                    <Text size="sm">Today:</Text>
                    <div className="h-4 w-4 bg-[#228be6]"></div>
                </Group>
            </Stack>

            <Modal.Stack>
                <Modal
                    {...stack.register("block-dates")}
                    className=".fc-ignore-unselect"
                    onClose={handleCancelBlock}
                    centered
                    withCloseButton={false}
                    size={"lg"}
                >
                    <Stack p={"lg"}>
                        <Stack mb={"md"} gap={"0"}>
                            <h1 className="text-3xl font-semibold">
                                Blocklist a Date
                            </h1>
                            <h1 className="text-gray-800 mt-2">
                                Blocklisting a date removes all availability for
                                that entire day. No user will be able to
                                schedule, book, or reserve an appointment on the
                                selected date.
                            </h1>
                        </Stack>
                        <Stack gap={0}>
                            <h1 className="text-xl col-span-2">
                                Date start: {selectedDates[0] ?? "N/A"}
                            </h1>
                            <h1 className="text-xl col-span-2">
                                Date End:{" "}
                                {selectedDates[selectedDates.length - 1] ??
                                    "N/A"}
                            </h1>
                            <h1 className="text-xl col-span-2">
                                Days selected: {selectedDates.length}
                            </h1>
                        </Stack>
                        <Radio.Group
                            label="Select block duration"
                            description="Choose how much of the day to block"
                            withAsterisk
                            mb={"md"}
                            value={blockType}
                            onChange={(value) => {
                                setBlockType(value as BlockType);
                            }}
                        >
                            <Group mt="xs">
                                <Radio label="All day" value={"all-day"} />
                                <Radio label="Morning only" value={"morning"} />
                                <Radio
                                    label="Afternoon only"
                                    value={"afternoon"}
                                />
                            </Group>
                        </Radio.Group>

                        <Textarea
                            maxLength={255}
                            label="Reason"
                            withAsterisk
                            id="reason"
                            description="This shows to users why the dates are being blocked"
                            placeholder="e.g. Staff Training, Public Holiday"
                        />

                        <span className="w-full flex justify-end gap-4">
                            <Button
                                variant="default"
                                color="gray"
                                onClick={handleCancelBlock}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleConfirmBlock}
                                bg={"red"}
                                disabled={
                                    !selectedDates.length ||
                                    isPendingAddBlockDates
                                }
                                loading={isPendingAddBlockDates}
                            >
                                Confirm
                            </Button>
                        </span>
                    </Stack>
                </Modal>
                <Modal
                    {...stack.register("enabled-dates")}
                    className=".fc-ignore-unselect"
                    centered
                    size={"lg"}
                    padding={"lg"}
                    title="Enabled blocklisted date"
                >
                    <Stack p={"lg"}>
                        <h1 className="text-gray-800">
                            Enabling blocklisted dates will make the dates
                            available to the user.
                        </h1>
                        <span className="w-full flex justify-end gap-4">
                            <Button
                                variant="default"
                                color="gray"
                                onClick={handleCancelBlock}
                            >
                                Cancel
                            </Button>
                            <Button
                                onClick={handleEnableButtonClick}
                                bg={"red"}
                                disabled={
                                    !selectedDates.length ||
                                    isPendingUpdateBlockDates
                                }
                                loading={isPendingUpdateBlockDates}
                            >
                                Confirm
                            </Button>
                        </span>
                    </Stack>
                </Modal>
            </Modal.Stack>
        </>
    );
}
