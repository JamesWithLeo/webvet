"use client";

import multiMonthPlugin from "@fullcalendar/multimonth";
import dayMonthPlugin from "@fullcalendar/daygrid";
import { AdminAppointment } from "@/db/schema/appointments";
import CurrencyFormatter from "@/lib/CurrencyFormatter";
import useAppointmentAdmin from "@/lib/hooks/useAppointmentAdmin";
import useAppointmentToPetsAdmin from "@/lib/hooks/useAppointmnetToPetsAdmin";
import { toTitleCase } from "@/lib/toTitleCase";
import FullCalendar from "@fullcalendar/react";
import {
    ActionIcon,
    Avatar,
    Button,
    Group,
    Loader,
    Stack,
    Text,
    TextInput,
    Title,
} from "@mantine/core";
import {
    IconCalendarEvent,
    IconChevronLeft,
    IconChevronRight,
    IconSearch,
    IconTable,
    IconX,
} from "@tabler/icons-react";
import { formatDistance, formatDistanceToNow, subDays } from "date-fns";
import {
    DataTable,
    DataTableColumn,
    getRecordId,
    useDataTableColumns,
} from "mantine-datatable";
import { useRouter, useSearchParams } from "next/navigation";
import {
    startTransition,
    useActionState,
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import {
    DatesSetArg,
    EventClickArg,
    EventSourceInput,
} from "@fullcalendar/core/index.js";
import { throttle } from "lodash";
import { useMarkAsArrived } from "@/lib/hooks/useMarkAsArrived";
import AppointmentDrawerAdmin from "../appointment/AppointmentDrawerAdmin";
import { DateInput, DatePicker, DatePickerInput } from "@mantine/dates";
import dayjs from "dayjs";

export default function AdminAppointmentTable({
    scope,
}: {
    scope: "all" | "incoming" | "past";
}) {
    const router = useRouter();
    const [now, setNow] = useState(new Date());
    const [currentTitle, setCurrentTitle] = useState("");
    const calendarRef = useRef<FullCalendar>(null);
    const [openedDrawer, { open, close }] = useDisclosure(false);
    const isMobile = useMediaQuery("(max-width: 64rem)", false, {
        getInitialValueInEffect: true,
    });
    const isMedium = useMediaQuery("(max-width: 80rem)", false, {
        getInitialValueInEffect: true,
    });

    const {
        data,
        isLoading,
        setSortStatus,
        sortStatus,
        searchName,
        setSearchName,
        dateRange,
        setDateRange,
    } = useAppointmentAdmin(scope);
    const [selectedRecord, setSelectedRecord] =
        useState<AdminAppointment | null>(null);

    const { handleMarkAsArrived, isPending, isSuccess, state } =
        useMarkAsArrived(() => {
            close();
            setSelectedRecord(null);
        });

    const columns = useMemo<DataTableColumn<AdminAppointment>[]>(
        () => [
            {
                accessor: "firstName", // Use dot notation for nested fields
                title: "Full name",

                render: (
                    { user } // Destructure user from the record
                ) => (
                    <Text>
                        {toTitleCase(user.firstName)}{" "}
                        {toTitleCase(user.lastName)}
                    </Text>
                ),
                filter: (
                    <TextInput
                        label="Clients"
                        description="Show client whose names include the specified text"
                        placeholder="Search client..."
                        leftSection={<IconSearch size={16} />}
                        rightSection={
                            <ActionIcon
                                size="sm"
                                variant="transparent"
                                c="dimmed"
                                onClick={() => setSearchName("")}
                            >
                                <IconX size={14} />
                            </ActionIcon>
                        }
                        defaultValue={searchName}
                        onChange={(e) => {
                            setSearchName(e.currentTarget.value);
                        }}
                    />
                ),
                filtering: searchName !== "",
            },
            { accessor: "title", title: "Title / Reason" },
            {
                accessor: "contactNumber",
                title: "contact no.",
                resizable: true,
                render: ({ user }) => (
                    <Text>{toTitleCase(user.contactNumber)}</Text>
                ),
            },
            {
                accessor: "event_datetime",
                title: "Event Date time",
                resizable: true,
                sortable: true,

                filter: ({ close }) => (
                    <Stack>
                        <DatePicker
                            type="range"
                            defaultValue={dateRange}
                            onChange={(e) => {
                                setDateRange(e);
                            }}
                            presets={[
                                {
                                    label: "Today",
                                    value: [dayjs().format("YYYY-MM-DD"), null],
                                },
                                {
                                    label: "Yesterday",
                                    value: [
                                        dayjs()
                                            .subtract(1, "day")
                                            .format("YYYY-MM-DD"),
                                        dayjs()
                                            .subtract(1, "day")
                                            .format("YYYY-MM-DD"),
                                    ],
                                },
                                {
                                    label: "Last 7 Days",
                                    value: [
                                        dayjs()
                                            .subtract(6, "days")
                                            .format("YYYY-MM-DD"),
                                        dayjs().format("YYYY-MM-DD"),
                                    ],
                                },
                                {
                                    label: "This Month (MTD)",
                                    value: [
                                        dayjs()
                                            .startOf("month")
                                            .format("YYYY-MM-DD"),
                                        dayjs()
                                            .endOf("month")
                                            .format("YYYY-MM-DD"),
                                    ],
                                },
                                {
                                    label: "Last Month",
                                    value: [
                                        dayjs()
                                            .subtract(1, "month")
                                            .startOf("month")
                                            .format("YYYY-MM-DD"),
                                        dayjs()
                                            .subtract(1, "month")
                                            .endOf("month")
                                            .format("YYYY-MM-DD"),
                                    ],
                                },
                                {
                                    label: "Last Year",
                                    value: [
                                        dayjs()
                                            .subtract(1, "year")
                                            .startOf("year")
                                            .format("YYYY-MM-DD"),
                                        dayjs()
                                            .subtract(1, "year")
                                            .endOf("year")
                                            .format("YYYY-MM-DD"),
                                    ],
                                },
                                {
                                    label: "Full Current Year",
                                    value: [
                                        dayjs()
                                            .startOf("year")
                                            .format("YYYY-MM-DD"),
                                        dayjs()
                                            .endOf("year")
                                            .format("YYYY-MM-DD"),
                                    ],
                                },
                            ]}
                        />
                        <Button
                            variant="light"
                            onClick={() => setDateRange([null, null])}
                        >
                            clear date
                        </Button>
                    </Stack>
                ),
                render: (data) => {
                    const eventDate = new Date(data.event_datetime);

                    return (
                        <Text>
                            {eventDate.toLocaleString()}
                            {" -> "}
                            {formatDistanceToNow(eventDate, {
                                addSuffix: true,
                            })}
                        </Text>
                    );
                },
                filtering: !!(dateRange[0] && dateRange[1]),
            },
            {
                accessor: "created_at",
                title: "createdAt",
                resizable: true,
                sortable: true,
                render: (data) => (
                    <Text>
                        {new Date(data.created_at).toLocaleString()}
                        {" -> "}
                        {formatDistance(
                            subDays(new Date(), 0),
                            new Date(data.created_at),
                            { addSuffix: true }
                        )}
                    </Text>
                ),
            },
            {
                accessor: "user.id",
                title: "Action",
                textAlign: "right",
                render: (record) => (
                    <Group justify="right">
                        {!record?.invoice && !record.invoice?.id ? (
                            <Button
                                fullWidth
                                variant="default"
                                size="xs"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsArrived(record);
                                }}
                                disabled={isPending}
                                loading={isPending}
                            >
                                Mark as arrived
                            </Button>
                        ) : (
                            <>
                                {record.invoice.paymentStatus === "PAID" && (
                                    <Button
                                        variant="default"
                                        size="xs"
                                        fullWidth
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            router.push(`/v1/admin/invoice`);
                                        }}
                                    >
                                        View Invoice
                                    </Button>
                                )}

                                {record.invoice.paymentStatus === "UNPAID" &&
                                    record.invoice.status === "COMPLETED" && (
                                        <Button
                                            size="xs"
                                            fullWidth
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (
                                                    record.invoice &&
                                                    record.invoice.id
                                                )
                                                    router.push(
                                                        `/v1/admin/invoice/new/${record.invoice.id}`
                                                    );
                                            }}
                                        >
                                            Generate Invoice
                                        </Button>
                                    )}

                                {record.invoice.status === "ARRIVED" && (
                                    <Button
                                        fullWidth
                                        variant="light"
                                        color="orange"
                                        size="xs"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                        }}
                                        // disabled={isPending}
                                        // loading={isPending}
                                    >
                                        Mark as cancelled
                                    </Button>
                                )}
                            </>
                        )}
                    </Group>
                ),
            },
        ],
        [dateRange, searchName]
    );

    const onEventClick = useCallback(
        throttle(
            (info: EventClickArg) => {
                setSelectedRecord(info.event.extendedProps as AdminAppointment);
                open();
            },
            3000,
            { trailing: false }
        ), // { trailing: false } ensures it fires immediately on the first click
        []
    );

    const getEventClassnames = useCallback((arg: string) => {
        const event_datetime = new Date(arg);
        if (event_datetime && event_datetime < now) return "fc-past-event";
        return "";
    }, []);

    const getEvent = (): EventSourceInput | undefined => {
        const events =
            data && data.length > 0
                ? data.map((event) => ({
                      title: event.title,
                      start: new Date(event.event_datetime).toISOString(),
                      end: new Date(event.event_datetime).toISOString(),
                      display: "block",
                      extendedProps: {
                          ...event,
                      },
                      className: getEventClassnames(event.event_datetime),
                  }))
                : undefined;

        return events;
    };

    const handleDatesSet = (dateInfo: DatesSetArg) => {
        const calendarApi = calendarRef.current?.getApi();
        if (calendarApi) {
            const title = calendarApi.view.title;
            setCurrentTitle(title);
        }
    };

    const searchParams = useSearchParams();
    const view = searchParams.get("view") || "table";

    // 2. To change the view, just update the URL
    const toggleView = () => {
        const params = new URLSearchParams(searchParams);
        params.set("view", view === "table" ? "calendar" : "table");
        router.push(`?${params.toString()}`);
    };

    const key = `admin-appointment-table-${scope}`;
    const { effectiveColumns } = useDataTableColumns<AdminAppointment>({
        key,
        columns: columns,
    });

    useEffect(() => {
        const calendar = calendarRef.current?.getApi();
        const timer = setInterval(() => setNow(new Date()), 60000);

        if (calendar && view === "calendar") {
            setCurrentTitle(calendar.view.title);
        }

        return () => clearInterval(timer);
    }, [view]);

    return (
        <Stack gap={"xl"}>
            <Stack>
                <Group justify="space-between">
                    <Title order={isMobile ? 3 : 1}>Appointment</Title>
                </Group>
                <Group
                    justify={view === "calendar" ? "space-between" : "flex-end"}
                >
                    <label
                        className="lg:text-2xl flex-1 text-lg "
                        hidden={view !== "calendar" && !!currentTitle}
                    >
                        {currentTitle}
                    </label>
                    <div className="flex gap-2" hidden={view !== "calendar"}>
                        <Button.Group>
                            <Button
                                onClick={() =>
                                    calendarRef.current?.getApi().prev()
                                }
                                radius={"md"}
                                size={isMobile ? "xs" : "sm"}
                                variant="default"
                                c="gray.7"
                            >
                                <IconChevronLeft size={20} />
                            </Button>
                            <Button
                                onClick={() =>
                                    calendarRef.current?.getApi().next()
                                }
                                radius={"md"}
                                size={isMobile ? "xs" : "sm"}
                                variant="default"
                                c="gray.7"
                            >
                                <IconChevronRight size={20} />
                            </Button>
                        </Button.Group>
                    </div>
                    <Button
                        variant="default"
                        radius={"md"}
                        size={isMobile ? "xs" : "sm"}
                        onClick={() => {
                            toggleView();
                        }}
                    >
                        {view === "calendar" ? "Table view" : "Calendar view"}
                    </Button>
                </Group>
            </Stack>
            {view === "table" ? (
                <div className="block">
                    <DataTable
                        key={`${scope}-appointment-table`}
                        idAccessor={"id"}
                        withTableBorder={false}
                        withColumnBorders={true}
                        withRowBorders
                        verticalSpacing={"xs"}
                        horizontalSpacing={"xs"}
                        borderRadius="xl"
                        striped
                        pinFirstColumn
                        highlightOnHover={true}
                        fetching={isLoading}
                        minHeight={250}
                        columns={effectiveColumns}
                        pinLastColumn={true}
                        rowExpansion={{
                            allowMultiple: true,
                            content: ({ record, index, collapse }) => (
                                <AppointmentToPetsTable id={record.id} />
                            ),
                        }}
                        records={data}
                        totalRecords={data && data.length ? data.length : 0}
                        page={1}
                        onPageChange={() => {}}
                        recordsPerPage={10}
                        onSortStatusChange={setSortStatus}
                        sortStatus={sortStatus}
                    />
                </div>
            ) : (
                <div className="block">
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[multiMonthPlugin, dayMonthPlugin]}
                        multiMonthMaxColumns={isMedium ? 1 : 2}
                        aspectRatio={isMobile ? 0.8 : 1.9}
                        events={getEvent()}
                        headerToolbar={false}
                        datesSet={handleDatesSet}
                        eventClick={onEventClick}
                        viewClassNames={"cursor-pointer"}
                        dayMaxEventRows={1}
                        dayMaxEvents={1}
                    />
                </div>
            )}

            {selectedRecord && (
                <AppointmentDrawerAdmin
                    selectedRow={selectedRecord}
                    opened={openedDrawer}
                    close={close}
                />
            )}
        </Stack>
    );
}

const AppointmentToPetsTable = ({ id }: { id: string }) => {
    const { data } = useAppointmentToPetsAdmin(id);
    return (
        <Stack p={"md"}>
            {data && data.pets ? (
                data.pets.map((pet) => (
                    <Group key={`${id}-${pet.id}`} gap={"4rem"}>
                        <Group>
                            <Avatar src={pet.photoUrl}>{pet.name[0]}</Avatar>
                            <Stack gap={0}>
                                <Text>{toTitleCase(pet.name)}</Text>
                                <Text size="xs" c={"dimmed"}>
                                    {pet.id}
                                </Text>
                            </Stack>
                        </Group>
                        <Stack gap={0}>
                            <Text size="xs" c={"blue.5"}>
                                Service
                            </Text>
                            <Text size="sm">{pet.title}</Text>
                        </Stack>
                        <Stack gap={0}>
                            <Text size="xs" c={"blue.5"}>
                                Amount
                            </Text>
                            <Text size="sm">
                                {CurrencyFormatter(pet.priceAtBooking)}
                            </Text>
                        </Stack>
                    </Group>
                ))
            ) : (
                <Loader />
            )}
        </Stack>
    );
};
